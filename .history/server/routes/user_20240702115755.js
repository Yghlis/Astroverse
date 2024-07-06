import express from 'express';
import { getUsers, getUserById, addUser, addUserFromBackoffice, updateUser, deleteUser } from '../controllers/user.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Obtenir tous les utilisateurs (accessible uniquement aux administrateurs)
router.get('/', authenticateToken, requireRole('ROLE_ADMIN'), getUsers);

// Obtenir un utilisateur par ID (accessible uniquement à l'utilisateur authentifié ou aux administrateurs)
router.get('/:id', authenticateToken, getUserById);

// Créer un nouvel utilisateur depuis le site (accessible à tous)
router.post('/', addUser);

// Créer un nouvel utilisateur depuis le backoffice (accessible uniquement aux administrateurs)
router.post('/admin', authenticateToken, requireRole('ROLE_ADMIN'), addUserFromBackoffice);

// Mettre à jour un utilisateur (accessible uniquement aux administrateurs)
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), updateUser);

// Supprimer un utilisateur (accessible uniquement aux administrateurs)
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteUser);

export default router;
