import express from 'express';
import { 
  createOrder, 
  deleteOrder, 
  getOrderByPaymentIntent, 
  handleStripeWebhook, 
  getAllOrders, 
  updateOrderStatus, 
  getOrderById 
} from '../controllers/order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour créer une commande
router.post('/', authenticateToken, createOrder);

// Route pour récupérer une commande par PaymentIntentId
router.get('/payment-intent/:paymentIntentId', authenticateToken, getOrderByPaymentIntent);

// Route pour récupérer une commande par ID
router.get('/:orderId', authenticateToken, getOrderById);

// Route pour supprimer une commande par ID
router.delete('/:orderId', authenticateToken, deleteOrder);

// Route pour récupérer toutes les commandes
router.get('/', authenticateToken, getAllOrders);

// Route pour le webhook Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Route pour mettre à jour le statut d'une commande
router.patch('/:orderId', authenticateToken, updateOrderStatus);

export default router;
