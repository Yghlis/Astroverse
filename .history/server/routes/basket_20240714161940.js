import express from 'express';
import { addToBasket, decrementFromBasket, removeFromBasket } from '../controllers/basket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/', addToBasket);

// Route pour décrémenter un produit du panier
router.put('/', decrementFromBasket);

// Route pour supprimer un produit du panier
router.delete('/', removeFromBasket);



export default router;
