import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// Obtenir tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Obtenir un utilisateur par ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  const { first_name, last_name, email, password, phone_number, address } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ first_name, last_name, email, password_hash: hash, phone_number, address });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  const { first_name, last_name, email, phone_number, address } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update({ first_name, last_name, email, phone_number, address });
      res.json({ message: 'User updated', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
