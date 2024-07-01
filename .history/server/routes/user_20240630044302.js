import express from 'express';
import { getUsers, getUserById, addUser, updateUser, deleteUser } from '../controllers/user.js';

const router = express.Router();

// Obtenir tous les utilisateurs
router.get('/', getUsers);

// Obtenir un utilisateur par ID
router.get('/:id', getUserById);

// Créer un nouvel utilisateur
router.post('/', addUser);

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

export default router;
