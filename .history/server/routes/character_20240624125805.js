// routes/character.js
import express from 'express';
import { addCharacter, getCharacters, updateCharacter, deleteCharacter } from '../controllers/character.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireRole('admin'), addCharacter);
router.get('/', getCharacters);
router.get('/:id', getCharacterById); 
router.put('/:id', authenticateToken, requireRole('admin'), updateCharacter);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteCharacter);

export default router;
/*import express from 'express';
import { addCharacter, getCharacters, updateCharacter, deleteCharacter } from '../controllers/character.js';

const router = express.Router();

router.post('/add', addCharacter);
router.get('/', getCharacters);
router.put('/update/:id', updateCharacter);
router.delete('/delete/:id', deleteCharacter);

export default router;*/
