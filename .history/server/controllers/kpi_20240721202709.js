import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { Op } from 'sequelize';

// Fonction pour obtenir les données de stock des produits
export const getStockEvolution = async (req, res) => {
  const { period } = req.query;

  try {
    // Obtenir tous les produits
    const products = await Product.findAll();

    const productData = {};
    
    for (const product of products) {
      productData[product.id] = {
        name: product.title,
        data: [],
        labels: []
      };

      // Logique pour obtenir les données de stock pour le produit en fonction de la période
      // Par exemple, pour le mois actuel, vous pouvez ajouter des points de données
      const stockData = await getStockData(product.id, period);
      productData[product.id].data = stockData.data;
      productData[product.id].labels = stockData.labels;
    }

    res.json(productData);
  } catch (error) {
    console.error('Error fetching stock evolution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fonction fictive pour obtenir les données de stock
const getStockData = async (productId, period) => {
  // Remplacez cette logique par celle qui récupère réellement les données de stock
  const data = {
    data: [10, 20, 15, 25, 30, 20, 40], // Exemple de données
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] // Exemple de labels
  };

  return data;
};
