import { Op } from 'sequelize';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Récupérer les modifications de stock
const getStockChanges = async (productId) => {
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

  // Récupérer le produit sélectionné
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error('Produit non trouvé');
  }

  // Initialiser les modifications de stock
  const stockChanges = {
    productId: product.id,
    title: product.title,
    initialStock: product.stock,
    changes: [],
  };

  // Ajouter les modifications de stock initiales (lors de la création du produit)
  stockChanges.changes.push({
    date: product.createdAt,
    quantity: product.stock,
  });

  // Calculer les modifications de stock à partir des commandes
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

  // Trier les changements de stock par date
  stockChanges.changes.sort((a, b) => new Date(a.date) - new Date(b.date));

  return stockChanges;
};

// Préparer les données pour le graphique
const prepareChartData = (stockChanges) => {
  const data = [];
  const labels = [];
  let currentStock = stockChanges.initialStock;

  stockChanges.changes.forEach(change => {
    const date = new Date(change.date);
    labels.push(date.toLocaleDateString());
    currentStock += change.quantity;
    data.push(currentStock);
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
