import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);

export default router;

