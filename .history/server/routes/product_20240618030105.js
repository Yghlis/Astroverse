import express from 'express';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/product.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Route pour ajouter un produit - uniquement accessible aux admins
router.post('/add', authenticateToken, requireRole('admin'), addProduct);

// Route pour obtenir les produits - accessible à tous
router.get('/', getProducts);

// Route pour mettre à jour un produit - uniquement accessible aux admins
router.put('/update/:id', authenticateToken, requireRole('admin'), updateProduct);

// Route pour supprimer un produit - uniquement accessible aux admins
router.delete('/delete/:id', authenticateToken, requireRole('admin'), deleteProduct);

export default router;

// server/routes/product.js
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
