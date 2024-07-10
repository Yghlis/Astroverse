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








// Récupérer les produits suivis par un utilisateur
