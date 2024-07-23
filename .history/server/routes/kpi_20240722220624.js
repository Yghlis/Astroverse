import express from 'express';
import {
  getAllKpis, // Ajouter cette ligne
  getStockEvolution, 
  getTotalProductSales, 
  getTotalSalesByPeriod, 
  getTopViewedCategories, 
  getTopFollowedProducts,
  getTopLikedProducts,
  getTotalNewsletterSubscribers,
  getNewsletterSubscriptionStats,
  getProfitData,
  getTotalProducts,
  getTotalUniverses,
  getTotalCharacters
} from '../controllers/kpi.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Route pour récupérer toutes les données KPI
router.get('/all-kpis', authenticateToken, requireRole('ROLE_ADMIN'), getAllKpis);

// Autres routes...
router.get('/stock-evolution', authenticateToken, requireRole('ROLE_ADMIN'), getStockEvolution);
router.get('/total-sales', authenticateToken, getTotalProductSales);
router.get('/sales-by-period', authenticateToken, getTotalSalesByPeriod);
router.get('/top-viewed-categories', authenticateToken, getTopViewedCategories);
router.get('/top-followed-products', authenticateToken, getTopFollowedProducts);
router.get('/top-liked-products', authenticateToken, getTopLikedProducts);
router.get('/total-newsletter-subscribers', authenticateToken, getTotalNewsletterSubscribers);
router.get('/new-user-newsletter-stats', authenticateToken, getNewsletterSubscriptionStats);
router.get('/profit-data', authenticateToken, getProfitData);
router.get('/total-products', authenticateToken, getTotalProducts);
router.get('/total-universes', authenticateToken, getTotalUniverses);
router.get('/total-characters', authenticateToken, getTotalCharacters);

export default router;
