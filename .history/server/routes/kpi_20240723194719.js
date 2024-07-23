import express from 'express';
import {
  getAllKpis, 
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

// Route pour obtenir les produits les plus aimés
router.get('/top-liked-products', authenticateToken, getTopLikedProducts);

// Route pour obtenir le total des personnes inscrites à la newsletter
router.get('/total-newsletter-subscribers', authenticateToken, getTotalNewsletterSubscribers);

// Route pour obtenir les statistiques des nouveaux abonnés à la newsletter
router.get('/new-user-newsletter-stats', authenticateToken, getNewsletterSubscriptionStats);

// Route pour obtenir les données de bénéfices (jour / mois / année)
router.get('/profit-data', authenticateToken, getProfitData);

// Route pour obtenir le total des produits
router.get('/total-products', authenticateToken, getTotalProducts);

// Route pour obtenir le total des univers
router.get('/total-universes', authenticateToken, getTotalUniverses);

// Route pour obtenir le total des personnages
router.get('/total-characters', authenticateToken, getTotalCharacters);


export default router;
  