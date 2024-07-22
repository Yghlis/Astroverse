import express from 'express';
import { getStockEvolution,getTotalProductSales } from '../controllers/kpi.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Route pour récupérer les données de l'évolution des stocks
router.get('/stock-evolution', authenticateToken, requireRole('ROLE_ADMIN'), getStockEvolution);
router.get('/total-sales',authenticateToken, getTotalProductSales);
router.get('/sales-by-period', authenticateToken, getTotalSalesByPeriod);

export default router;
