import express from 'express';
import authController from '../controllers/auth.js'; // Assurez-vous que le chemin est correct

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.postForgotPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.resetPasswordGet);
router.post('/change-password', authController.postChangePassword); // Assurez-vous que cette fonction est bien définie

export default router;
