import express from 'express';
import { addToBasket, decrementFromBasket, removeFromBasket, getBasket } from '../controllers/basket.js';

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/', addToBasket);

// Route pour décrémenter un produit du panier
router.post('/decrement', decrementFromBasket);

router.get('/', getBasket);

// Route pour supprimer un produit du panier
router.delete('/', removeFromBasket);

export default router;
