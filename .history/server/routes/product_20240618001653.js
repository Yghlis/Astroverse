// server/routes/product.js
import express from 'express';
import { addProduct, updateProduct, deleteProduct } from '../controllers/product.js';

const router = express.Router();

// Route pour ajouter un produit
router.post('/add', addProduct);

// Route pour mettre à jour un produit
router.put('/update/:id', updateProduct);

// Route pour supprimer un produit
router.delete('/delete/:id', deleteProduct);

export default router;
