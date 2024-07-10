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



// Suivre un produit








// Récupérer les produits suivis par un utilisateur
