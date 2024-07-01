import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Log request data before multer handles it
const logRequest = (req, res, next) => {
  console.log('Before multer - Body:', req.body);
  console.log('Before multer - Files:', req.files);
  console.log('Before multer - Query:', req.query);
  console.log('Before multer - Params:', req.params);
  next();
};

// Log request data after multer handles it
const logMulterResult = (req, res, next) => {
  console.log('After multer - Body:', req.body);
  console.log('After multxer - Files:', req.files);
  next();
};

// Route pour ajouter un produit avec upload d'images
router.post('/', logRequest, upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), logMulterResult, addProduct);

// Route pour récupérer tous les produits
router.get('/', getProducts);

// Route pour récupérer un produit par ID
router.get('/:id', getProductById);

// Route pour mettre à jour un produit avec upload d'images
router.put('/:id', logRequest, upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), logMulterResult, updateProduct);

// Route pour supprimer un produit
router.delete('/:id', deleteProduct);

export default router;
