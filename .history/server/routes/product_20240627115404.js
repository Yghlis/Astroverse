import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
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


/*// server/routes/product.js
import express from 'express';
import { addProduct, updateProduct, deleteProduct, getProducts } from '../controllers/product.js';

const router = express.Router();

// Route pour ajouter un produit
router.post('/add', addProduct);

// Route pour mettre à jour un produit
router.put('/update/:id', updateProduct);

// Route pour supprimer un produit
router.delete('/delete/:id', deleteProduct);

// Route pour obtenir tous les produits
router.get('/', getProducts);

export default router; */