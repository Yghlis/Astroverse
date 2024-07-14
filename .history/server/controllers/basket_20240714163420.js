import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js'; // Importer le modèle MongoDB
import { v4 as uuidv4 } from 'uuid';

// Ajouter ou mettre à jour un produit dans le panier
export const addToBasket = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.userId : null; // Récupérer l'ID utilisateur du token JWT si disponible
  const sessionId = req.headers['session-id'];

  if (!productId || !quantity || !sessionId) {
    return res.status(400).json({ message: 'Product ID, quantity, and session ID are required.' });
  }

  try {
    // Vérifier si le produit existe et a suffisamment de stock
    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) {
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
        items: [{ productId, quantity }]
      });
    } else {
      // Mettre à jour le panier existant
      const items = basket.items || [];
      const existingItem = items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({ productId, quantity });
      }
      basket.items = items;
      basket.updatedAt = new Date();
      await basket.save();
    }

    // Mettre à jour le stock du produit
    product.stock -= quantity;
    await product.save();

    // Mettre à jour le stock du produit dans MongoDB
    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock -= quantity;
      await productMongo.save();
    }

    res.status(200).json({ message: 'Product added to basket successfully.' });
  } catch (error) {
    console.error('Error adding product to basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Décrémenter un produit dans le panier
export const decrementFromBasket = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.userId : null; // Récupérer l'ID utilisateur du token JWT si disponible
  const sessionId = req.headers['session-id'];

  if (!productId || !quantity || !sessionId) {
    return res.status(400).json({ message: 'Product ID, quantity, and session ID are required.' });
  }

  try {
    // Vérifier si un panier existe pour cet utilisateur ou cette session
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.findOne({ where: { sessionId } });
    }

    if (!basket) {
      return res.status(400).json({ message: 'Basket not found.' });
    }

    // Mettre à jour le panier existant
    const items = basket.items || [];
    const existingItem = items.find(item => item.productId === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= quantity;
      } else {
        basket.items = items.filter(item => item.productId !== productId);
      }
    } else {
      return res.status(400).json({ message: 'Product not found in basket.' });
    }
    basket.items = items;
    basket.updatedAt = new Date();
    await basket.save();

    // Mettre à jour le stock du produit
    const product = await Product.findByPk(productId);
    if (product) {
      product.stock += quantity;
      await product.save();
    }

    // Mettre à jour le stock du produit dans MongoDB
    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock += quantity;
      await productMongo.save();
    }

    res.status(200).json({ message: 'Product decremented from basket successfully.' });
  } catch (error) {
    console.error('Error decrementing product from basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Supprimer un produit du panier
export const removeFromBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user ? req.user.userId : null; // Récupérer l'ID utilisateur du token JWT si disponible
  const sessionId = req.headers['session-id'];

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    // Vérifier si un panier existe pour cet utilisateur ou cette session
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.findOne({ where: { sessionId } });
    }

    if (!basket) {
      return res.status(400).json({ message: 'Basket not found.' });
    }

    // Mettre à jour le panier existant
    const items = basket.items || [];
    const existingItem = items.find(item => item.productId === productId);
    if (existingItem) {
      const quantity = existingItem.quantity;
      basket.items = items.filter(item => item.productId !== productId);
      basket.updatedAt = new Date();
      await basket.save();

      // Mettre à jour le stock du produit
      const product = await Product.findByPk(productId);
      if (product) {
        product.stock += quantity;
        await product.save();
      }

      // Mettre à jour le stock du produit dans MongoDB
      const productMongo = await ProductMongo.findOne({ id: productId });
      if (productMongo) {
        productMongo.stock += quantity;
        await productMongo.save();
      }

      res.status(200).json({ message: 'Product removed from basket successfully.' });
    } else {
      return res.status(400).json({ message: 'Product not found in basket.' });
    }
  } catch (error) {
    console.error('Error removing product from basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
