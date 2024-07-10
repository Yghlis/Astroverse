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
    res.status(200).json(users);
  } catch (error) {
    res.sendStatus(500);
  }
};


// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;  

  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.sendStatus(403); // Accès interdit
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.sendStatus(404);
    }
    res.status(200).json(user);
  } catch (error) {
    res.sendStatus(500);
  }
};

// Créer un nouvel utilisateur
export const addUser = async (req, res) => {
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
      roles: roles || ['ROLE_USER'],
      isEmailVerified: isEmailVerified !== undefined ? isEmailVerified : true,
      mustChangePassword: mustChangePassword !== undefined ? mustChangePassword : true, 
      lastPasswordChange: new Date()
    }, { transaction });

    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500);
  }
};


// Mise à jour de l'utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;
  const { first_name, last_name, email, password_hash, phone_number, address, roles, isEmailVerified, mustChangePassword } = req.body;

  // Vérifiez si l'utilisateur authentifié est soit l'utilisateur en question soit un administrateur
  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Vérifiez si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = password_hash ? await bcrypt.hash(password_hash, 10) : user.password_hash; 

    // Mettez à jour uniquement les champs fournis
    const updatedUser = await user.update({
      first_name: first_name !== undefined ? first_name : user.first_name,
      last_name: last_name !== undefined ? last_name : user.last_name,
      email: email !== undefined ? email : user.email,
      password_hash: hashedPassword, 
      phone_number: phone_number !== undefined ? phone_number : user.phone_number,
      address: address !== undefined ? address : user.address,
      roles: roles !== undefined && req.user.role === 'ROLE_ADMIN' ? roles : user.roles, // Seuls les administrateurs peuvent modifier les rôles
      isEmailVerified: isEmailVerified !== undefined && req.user.role === 'ROLE_ADMIN' ? isEmailVerified : user.isEmailVerified,
      mustChangePassword: mustChangePassword !== undefined ? mustChangePassword : user.mustChangePassword,
      lastPasswordChange: password_hash ? new Date() : user.lastPasswordChange
    }, { transaction });

    await transaction.commit();
    res.status(200).json(updatedUser);
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500);
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

// Suppression de l'utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;

  // Vérifiez si l'utilisateur authentifié est soit l'utilisateur en question soit un administrateur
  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.sendStatus(403); // Accès interdit
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.sendStatus(404);
    }

    await user.destroy({ transaction });
    await transaction.commit();
    res.sendStatus(200); // Suppression réussie
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500); // Internal Server Error
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
