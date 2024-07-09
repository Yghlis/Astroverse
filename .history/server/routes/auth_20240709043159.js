import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.postForgotPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset-password/:token', authController.resetPasswordGet);
router.post('/change-password', authController.postChangePassword);
router.get('/verify-token', authenticateToken, (req, res) => {
    res.sendStatus(200); // Token valide
  });

export default router;
