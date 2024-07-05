import express from 'express';
import { getUsers, getUserById, addUser, addUserFromBackoffice, updateUser, deleteUser, resetPasswordChangeReminder } from '../controllers/user.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.get('/', authenticateToken, requireRole('ROLE_ADMIN'), getUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', addUser);
router.post('/admin', authenticateToken, requireRole('ROLE_ADMIN'), addUserFromBackoffice);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), updateUser);
router.put('/:id/password-reminder-reset', authenticateToken, resetPasswordChangeReminder);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteUser);


export default router;
