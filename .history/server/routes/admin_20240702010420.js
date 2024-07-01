import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js'; // Assurez-vous d'importer correctement ces fonctions

const router = express.Router();

// Route pour obtenir des informations administratives
router.get('/dashboard', authenticateToken, requireRole('ROLE_ADMIN'), (req, res) => {
    res.json({ message: "Bienvenue sur le tableau de bord administratif" });
});

router.get('/manage-users', authenticateToken, requireRole('ROLE_ADMIN'), (req, res) => {
    res.json({ users: [/* liste des utilisateurs */] });
});


export default router;
