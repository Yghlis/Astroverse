import express from 'express';
import { updateNewsletterPdf, upload } from '../controllers/newsletter.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Route pour mettre à jour le PDF de la newsletter (accessible uniquement aux administrateurs)
router.put('/', authenticateToken, requireRole('ROLE_ADMIN'), upload.single('pdf'), updateNewsletterPdf);
router.get('/current', authenticateToken, getNewsletterPdf);

export default router;
