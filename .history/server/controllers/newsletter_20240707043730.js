import Newsletter from '../models/Newsletters.js';
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; // Importer la fonction pour générer des UUID

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

    // Générer un UUID dynamique pour chaque nouvelle newsletter
    const newsletterId = uuidv4();

    const [newsletter, created] = await Newsletter.findOrCreate({
      where: { id: newsletterId }, // Utilisez un UUID valide
      defaults: { pdfUrl },
    });

    if (!created) {
      newsletter.pdfUrl = pdfUrl;
      await newsletter.save();
    }

    // Récupérer les utilisateurs inscrits
    const subscribedUsers = await User.findAll({ where: { isSubscribedToNewsletter: true } });

    // Envoyer le PDF à chaque utilisateur inscrit
    for (const user of subscribedUsers) {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Nouvelle Newsletter Disponible',
        html: 'La nouvelle newsletter est disponible en pièce jointe.',
        attachments: [
          {
            filename: 'newsletter.pdf',
            path: path.resolve(`.${pdfUrl}`), // Utiliser path.resolve pour obtenir le chemin absolu
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: 'Newsletter updated and emails sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
