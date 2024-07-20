import express from 'express';
import { createOrder,deleteOrder,getOrderByPaymentIntent,handleStripeWebhook, get } from '../controllers/order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour créer une commande
router.post('/', authenticateToken, createOrder);

router.delete('/:orderId', authenticateToken, deleteOrder);

router.get('/:paymentIntentId',authenticateToken, getOrderByPaymentIntent);

router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Route pour récupérer toutes les commandes
router.get('/', authenticateToken, getAllOrders);

export default router;
