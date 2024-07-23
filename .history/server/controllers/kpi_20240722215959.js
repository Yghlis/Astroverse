import { Sequelize, Op, fn, col } from 'sequelize';
import Product from '../models/Product.js';
import Universe from '../models/Universe.js';
import Follow from '../models/Follow.js';
import Order from '../models/Order.js';
import Favorite from '../models/Favorite.js';
import User from '../models/user.js';
import sequelize from '../config/database.js';

// Récupérer les modifications de stock pour un produit spécifique sur les trois derniers mois
const getStockChanges = async (productId) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

  // Récupérer le produit sélectionné
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error('Produit non trouvé');
  }

  // Récupérer les commandes depuis les trois derniers mois
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: threeMonthsAgo,
      },
    },
  });

  // Initialiser les modifications de stock
  const stockChanges = {
    productId: product.id,
    title: product.title,
    initialStock: product.stock,
    changes: [],
  };

  // Calculer les modifications de stock
  orders.forEach(order => {
    order.products.forEach(item => {
      if (item.productId === productId) {
        const change = {
          date: order.createdAt,
          quantity: -item.quantity,
        };
        stockChanges.changes.push(change);
      }
    });
  });

  return stockChanges;
};

// Préparer les données pour le graphique de l'évolution du stock
const prepareChartData = (stockChanges) => {
  const data = [];
  const labels = [];
  let currentStock = stockChanges.initialStock;

  // Récupérer les trois derniers mois
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    labels.unshift(date.toLocaleString('default', { month: 'short' }));
    data.unshift(currentStock);
  }

  stockChanges.changes.forEach(change => {
    const month = new Date(change.date).getMonth();
    const currentMonth = new Date().getMonth();
    const monthIndex = (currentMonth - month + 12) % 12;
    if (monthIndex < 3) {
      data[2 - monthIndex] += change.quantity;
    }
  });

  return {
    labels,
    data,
  };
};

