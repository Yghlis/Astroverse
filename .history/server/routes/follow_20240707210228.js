import express from 'express';
import { followProduct, followUniverse, unfollowProduct, unfollowUniverse } from '../controllers/follow.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour suivre un produit
router.post('/products/:productId/follow', authenticateToken, followProduct);

// Route pour suivre un univers
router.post('/universes/:universeId/follow', authenticateToken, followUniverse);

// Route pour arrêter de suivre un produit
router.delete('/products/:productId/follow', authenticateToken, unfollowProduct);

// Route pour arrêter de suivre un univers
router.delete('/universes/:universeId/follow', authenticateToken, unfollowUniverse);

export default router;
