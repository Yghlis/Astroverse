  import Newsletter from '../models/Newsletters.js';
  import User from '../models/user.js';
  import multer from 'multer';
  import path from 'path';
  import fs from 'fs';
  import { z } from 'zod';
  import nodemailer from 'nodemailer';
  import sequelize from '../config/database.js';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  export const upload = multer({ storage });

  const updateNewsletterSchema = z.object({
    file: z.any(),
  });

  export const updateNewsletterPdf = async (req, res) => {
    try {
      if (!req.file) {
        return res.sendStatus(400); 
      }
  
      try {
        updateNewsletterSchema.parse({ file: req.file });
      } catch (e) {
        return res.status(400).json({ available: false, message: 'Validation error', details: e.errors });
      }
  
      const pdfUrl = `/uploads/${req.file.filename}`;

      const newsletterId = '00000000-0000-0000-0000-000000000001';
  
      const transaction = await sequelize.transaction();
  
      try {
        const [newsletter, created] = await Newsletter.findOrCreate({
          where: { id: newsletterId },
          defaults: { pdfUrl },
          transaction,
        });
  
        if (!created && newsletter.pdfUrl) {
          const oldPdfPath = path.resolve(`.${newsletter.pdfUrl}`);
          if (fs.existsSync(oldPdfPath)) {
            fs.unlinkSync(oldPdfPath);
          }
        }
  
        newsletter.pdfUrl = pdfUrl;
        await newsletter.save({ transaction });
  
        const subscribedUsers = await User.findAll({ where: { isSubscribedToNewsletter: true }, transaction });
  
        const emailPromises = subscribedUsers.map(user => {
          const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Nouvelle Newsletter Disponible',
            html: 'La nouvelle newsletter est disponible en pièce jointe.',
            attachments: [
              {
                filename: 'Newsletter.pdf',
                path: path.resolve(`.${pdfUrl}`), 
              },
            ],
          };
  
          return transporter.sendMail(mailOptions);
        });
  
        await Promise.all(emailPromises);
  
        await transaction.commit();
        res.sendStatus(200); 
      } catch (error) {
        await transaction.rollback();
        console.error("Error updating newsletter:", error);
        res.sendStatus(500); 
      }
    } catch (error) {
      console.error("Error in main try-catch:", error);
      res.sendStatus(500); 
    }
  };

  export const getNewsletterPdf = async (req, res) => {
    try {
      const newsletterId = '00000000-0000-0000-0000-000000000001';
      const newsletter = await Newsletter.findByPk(newsletterId);
  
      if (!newsletter || !newsletter.pdfUrl) {
        return res.sendStatus(404);
      }
  
      const pdfPath = path.resolve(`.${newsletter.pdfUrl}`);
      if (!fs.existsSync(pdfPath)) {
        return res.sendStatus(404);
      }
  
      res.sendFile(pdfPath);
    } catch (error) {
      console.error("Error getting newsletter:", error);
      res.sendStatus(500);
    }
  };
