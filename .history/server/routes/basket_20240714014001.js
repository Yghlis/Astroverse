import express from 'express';
import { addToBasket } from '../controllers/basketController.js';

const router = express.Router();

router.post('/add', addToBasket);

export default router;
