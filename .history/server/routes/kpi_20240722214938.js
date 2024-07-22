import express from 'express';
import { getStockEvolution, getTotalProductSales, getTotalSalesByPeriod, getTopViewedCategories, getTopFollowedProducts,getTopLikedProducts,getTotalNewsletterSubscribers,getNewsletterSubscriptionStats,getProfitData } from '../controllers/kpi.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Route pour récupérer les données de l'évolution des stocks
router.get('/stock-evolution', authenticateToken, requireRole('ROLE_ADMIN'), getStockEvolution);

// Route pour obtenir le top 3 des ventes de produits
router.get('/total-sales', authenticateToken, getTotalProductSales);

// Route pour obtenir le total des ventes (jour / mois / année / totale)
router.get('/sales-by-period', authenticateToken, getTotalSalesByPeriod);

// Route pour obtenir le top 3 des catégories les plus vues
router.get('/top-viewed-categories', authenticateToken, getTopViewedCategories);

// Route pour obtenir les produits les plus suivis
router.get('/top-followed-products', authenticateToken, getTopFollowedProducts);

router.get('/top-liked-products', authenticateToken, getTopLikedProducts);

// Route pour obtenir le total des personnes inscrites à la newsletter
router.get('/total-newsletter-subscribers', authenticateToken, getTotalNewsletterSubscribers);

router.get('/new-user-newsletter-stats', authenticateToken, getNewsletterSubscriptionStats);


router.get('/profit-data', getProfitData);

export default router;
