import { Op } from 'sequelize';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Récupérer les modifications de stock
const getStockChanges = async () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

  // Récupérer les commandes depuis le début des trois derniers mois
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: threeMonthsAgo,
      },
    },
  });

  // Récupérer tous les produits
  const products = await Product.findAll();

  // Initialiser les modifications de stock
  const stockChanges = {};
  products.forEach(product => {
    stockChanges[product.id] = {
      productId: product.id,
      title: product.title,
      initialStock: product.stock,
      changes: [],
    };
  });

  // Calculer les modifications de stock
  orders.forEach(order => {
    order.products.forEach(item => {
      if (stockChanges[item.productId]) {
        const change = {
          date: order.createdAt,
          quantity: -item.quantity,
        };
        stockChanges[item.productId].changes.push(change);
      }
    });
  });

  return stockChanges;
};

// Préparer les données pour le graphique
const prepareChartData = (stockChanges) => {
  const chartData = {};

  Object.values(stockChanges).forEach(product => {
    const data = [];
    const labels = [];

    // Récupérer les trois derniers mois
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      labels.unshift(date.toLocaleString('default', { month: 'short' }));
      data.unshift(product.initialStock);
    }

    product.changes.forEach(change => {
      const month = new Date(change.date).getMonth();
      const currentMonth = new Date().getMonth();
      const monthIndex = (currentMonth - month + 12) % 12;
      if (monthIndex < 3) {
        data[2 - monthIndex] += change.quantity;
      }
    });

    chartData[product.title] = {
      labels,
      data,
    };
  });

  return chartData;
};

// Contrôleur pour récupérer les données du graphique
export const getStockEvolution = async (req, res) => {
  try {
    const stockChanges = await getStockChanges();
    const chartData = prepareChartData(stockChanges);
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching stock evolution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
