import User from '../models/user.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// Récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;  // Assurez-vous d'utiliser la bonne clé pour l'ID utilisateur

  // Vérifiez le rôle admin
  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouvel utilisateur depuis le site 
export const addUser = async (req, res) => {
  const { first_name, last_name, email, password_hash, phone_number, address } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10); // Hasher le mot de passe

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword, 
      phone_number,
      address,
      roles: ['ROLE_USER'], 
      isEmailVerified: true, 
      mustChangePassword: true,
      lastPasswordChange: new Date() // Initialisation de lastPasswordChange
    }, { transaction });

    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouvel utilisateur depuis le backoffice
export const addUserFromBackoffice = async (req, res) => {
  const { first_name, last_name, email, password_hash, phone_number, address, roles, isEmailVerified, mustChangePassword } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10); 

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword, 
      phone_number,
      address,
      roles,
      isEmailVerified,
      mustChangePassword,
      lastPasswordChange: new Date()
    }, { transaction });

    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Mise à jour de l'utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password_hash, phone_number, address, roles, isEmailVerified, mustChangePassword } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingUser = await User.findOne({ where: { email, user_id: { [Op.ne]: id } } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = password_hash ? await bcrypt.hash(password_hash, 10) : user.password_hash; 

    await user.update({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword, 
      phone_number,
      address,
      roles,
      isEmailVerified,
      mustChangePassword: mustChangePassword !== undefined ? mustChangePassword : user.mustChangePassword,
      lastPasswordChange: password_hash ? new Date() : user.lastPasswordChange
    }, { transaction });

    await transaction.commit();
    res.json(user);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const resetPasswordChangeReminder = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      lastPasswordChange: new Date(),
      mustChangePassword: false
    }, { transaction });

    await transaction.commit();
    res.json({ message: 'Password change reminder reset successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy({ transaction });
    await transaction.commit();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const toggleNewsletterSubscription = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!req.user.role) {
    return res.status(500).json({ error: 'User role is not defined' });
  }

  // Vérifiez si l'utilisateur connecté essaie de mettre à jour son propre abonnement
  if (id !== req.user.userId && req.user.role !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Access forbidden' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Basculer l'état de l'abonnement
    user.isSubscribedToNewsletter = !user.isSubscribedToNewsletter;
    await user.save();

    const message = user.isSubscribedToNewsletter 
      ? 'Vous avez bien été inscrit à la newsletter'
      : 'Vous avez bien été désinscrit de la newsletter';

    if (user.isSubscribedToNewsletter) {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Confirmation d\'inscription à la newsletter',
        html: '<p>Merci de vous être inscrit à notre newsletter ! Vous recevrez bientôt des nouvelles de notre part.</p>'
      };

      await transporter.sendMail(mailOptions);
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Désinscription de la newsletter',
        html: '<p>Vous vous êtes désinscrit de notre newsletter. Vous ne recevrez plus de nouvelles de notre part.</p>'
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: message, isSubscribedToNewsletter: user.isSubscribedToNewsletter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
