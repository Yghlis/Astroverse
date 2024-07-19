import express from 'express';
import { createOrder } from '../controllers/order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour créer une commande
router.post('/', authenticateToken, createOrder);

router.delete('/:orderId', authenticateToken, deleteOrder);



export default router;
