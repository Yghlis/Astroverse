import express from 'express';
import { addUniverse, getUniverses, getUniverseById, updateUniverse, deleteUniverse,followUniverse,unfollowUniverse } from '../controllers/universe.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getUniverses);
router.get('/:id', getUniverseById);
router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), addUniverse);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), updateUniverse);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteUniverse);
router.post('/universes/:universeId/follow', authenticateToken, followUniverse);
router.delete('/:universeId/follow', authenticateToken, unfollowUniverse);


export default router;
