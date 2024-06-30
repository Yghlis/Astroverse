import express from 'express';
import { addUniverse, getUniverses, updateUniverse, deleteUniverse } from '../controllers/universe.js';
import { authenticateToken, requireRole } from '../middleware/auth.js'; // Assurez-vous d'importer les middlewares appropriés

const router = express.Router();

router.post('/add', authenticateToken, requireRole('admin'), addUniverse);

// Route pour obtenir tous les univers - accessible à tous
router.get('/', getUniverses);

// Route pour mettre à jour un univers - uniquement accessible aux admins
router.put('/update/:id', authenticateToken, requireRole('admin'), updateUniverse);

// Route pour supprimer un univers - uniquement accessible aux admins
router.delete('/delete/:id', authenticateToken, requireRole('admin'), deleteUniverse);

export default router;
