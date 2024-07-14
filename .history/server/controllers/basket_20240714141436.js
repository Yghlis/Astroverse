import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import { v4 as uuidv4 } from 'uuid';

// Ajouter un produit au panier
export const addToBasket = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.userId : null;
  const sessionId = req.headers['session-id'];

  if (!productId || !quantity || !sessionId) {
    return res.status(400).json({ message: 'Product ID, quantity, and session ID are required.' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) {
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
        items: [{ productId, quantity }]
      });
    } else {
      const existingItem = basket.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        basket.items.push({ productId, quantity });
      }
      basket.updatedAt = new Date();
      await basket.save();
    }

    product.stock -= quantity;
    await product.save();

    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      await productMongo.updateOne({ stock: product.stock });
    } else {
      return res.status(404).json({ message: 'Product not found in MongoDB.' });
    }

    res.status(200).json({ message: 'Product added to basket successfully.' });
  } catch (error) {
    console.error('Error adding product to basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
