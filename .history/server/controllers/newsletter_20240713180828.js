  import Newsletter from '../models/Newsletters.js';
  import User from '../models/user.js';
  import multer from 'multer';
  import path from 'path';
  import fs from 'fs';
  import nodemailer from 'nodemailer';


  // Configurer le transporteur de courriel
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configurer Multer pour sauvegarder les fichiers
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  export const upload = multer({ storage });

  export const updateNewsletterPdf = async (req, res) => {
    try {
      if (!req.file) {
        return res.sendStatus(400); 
      }

      const pdfUrl = `/uploads/${req.file.filename}`;

      // Utiliser un UUID fixe pour la newsletter unique
      const newsletterId = '00000000-0000-0000-0000-000000000001';

      const [newsletter, created] = await Newsletter.findOrCreate({
        where: { id: newsletterId },
        defaults: { pdfUrl },
      });

      if (!created && newsletter.pdfUrl) {
        const oldPdfPath = path.resolve(`.${newsletter.pdfUrl}`);
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
      }

      newsletter.pdfUrl = pdfUrl;
      await newsletter.save();

      const subscribedUsers = await User.findAll({ where: { isSubscribedToNewsletter: true } });

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

      res.sendStatus(200); 
    } catch (error) {
      console.error("Error updating newsletter:", error);
      res.sendStatus(500); 
    }
  };
