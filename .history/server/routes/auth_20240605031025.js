import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

// Routes existantes
router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/verify-email', authController.verifyEmail);

export default router;
