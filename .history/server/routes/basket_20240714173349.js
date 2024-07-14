import express from 'express';
import { addToBasket, decrementFromBasket } from '../controllers/basket.js';

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/', addToBasket);

// Route pour décrémenter un produit du panier
router.post('/decrement', decrementFromBasket);

export default router;
