import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

// Routes existantes
router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);

// Ajouter une nouvelle route pour la vérification de l'email
router.get('/verify-email', authController.verifyEmail);

export default router;
