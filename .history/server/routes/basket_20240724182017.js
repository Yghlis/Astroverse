import express from 'express';
import { addToBasket, decrementFromBasket, removeFromBasket, getBasket,checkBasketItems } from '../controllers/basket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', addToBasket);
router.post('/decrement', decrementFromBasket);
router.get('/', getBasket);
router.get('/check-items', authenticateToken, checkBasketItems);
router.delete('/', removeFromBasket);

export default router;
