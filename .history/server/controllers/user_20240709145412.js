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
    console.log('Error retrieving users:', error);
    res.sendStatus.json(500);
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;  

  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.sendStatus.json(403); 
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

  let transaction;
  try {
    transaction = await sequelize.transaction();
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUserData = {
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      phone_number,
      address,
      roles: ['ROLE_USER'], // Par défaut, chaque nouvel utilisateur est un utilisateur standard
      isEmailVerified: false, // Par défaut, chaque nouvel utilisateur doit vérifier son email
      mustChangePassword: false, // Par défaut, chaque nouvel utilisateur n'a pas besoin de changer son mot de passe
      lastPasswordChange: new Date()
    };  

    // Si l'utilisateur authentifié et a le rôle d'administrateur, isEmailVerified est défini sur true
    if (req.user.role == 'ROLE_ADMIN') {
      newUserData.isEmailVerified = true; // Marquer l'email comme vérifié
      if (roles) {
        newUserData.roles = roles;
      }
      if (mustChangePassword !== undefined) {
        newUserData.mustChangePassword = mustChangePassword;
      }
    }

    const newUser = await User.create(newUserData, { transaction });

    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.log('Error creating user:', error);
    res.sendStatus(500);
  }
};




// Mise à jour de l'utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;
  const {
    first_name,
    last_name,
    email,
    password_hash,
    phone_number,
    address,
    roles,
    isEmailVerified,
    mustChangePassword,
    resetPasswordReminder,
    toggleNewsletterSubscription,
  } = req.body;

  // Vérifiez si l'utilisateur authentifié est soit l'utilisateur en question soit un administrateur
  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.sendStatus(403); // Accès interdit
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.sendStatus(404);
    }

    // Vérifiez si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({
        where: { email, user_id: { [Op.ne]: id } },
        transaction,
      });
      if (existingUser) {
        await transaction.rollback();
        return res.sendStatus(400);
      }
    }

    const hashedPassword = password_hash
      ? await bcrypt.hash(password_hash, 10)
      : user.password_hash;

    // Mettre à jour les champs fournis
    await user.update(
      {
        first_name: first_name !== undefined ? first_name : user.first_name,
        last_name: last_name !== undefined ? last_name : user.last_name,
        email: email !== undefined ? email : user.email,
        password_hash: hashedPassword,
        phone_number: phone_number !== undefined ? phone_number : user.phone_number,
        address: address !== undefined ? address : user.address,
        roles: roles !== undefined && req.user.role === 'ROLE_ADMIN' ? roles : user.roles,
        isEmailVerified: isEmailVerified !== undefined && req.user.role === 'ROLE_ADMIN' ? isEmailVerified : user.isEmailVerified,
        mustChangePassword: mustChangePassword !== undefined ? mustChangePassword : user.mustChangePassword,
        lastPasswordChange: resetPasswordReminder ? new Date() : password_hash ? new Date() : user.lastPasswordChange,
      },
      { transaction }
    );

    // Gestion de l'abonnement à la newsletter
    if (toggleNewsletterSubscription !== undefined) {
      console.log(`Toggling newsletter subscription for user ${id}. Current status: ${user.isSubscribedToNewsletter}`);
      user.isSubscribedToNewsletter = toggleNewsletterSubscription; // Appliquez directement la valeur reçue
      await user.save({ transaction });
      console.log(`New newsletter subscription status for user ${id}: ${user.isSubscribedToNewsletter}`);

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: user.isSubscribedToNewsletter
          ? 'Confirmation d\'inscription à la newsletter'
          : 'Désinscription de la newsletter',
        html: user.isSubscribedToNewsletter
          ? '<p>Merci de vous être inscrit à notre newsletter ! Vous recevrez bientôt des nouvelles de notre part.</p>'
          : '<p>Vous vous êtes désinscrit de notre newsletter. Vous ne recevrez plus de nouvelles de notre part.</p>',
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(
          `Email sent to ${user.email} for ${
            user.isSubscribedToNewsletter ? 'subscription' : 'unsubscription'
          }`
        );
      } catch (emailError) {
        console.log('Error sending email:', emailError);
      }
    }

    await transaction.commit();
    res.status(200).json(user);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.log('Error updating user:', error);
    res.sendStatus(500);
  }
};


// Suppression de l'utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const authenticatedUserId = req.user.userId;

  if (id !== authenticatedUserId && req.user.role !== 'ROLE_ADMIN') {
    return res.sendStatus(403); 
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.sendStatus(404);
    }

    await user.destroy({ transaction });
    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log('Error deleting user:', error);
    res.sendStatus(500);
  }
};
