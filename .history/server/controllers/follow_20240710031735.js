import Follow from '../models/Follow.js';
import User from '../models/user.js';
import Product from '../models/Product.js';
import Universe from '../models/Universe.js';
import nodemailer from 'nodemailer';

// Configurer le transporteur de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', to);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

// Suivre un produit


// Suivre un univers
export const followUniverse = async (req, res) => {
  const { userId } = req.body;
  const { universeId } = req.params;
  try {
    const existingFollow = await Follow.findOne({ where: { userId, universeId } });
    if (existingFollow) {
      return res.status(409).json({ error: 'User already follows this universe' });
    }
    const follow = await Follow.create({ userId, universeId });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Arrêter de suivre un univers
export const unfollowUniverse = async (req, res) => {
  const { userId } = req.body;
  const { universeId } = req.params;
  try {
    const follow = await Follow.destroy({ where: { userId, universeId } });
    if (follow) {
      res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      res.status(404).json({ error: 'Follow record not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Notification lors du changement de stock ou de promotion


// Notification lors de la création d'un nouveau produit dans un univers suivi
export const notifyNewProductInUniverse = async (product) => {
  try {
    const universe = await Universe.findByPk(product.universe); // Récupérer l'univers
    const followers = await Follow.findAll({ where: { universeId: product.universe }, include: [User] });
    for (const follow of followers) {
      const user = follow.User;
      const emailContent = `Un nouveau produit ${product.title} a été ajouté dans l'univers ${universe.name} que vous suivez.`;
      await sendEmail(user.email, 'Nouveau produit dans un univers suivi', emailContent);
    }
  } catch (error) {
    console.error('Error in notifyNewProductInUniverse:', error);
  }
};

// Récupérer les produits suivis par un utilisateur
