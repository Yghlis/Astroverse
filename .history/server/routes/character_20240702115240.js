// routes/character.js
import express from 'express';
import { addCharacter, getCharacters, getCharacterById, updateCharacter, deleteCharacter } from '../controllers/character.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCharacters);
router.get('/:id', getCharacterById);
router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), addCharacter);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), updateCharacter);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteCharacter);

export default router;
