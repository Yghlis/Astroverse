import express from 'express';
import { getUsers, getUserById, addUser, updateUser, deleteUser, toggleNewsletterSubscription } from '../controllers/user.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireRole('ROLE_ADMIN'), getUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', addUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);
router.put('/:id/newsletter-subscription', authenticateToken, toggleNewsletterSubscription);

export default router;
