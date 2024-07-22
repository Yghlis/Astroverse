import express from 'express';
import { getStockEvolution, getTotalProductSales, getTotalSalesByPeriod } from '../controllers/kpi.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Route pour récupérer les données de l'évolution des stocks
router.get('/stock-evolution', authenticateToken, requireRole('ROLE_ADMIN'), getStockEvolution);

// Route pour obtenir le top 3 des ventes de produits
router.get('/total-sales', authenticateToken, getTotalProductSales);

// Route pour obtenir le total des ventes (jour / mois / année / totale)
router.get('/sales-by-period', authenticateToken, getTotalSalesByPeriod);

router.get('/top-viewed-categories', authenticateToken, getTopViewedCategories);


export default router;
