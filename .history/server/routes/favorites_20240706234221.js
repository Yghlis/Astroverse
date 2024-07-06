// routes/favorites.js

import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favorites.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, addFavorite);
router.delete('/:productId', authenticateToken, removeFavorite);
router.get('/', authenticateToken, getFavorites);

export default router;
