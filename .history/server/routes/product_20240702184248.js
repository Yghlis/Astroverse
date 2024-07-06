import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.js';
import upload from '../middleware/multer.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const logRequest = (req, res, next) => {
  next();
};

const logMulterResult = (req, res, next) => {
  next();
};

// Route pour ajouter un produit avec upload d'images (accessible uniquement aux administrateurs)
router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), addProduct);

// Route pour récupérer tous les produits avec filtres (accessible à tous)
router.get('/', async (req, res) => {
    try {
      const products = await ProductMongo.find({});
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Route pour récupérer un produit par ID (accessible à tous)
router.get('/:id', getProductById);

// Route pour mettre à jour un produit avec upload d'images (accessible uniquement aux administrateurs)
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), logRequest, upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), logMulterResult, updateProduct);

// Route pour supprimer un produit (accessible uniquement aux administrateurs)
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteProduct);

export default router;
