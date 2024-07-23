import express from 'express';
import { addToBasket, decrementFromBasket, removeFromBasket, getBasket,checkBasketItems } from '../controllers/basket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/', addToBasket);

// Route pour décrémenter un produit du panier
router.post('/decrement', decrementFromBasket);

router.get('/', getBasket);

// Route pour vérifier si le panier contient des produits
router.get('/check-items', authenticateToken, checkBasketItems);

// Route pour supprimer un produit du panier
router.delete('/', removeFromBasket);

export default router;
