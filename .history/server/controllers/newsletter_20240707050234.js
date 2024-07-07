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
    const extension = path.extname(file.originalname);
    cb(null, `Newsletter${extension}`);
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

    // Chemin absolu vers le nouveau fichier PDF
    const newPdfPath = path.resolve(`.${pdfUrl}`);

    // Supprimer l'ancien fichier PDF si un fichier existant est remplacé
    if (!created && newsletter.pdfUrl && fs.existsSync(newPdfPath)) {
        const oldPdfPath = path.resolve(`.${newsletter.pdfUrl}`);
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
    }

    // Mettre à jour la URL du PDF dans la base de données
    newsletter.pdfUrl = pdfUrl;
    await newsletter.save();

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
            filename: `Newsletter${path.extname(pdfUrl)}`,
            path: newPdfPath, // Utiliser le chemin absolu du nouveau fichier PDF
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
