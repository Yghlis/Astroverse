import express from 'express';
import { addUniverse, getUniverses, updateUniverse, deleteUniverse } from '../controllers/universe.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authenticateToken, addUniverse);
router.get('/', getUniverses);
router.put('/update/:id', authenticateToken, updateUniverse);
router.delete('/delete/:id', authenticateToken, deleteUniverse);

export default router;
