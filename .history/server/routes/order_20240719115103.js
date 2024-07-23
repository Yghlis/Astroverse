import express from 'express';
import { createOrder,deleteOrder } from '../controllers/order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour créer une commande
router.post('/', authenticateToken, createOrder);

router.delete('/:orderId', authenticateToken, deleteOrder);

router.get('/orders/:paymentIntentId',authenticateToken, getOrderByPaymentIntent);



export default router;
