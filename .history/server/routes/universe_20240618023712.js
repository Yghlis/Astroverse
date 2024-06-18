import express from 'express';
import { addUniverse, getUniverses } from '../controllers/universe.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', authenticateToken, requireRole('admin'), addUniverse);
router.get('/', getUniverses);

export default router;
