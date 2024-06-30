import User from '../models/user.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt'; // Assurez-vous d'importer bcrypt

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

// Créer un nouvel utilisateur
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
      password_hash: hashedPassword, // Utiliser le mot de passe hashé
      phone_number,
      address,
    }, { transaction });

    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password_hash, phone_number, address, roles, isEmailVerified } = req.body;

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

    const hashedPassword = password_hash ? await bcrypt.hash(password_hash, 10) : user.password_hash; // Hasher le mot de passe si fourni

    await user.update({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword, // Utiliser le mot de passe hashé
      phone_number,
      address,
      roles,
      isEmailVerified
    }, { transaction });

    await transaction.commit();
    res.json(user);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un utilisateur
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
