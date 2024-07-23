import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour créer une commande
router.post('/', authenticateToken, createOrder);

export default router;
