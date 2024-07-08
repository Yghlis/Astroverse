import Follow from '../models/follow.js';
import User from '../models/user.js';
import Product from '../models/Product.js';
import Universe from '../models/Universe.js';
import nodemailer from 'nodemailer';

// Configurer le transporteur de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Votre email
    pass: process.env.PASSWORD // Votre mot de passe
  }
});

// Fonction pour envoyer un email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Suivre un produit
export const followProduct = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const follow = await Follow.create({ userId, productId });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Suivre un univers
export const followUniverse = async (req, res) => {
  const { userId, universeId } = req.body;
  try {
    const follow = await Follow.create({ userId, universeId });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Arrêter de suivre
export const unfollow = async (req, res) => {
  const { userId, productId, universeId } = req.body;
  try {
    let follow;
    if (productId) {
      follow = await Follow.destroy({ where: { userId, productId } });
    } else if (universeId) {
      follow = await Follow.destroy({ where: { userId, universeId } });
    }
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
export const notifyProductChange = async (product) => {
  try {
    const followers = await Follow.findAll({ where: { productId: product.id }, include: [User] });
    followers.forEach(follow => {
      const user = follow.User;
      if (product.stock === 0) {
        sendEmail(user.email, 'Produit en rupture de stock', `Le produit ${product.title} est en rupture de stock.`);
      } else if (product.previous('stock') === 0 && product.stock > 0) {
        sendEmail(user.email, 'Produit de nouveau en stock', `Le produit ${product.title} est de nouveau en stock.`);
      }

      if (product.is_promotion && product.previous('is_promotion') === false) {
        sendEmail(user.email, 'Produit en promotion', `Le produit ${product.title} est maintenant en promotion.`);
      } else if (!product.is_promotion && product.previous('is_promotion') === true) {
        sendEmail(user.email, 'Produit plus en promotion', `Le produit ${product.title} n'est plus en promotion.`);
      }
    });
  } catch (error) {
    console.error('Error in notifyProductChange:', error);
  }
};

// Notification lors de la création d'un nouveau produit dans un univers suivi
export const notifyNewProductInUniverse = async (product) => {
  try {
    const followers = await Follow.findAll({ where: { universeId: product.universe }, include: [User] });
    followers.forEach(follow => {
      const user = follow.User;
      sendEmail(user.email, 'Nouveau produit dans un univers suivi', `Un nouveau produit ${product.title} a été ajouté dans l'univers que vous suivez.`);
    });
  } catch (error) {
    console.error('Error in notifyNewProductInUniverse:', error);
  }
};
