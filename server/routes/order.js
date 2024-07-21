import express from 'express';
import { createOrder,deleteOrder,getOrderByPaymentIntent,handleStripeWebhook, getAllOrders,updateOrderStatus,getOrderById,refundOrder } from '../controllers/order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:orderId', authenticateToken, getOrderById);
// Route pour créer une commande
router.post('/', authenticateToken, createOrder);

router.delete('/:orderId', authenticateToken, deleteOrder);

router.get('/payment-intent/:paymentIntentId',authenticateToken, getOrderByPaymentIntent);
// Route pour récupérer toutes les commandes
router.get('/', authenticateToken, getAllOrders);

router.post('/refund/:orderId', authenticateToken, refundOrder);




router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);



router.patch('/:orderId', authenticateToken, updateOrderStatus); 

export default router;
