import express from 'express';
import { updateNewsletterPdf, upload } from '../controllers/newsletter.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), upload.single('pdf'), updateNewsletterPdf);

export default router;
