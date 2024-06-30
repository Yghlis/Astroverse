// routes/product.js
import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Route pour ajouter un produit avec upload d'images
router.post('/', upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), addProduct);

// Route pour récupérer tous les produits
router.get('/', getProducts);

// Route pour récupérer un produit par ID
router.get('/:id', getProductById);

// Route pour mettre à jour un produit avec upload d'images
router.put('/:id', upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), updateProduct);

// Route pour supprimer un produit
router.delete('/:id', deleteProduct);

export default router;
