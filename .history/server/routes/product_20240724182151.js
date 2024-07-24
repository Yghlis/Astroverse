import express from 'express';
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  followProduct,
  unfollowProduct,
  getFollowedProducts,
  checkStock
} from '../controllers/product.js';
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
  const { title, characters, universes, ratings, priceRange, promotion } = req.query || {};

  const characterArray = characters ? characters.split(',') : [];
  const universeArray = universes ? universes.split(',') : [];
  const ratingArray = ratings ? ratings.split(',').map(Number) : [];
  const [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [0, Infinity];

  const filters = {
    title,
    characters: characterArray,
    universes: universeArray,
    ratings: ratingArray,
    priceRange: { min: minPrice, max: maxPrice },
    promotion
  };

  try {
    const products = await getProducts(filters);
    res.json(products);
  } catch (error) {
    res.status(500).end();
  }
});

router.post('/check-stock', checkStock);
router.get('/:id', getProductById);
router.put('/:id', authenticateToken, requireRole(['ROLE_ADMIN', 'ROLE_STORE_KEEPER']), logRequest, upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), logMulterResult, updateProduct);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteProduct);
router.post('/:productId/follow', authenticateToken, followProduct);
router.delete('/:productId/follow', authenticateToken, unfollowProduct);
router.get('/:userId/followed', authenticateToken, getFollowedProducts);

export default router;