// Contrôleur pour récupérer les données du graphique de l'évolution du stock
export const getStockEvolution = async (req, res) => {
  const { productId } = req.query;

  try {
    const stockChanges = await getStockChanges(productId);
    const chartData = prepareChartData(stockChanges);
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching stock evolution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Contrôleur pour obtenir le top 3 des ventes de produits
export const getTotalProductSales = async (req, res) => {
  try {
    const orders = await Order.findAll();

    const productSales = {};

    orders.forEach(order => {
      order.products.forEach(product => {
        if (productSales[product.productId]) {
          productSales[product.productId].quantity += product.quantity;
        } else {
          productSales[product.productId] = {
            productId: product.productId,
            quantity: product.quantity
          };
        }
      });
    });

    const productIds = Object.keys(productSales);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      }
    });

    const detailedProductSales = products.map(product => ({
      productId: product.id,
      title: product.title,
      quantity: productSales[product.id].quantity
    }));

    const topProductSales = detailedProductSales.sort((a, b) => b.quantity - a.quantity).slice(0, 3);

    res.status(200).json({ topProductSales });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le total des ventes par période
export const getTotalSalesByPeriod = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const totalSales = await Order.sum('totalPrice');
    const dailySales = await Order.sum('totalPrice', {
      where: {
        createdAt: {
          [Op.gte]: startOfDay
        }
      }
    });
    const monthlySales = await Order.sum('totalPrice', {
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });
    const yearlySales = await Order.sum('totalPrice', {
      where: {
        createdAt: {
          [Op.gte]: startOfYear
        }
      }
    });

    res.status(200).json({
      totalSales,
      dailySales,
      monthlySales,
      yearlySales
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le top 3 des catégories les plus vues
export const getTopViewedCategories = async (req, res) => {
  try {
    // Obtenez le top 3 des univers par nombre de vues
    const topCategories = await Product.findAll({
      attributes: [
        'universe',
        [fn('SUM', col('views_count')), 'total_views']
      ],
      group: ['universe'],
      order: [[fn('SUM', col('views_count')), 'DESC']],
      limit: 3,
    });

    // Ajoutez les détails des univers
    const universeIds = topCategories.map(category => category.universe);
    const universes = await Universe.findAll({
      where: {
        id: {
          [Op.in]: universeIds
        }
      }
    });

    const universeDetails = universes.reduce((acc, universe) => {
      acc[universe.id] = universe.name;
      return acc;
    }, {});

    const result = topCategories.map(category => ({
      universeId: category.universe,
      universeName: universeDetails[category.universe],
      totalViews: category.dataValues.total_views,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top viewed categories:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le top 3 des produits les plus suivis
export const getTopFollowedProducts = async (req, res) => {
  try {
    // Récupérer le nombre de suivis pour chaque produit
    const follows = await Follow.findAll({
      attributes: [
        'productId',
        [fn('COUNT', col('productId')), 'follow_count']
      ],
      where: {
        productId: {
          [Op.ne]: null
        }
      },
      group: ['productId'],
      order: [[fn('COUNT', col('productId')), 'DESC']],
      limit: 3
    });

    // Récupérer les détails des produits
    const productIds = follows.map(follow => follow.productId);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      },
      attributes: ['id', 'title'] // Sélectionner uniquement les champs nécessaires
    });

    // Construire le résultat final en combinant les suivis et les détails des produits
    const result = follows.map(follow => {
      const product = products.find(p => p.id === follow.productId);
      return {
        productName: product ? product.title : null,
        followCount: follow.dataValues.follow_count
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top followed products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le top 3 des produits les plus aimés
export const getTopLikedProducts = async (req, res) => {
  try {
    // Récupérer le nombre de likes pour chaque produit
    const likes = await Favorite.findAll({
      attributes: [
        'productId',
        [fn('COUNT', col('productId')), 'like_count']
      ],
      where: {
        productId: {
          [Op.ne]: null
        }
      },
      group: ['productId'],
      order: [[fn('COUNT', col('productId')), 'DESC']],
      limit: 3
    });

    // Récupérer les détails des produits
    const productIds = likes.map(like => like.productId);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      },
      attributes: ['id', 'title'] // Sélectionner uniquement les champs nécessaires
    });

    // Construire le résultat final en combinant les likes et les détails des produits
    const result = likes.map(like => {
      const product = products.find(p => p.id === like.productId);
      return {
        productName: product ? product.title : null,
        likeCount: like.dataValues.like_count
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top liked products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le total des abonnés à la newsletter
export const getTotalNewsletterSubscribers = async (req, res) => {
  try {
    // Compter le nombre d'utilisateurs inscrits à la newsletter
    const totalSubscribers = await User.count({
      where: {
        isSubscribedToNewsletter: true
      }
    });

    res.status(200).json({ totalSubscribers });
  } catch (error) {
    console.error('Error fetching total newsletter subscribers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir les statistiques d'abonnement à la newsletter
export const getNewsletterSubscriptionStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfThreeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Fonction pour obtenir les stats pour une période donnée
    const getStatsForPeriod = async (startDate) => {
      // Nouveaux utilisateurs pour la période
      const newUsers = await User.findAll({
        where: {
          created_at: {
            [Op.gte]: startDate
          }
        },
        attributes: ['user_id', 'isSubscribedToNewsletter']
      });

      const newUserCount = newUsers.length;
      const subscribersCount = newUsers.filter(user => user.isSubscribedToNewsletter).length;
      const subscriptionPercentage = newUserCount > 0 ? (subscribersCount / newUserCount) * 100 : 0;

      return {
        newUserCount,
        subscribersCount,
        subscriptionPercentage
      };
    };

    const monthlyStats = await getStatsForPeriod(startOfMonth);
    const threeMonthlyStats = await getStatsForPeriod(startOfThreeMonthsAgo);
    const yearlyStats = await getStatsForPeriod(startOfYear);

    res.status(200).json({
      monthlyStats,
      threeMonthlyStats,
      yearlyStats
    });
  } catch (error) {
    console.error('Error fetching newsletter subscription stats:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fonction pour calculer les bénéfices quotidiens
const calculateProfits = async (startDate, endDate) => {
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    attributes: [
      [fn('DATE_TRUNC', 'day', col('createdAt')), 'date'],
      [fn('SUM', col('totalPrice')), 'totalPrice'],
      [fn('SUM', col('tax')), 'tax']
    ],
    group: ['date'],
    order: [['date', 'ASC']]
  });

  return orders.map(order => ({
    date: order.getDataValue('date'),
    profit: parseFloat(order.getDataValue('totalPrice')) - parseFloat(order.getDataValue('tax'))
  }));
};

// Fonction pour calculer les bénéfices mensuels
const calculateMonthlyProfits = async (startDate, endDate) => {
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    attributes: [
      [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
      [fn('SUM', col('totalPrice')), 'totalPrice'],
      [fn('SUM', col('tax')), 'tax']
    ],
    group: ['month'],
    order: [['month', 'ASC']]
  });

  return orders.map(order => ({
    month: order.getDataValue('month'),
    profit: parseFloat(order.getDataValue('totalPrice')) - parseFloat(order.getDataValue('tax'))
  }));
};

// Contrôleur pour obtenir les données des bénéfices pour les graphiques
export const getProfitData = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total profits
    const totalOrders = await Order.findAll();
    const totalProfit = totalOrders.reduce((acc, order) => acc + (order.totalPrice - order.tax), 0);

    // Daily profit for today
    const dailyOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay
        }
      }
    });
    const dailyProfit = dailyOrders.reduce((acc, order) => acc + (order.totalPrice - order.tax), 0);

    // Daily profits for the current month
    const dailyProfitsForMonth = await calculateProfits(startOfMonth, now);

    // Monthly profits for the current year
    const monthlyProfitsForYear = await calculateMonthlyProfits(startOfYear, now);

    res.status(200).json({
      totalProfit,
      dailyProfit,
      dailyProfitsForMonth,
      monthlyProfitsForYear
    });
  } catch (error) {
    console.error('Error fetching profit data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le total des produits
export const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    res.status(200).json({ totalProducts });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le total des universes
export const getTotalUniverses = async (req, res) => {
  try {
    const totalUniverses = await Universe.count();
    res.status(200).json({ totalUniverses });
  } catch (error) {
    res.status500.json({ message: 'Internal server error', error: error.message });
  }
};

// Contrôleur pour obtenir le total des personnages
export const getTotalCharacters = async (req, res) => {
  try {
    const totalCharacters = await Character.count();
    res.status(200).json({ totalCharacters });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllKpis = async (req, res) => {
  try {
    const [
      totalProductSales,
      totalSalesByPeriod,
      topViewedCategories,
      topFollowedProducts,
      topLikedProducts,
      totalNewsletterSubscribers,
      newUserNewsletterStats,
      profitData,
      totalProducts,
      totalUniverses,
      totalCharacters
    ] = await Promise.all([
      getTotalProductSales(req, res),
      getTotalSalesByPeriod(req, res),
      getTopViewedCategories(req, res),
      getTopFollowedProducts(req, res),
      getTopLikedProducts(req, res),
      getTotalNewsletterSubscribers(req, res),
      getNewsletterSubscriptionStats(req, res),
      getProfitData(req, res),
      getTotalProducts(req, res),
      getTotalUniverses(req, res),
      getTotalCharacters(req, res)
    ]);

    res.status(200).json({
      totalProductSales: totalProductSales.data,
      totalSalesByPeriod: totalSalesByPeriod.data,
      topViewedCategories: topViewedCategories.data,
      topFollowedProducts: topFollowedProducts.data,
      topLikedProducts: topLikedProducts.data,
      totalNewsletterSubscribers: totalNewsletterSubscribers.data,
      newUserNewsletterStats: newUserNewsletterStats.data,
      profitData: profitData.data,
      totalProducts: totalProducts.data,
      totalUniverses: totalUniverses.data,
      totalCharacters: totalCharacters.data
    });
  } catch (error) {
    console.error('Error fetching all KPIs:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
