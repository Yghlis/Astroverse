import Newsletter from '../models/ewsletter.js';
import User from '../models/user.js';
import { transporter } from './auth.js'; // Assurez-vous que le transporteur est exporté correctement
import multer from 'multer';
import path from 'path';

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

    const [newsletter, created] = await Newsletter.findOrCreate({
      where: { id: 1 }, // En supposant qu'il n'y ait qu'un seul enregistrement de newsletter
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
