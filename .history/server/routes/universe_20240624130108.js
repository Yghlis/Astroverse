import express from 'express';
import { addUniverse, getUniverses,getUniverseById, updateUniverse, deleteUniverse } from '../controllers/universe.js';

const router = express.Router();

router.post('/', addUniverse);
router.get('/', getUniverses);
router.get('/:id', getUniverses);
router.put('/:id', updateUniverse);
router.delete('/:id', deleteUniverse);

export default router;
