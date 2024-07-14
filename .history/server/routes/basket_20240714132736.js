import express from 'express';
import { addToBasket } from '../controllers/basket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/add',addToBasket);

export default router;
