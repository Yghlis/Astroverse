import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';  // Assurez-vous d'importer les middlewares

const router = express.Router();

router.get('/', (req, res) => {
  res.send('User route');
});

// Ajout d'une nouvelle route protégée pour les administrateurs
router.get('/administrator', authenticateToken, requireRole('ROLE_ADMIN'), (req, res) => {
  res.send('Accès à la page administrateur autorisé');
});

export default router;
