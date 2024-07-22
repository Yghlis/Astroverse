import { Sequelize, Op, fn, col } from 'sequelize';
import Product from '../models/Product.js';
import Universe from '../models/Universe.js';
import Follow from '../models/Follow.js';
import sequelize from '../config/database.js';

// Récupérer les modifications de stock
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

// Préparer les données pour le graphique
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

// Contrôleur pour récupérer les données du graphique
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

export const getTopFollowedProducts = async (req, res) => {
  try {
    const topFollowedProducts = await Follow.findAll({
      attributes: [
        'productId',
        [fn('COUNT', col('productId')), 'follow_count']
      ],
      group: ['productId'],
      order: [[fn('COUNT', col('productId')), 'DESC']],
      limit: 3,
      include: [{
        model: Product,
        attributes: ['id', 'title', 'brand', 'price', 'image_preview'],
      }],
    });

    const result = topFollowedProducts.map(follow => ({
      productId: follow.productId,
      title: follow.Product.title,
      brand: follow.Product.brand,
      price: follow.Product.price,
      imagePreview: follow.Product.image_preview,
      followCount: follow.dataValues.follow_count,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top followed products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};