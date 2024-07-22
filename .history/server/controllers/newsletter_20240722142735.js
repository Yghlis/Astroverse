  import Newsletter from '../models/Newsletters.js';
  import User from '../models/user.js';
  import multer from 'multer';
  import path from 'path';
  import fs from 'fs';
  import { z } from 'zod';
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

  const updateNewsletterSchema = z.object({
    file: z.any(),
  });

  

  export const getNewsletterPdf = async (req, res) => {
    try {
      // Utiliser un UUID fixe pour la newsletter unique
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
