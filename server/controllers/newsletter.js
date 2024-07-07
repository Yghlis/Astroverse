import Newsletter from '../models/Newsletters.js';
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Configure Multer pour sauvegarder les fichiers
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

    for (const user of subscribedUsers) {
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

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: 'La Newsletter à été mise a jour et envoyée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
