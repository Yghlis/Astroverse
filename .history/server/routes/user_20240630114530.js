import express from 'express';
import { getUsers, getUserById, addUser, addUserFromBackoffice, updateUser, deleteUser } from '../controllers/user.js';

const router = express.Router();

// Obtenir tous les utilisateurs
router.get('/', getUsers);

// Obtenir un utilisateur par ID
router.get('/:id', getUserById);

// Créer un nouvel utilisateur depuis le site
router.post('/', addUser);

// Créer un nouvel utilisateur depuis le backoffice
router.post('/admin/add', addUserFromBackoffice);

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

export default router;
