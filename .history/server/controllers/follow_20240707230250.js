import Follow from '../models/follow.js';
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
export const followProduct = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;
  try {
    const follow = await Follow.create({ userId, productId });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Suivre un univers
export const followUniverse = async (req, res) => {
  const { userId } = req.body;
  const { universeId } = req.params;
  try {
    const follow = await Follow.create({ userId, universeId });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Arrêter de suivre un produit
export const unfollowProduct = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;
  try {
    const follow = await Follow.destroy({ where: { userId, productId } });
    if (follow) {
      res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      res.status(404).json({ error: 'Follow record not found' });
    }
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
export const notifyProductChange = async (product, previousStock, previousPromotion) => {
  try {
    const followers = await Follow.findAll({ where: { productId: product.id }, include: [User] });
    console.log(`Found ${followers.length} followers for product ${product.title} with ID ${product.id}`);
    
    for (const follow of followers) {
      const user = follow.User;
      console.log(`Checking conditions for user ${user.email}`);
      
      const currentStock = product.stock;
      const currentPromotion = product.is_promotion;
      
      console.log(`Previous stock: ${previousStock}, Current stock: ${currentStock}`);
      console.log(`Previous promotion: ${previousPromotion}, Current promotion: ${currentPromotion}`);
      
      if (currentStock === 0) {
        console.log(`Notifying ${user.email} that product ${product.title} is out of stock`);
        const emailContent = `Le produit ${product.title} est en rupture de stock.`;
        await sendEmail(user.email, 'Produit en rupture de stock', emailContent);
      } else if (previousStock === 0 && currentStock > 0) {
        console.log(`Notifying ${
