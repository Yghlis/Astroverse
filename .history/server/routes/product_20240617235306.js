// server/routes/product.js
import express from 'express';
import { addProduct } from '../controllers/product.js';

const router = express.Router();

// Route pour ajouter un produit
router.post('/add', addProduct);

export default router; // Utiliser exportation par défaut
