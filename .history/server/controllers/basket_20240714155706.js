import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import { v4 as uuidv4 } from 'uuid';

// Ajouter un produit au panier
export const addToBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user ? req.user.userId : null;
  const sessionId = req.headers['session-id'];

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product || product.stock < 1) {
      return res.status(400).json({ message: 'Insufficient stock or product not found.' });
    }

    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.findOne({ where: { sessionId } });
    }

    if (!basket) {
      basket = await Basket.create({
        id: uuidv4(),
        userId,
        sessionId,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      const existingItem = basket.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        basket.items.push({ productId, quantity: 1 });
      }
      basket.updatedAt = new Date();
      await basket.save();
    }

    product.stock -= 1;
    await product.save();

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

// Décrémenter un produit dans le panier
export const decrementFromBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user ? req.user.userId : null;
  const sessionId = req.headers['session-id'];

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.findOne({ where: { sessionId } });
    }

    if (!basket) {
      return res.status(400).json({ message: 'Basket not found.' });
    }

    const existingItem = basket.items.find(item => item.productId === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        basket.items = basket.items.filter(item => item.productId !== productId);
      }
    } else {
      return res.status(400).json({ message: 'Product not found in basket.' });
    }
    basket.updatedAt = new Date();
    await basket.save();

    const product = await Product.findByPk(productId);
    if (product) {
      product.stock += 1;
      await product.save();
    }

    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock += 1;
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
  const userId = req.user ? req.user.userId : null;
  const sessionId = req.headers['session-id'];

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.findOne({ where: { sessionId } });
    }

    if (!basket) {
      return res.status(400).json({ message: 'Basket not found.' });
    }

    const existingItem = basket.items.find(item => item.productId === productId);
    if (existingItem) {
      const quantity = existingItem.quantity;
      basket.items = basket.items.filter(item => item.productId !== productId);
      basket.updatedAt = new Date();
      await basket.save();

      const product = await Product.findByPk(productId);
      if (product) {
        product.stock += quantity;
        await product.save();
      }

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
