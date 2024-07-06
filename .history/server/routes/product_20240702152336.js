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
router.post('/', authenticateToken, requireRole('admin'),  upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), logMulterResult, addProduct);

// Route pour récupérer tous les produits avec filtres (accessible à tous)
router.get('/', async (req, res) => {
  const { characters, universes, ratings, priceRange, promotion } = req.query || {};

  const characterArray = characters ? characters.split(',') : [];
  const universeArray = universes ? universes.split(',') : [];
  const ratingArray = ratings ? ratings.split(',').map(Number) : [];
  const [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [0, Infinity];
  const isPromotion = promotion === 'true';

  const filters = {
    characters: characterArray,
    universes: universeArray,
    ratings: ratingArray,
    priceRange: { min: minPrice, max: maxPrice },
    isPromotion
  };

  try {
    console.log("Received filters:", filters);
    const products = await getProducts(filters);
    console.log("Fetched products:", products);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
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
