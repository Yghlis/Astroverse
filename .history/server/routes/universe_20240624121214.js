import express from 'express';
import { addUniverse, getUniverses, updateUniverse, deleteUniverse } from '../controllers/universe.js';

const router = express.Router();

router.post('/', addUniverse);
router.get('/', getUniverses);
router.put('/update/:id', updateUniverse);
router.delete('/delete/:id', deleteUniverse);

export default router;
