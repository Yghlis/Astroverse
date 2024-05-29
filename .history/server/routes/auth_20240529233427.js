import express from 'express';
import authController from '../controllers/auth.js'; // Mettez à jour cette ligne si nécessaire

const router = express.Router();

router.get('/login', authController.getLogin);

export default router;
