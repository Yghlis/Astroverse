import express from 'express';
import { addToBasket } from '../controllers/basketController.js';

const router = express.Router();

router.post('/', addToBasket);

export default router;
