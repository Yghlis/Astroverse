import express from 'express';
import { addToBasket, decrementFromBasket, removeFromBasket, getBasket,checkBasketItems } from '../controllers/basket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', addToBasket);
router.post('/decrement', decrementFromBasket);

router.get('/', getBasket);

// Route pour vérifier si le panier contient des produits
router.get('/check-items', authenticateToken, checkBasketItems);

// Route pour supprimer un produit du panier
router.delete('/', removeFromBasket);

export default router;
