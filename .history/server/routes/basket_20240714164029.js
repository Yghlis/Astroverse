import express from 'express';
import { addToBasket } from '../controllers/basket.js';
import Basket from '../models/Basket.js'; 

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/', addToBasket);

export default router;
