import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js'; // Importer le modèle MongoDB
import { v4 as uuidv4 } from 'uuid';

// Ajouter ou mettre à jour un produit dans le panier
export const addToBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user ? req.user.userId : null; // Récupérer l'ID utilisateur du token JWT si disponible
  const sessionId = req.headers['session-id'];

  console.log('Request body:', req.body);
  console.log('Session ID:', sessionId);

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    // Vérifier si le produit existe et a suffisamment de stock
    const product = await Product.findByPk(productId);
    if (!product || product.stock < 1) {
      return res.status(400).json({ message: 'Insufficient stock or product not found.' });
    }

    // Vérifier si un panier existe pour cet utilisateur ou cette session
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.findOne({ where: { sessionId } });
    }

    if (!basket) {
      // Créer un nouveau panier
      basket = await Basket.create({
        id: uuidv4(),
        userId,
        sessionId,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      // Mettre à jour le panier existant
      const items = basket.items || [];
      const existingItem = items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.push({ productId, quantity: 1 });
      }
      basket.items = items;
      basket.updatedAt = new Date();
      await basket.save();
    }

    // Mettre à jour le stock du produit
    product.stock -= 1;
    await product.save();

    // Mettre à jour le stock du produit dans MongoDB
    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock -= 1;
      await productMongo.save();
    }

    res.status(200).json({ message: 'Product added to basket successfully.' });
  } catch (error) {
    console.error('Error adding product to basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
