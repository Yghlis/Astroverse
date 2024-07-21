import { Op } from 'sequelize';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Récupérer les modifications de stock
const getStockChanges = async (period) => {
  let startDate;
  const now = new Date();
  if (period === 'today') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  // Récupérer les commandes depuis le début de la période
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
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
const prepareChartData = (stockChanges, period) => {
  const chartData = {};

  Object.values(stockChanges).forEach(product => {
    const data = [];
    const labels = [];

    if (period === 'today') {
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        data.push(product.initialStock);
      }
      product.changes.forEach(change => {
        const hour = new Date(change.date).getHours();
        data[hour] += change.quantity;
      });
    } else if (period === 'month') {
      const daysInMonth = new Date().getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(i.toString());
        data.push(product.initialStock);
      }
      product.changes.forEach(change => {
        const day = new Date(change.date).getDate();
        data[day - 1] += change.quantity;
      });
    } else if (period === 'year') {
      for (let i = 0; i < 12; i++) {
        labels.push(new Date(0, i).toLocaleString('default', { month: 'short' }));
        data.push(product.initialStock);
      }
      product.changes.forEach(change => {
        const month = new Date(change.date).getMonth();
        data[month] += change.quantity;
      });
    }

    chartData[product.title] = {
      labels,
      data,
    };
  });

  return chartData;
};

// Contrôleur pour récupérer les données du graphique
export const getStockEvolution = async (req, res) => {
  const { period } = req.query; // 'today', 'month', 'year'

  try {
    const stockChanges = await getStockChanges(period);
    const chartData = prepareChartData(stockChanges, period);
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching stock evolution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
