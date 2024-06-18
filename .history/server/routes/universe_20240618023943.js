import express from 'express';
import { addUniverse, getUniverses, updateUniverse, deleteUniverse } from '../controllers/universe.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', authenticateToken, requireRole('admin'), addUniverse);
router.get('/', getUniverses);
router.put('/update/:id', authenticateToken, requireRole('admin'), updateUniverse);
router.delete('/delete/:id', authenticateToken, requireRole('admin'), deleteUniverse);

export default router;
