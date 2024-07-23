import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js'; 
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { z } from 'zod';


const FIFTEEN_MINUTES = 2 * 60 * 1000;

const clearBasketIfExpired = async (basket) => {
  const now = new Date();
  if (basket.firstItemAddedAt && now - new Date(basket.firstItemAddedAt) > FIFTEEN_MINUTES) {
    for (const item of basket.items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
      const productMongo = await ProductMongo.findOne({ id: item.productId });
      if (productMongo) {
        productMongo.stock += item.quantity;
        await productMongo.save();
      }
    }

    basket.items = [];
    basket.firstItemAddedAt = null;
    await basket.save();
  }
};

const addToBasketSchema = z.object({
  productId: z.string().uuid(),
});

const sessionIdSchema = z.object({
  sessionId: z.string().nonempty(),
});

export const addToBasket = async (req, res) => {
  const { productId } = req.body;
  const sessionId = req.headers['session-id'];
  try {
    addToBasketSchema.parse({ productId });
    sessionIdSchema.parse({ sessionId });
  } catch (e) {
    console.error('Validation error:', e.errors);
    return res.status(400).json({ message: 'Validation error', details: e.errors });
  }

  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(productId, { transaction });
    if (!product || product.stock < 1) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Insufficient stock or product not found.' });
    }
    let basket = await Basket.findOne({ where: { sessionId }, transaction });

    if (!basket) {
      basket = await Basket.create({
        id: uuidv4(),
        sessionId,
        items: [{ productId, quantity: 1 }],
        firstItemAddedAt: new Date()
      }, { transaction });
    } else {
      await clearBasketIfExpired(basket);
      const items = basket.items || [];
      const existingItem = items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.push({ productId, quantity: 1 });
      }

      if (items.length === 1) {
        basket.firstItemAddedAt = new Date();
      }
      await Basket.update(
        { items: items, updatedAt: new Date(), firstItemAddedAt: basket.firstItemAddedAt },
        { where: { id: basket.id }, transaction }
      );
    }
    const updatedBasket = await Basket.findOne({ where: { id: basket.id }, transaction });
    console.log('Verified updated basket:', updatedBasket.items);
    product.stock -= 1;
    await product.save({ transaction });
    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock -= 1;
      await productMongo.save();
    }

    await transaction.commit();
    res.status(200).json({ message: 'Product added to basket successfully.' });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({ message: 'Internal server error.' });
  }
};

const decrementFromBasketSchema = z.object({
  productId: z.string().uuid(),
});
export const decrementFromBasket = async (req, res) => {
  const { productId } = req.body;
  const sessionId = req.headers['session-id'];
  try {
    decrementFromBasketSchema.parse({ productId });
    sessionIdSchema.parse({ sessionId });
  } catch (e) {
    console.error('Validation error:', e.errors);
    return res.status(400).json({ message: 'Validation error', details: e.errors });
  }

  const transaction = await sequelize.transaction();

  try {
    let basket = await Basket.findOne({ where: { sessionId }, transaction });

    if (!basket) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Basket not found.' });
    }

    await clearBasketIfExpired(basket);

    const items = basket.items || [];
    const existingItem = items.find(item => item.productId === productId);

    if (!existingItem) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Product not found in basket.' });
    }

    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      basket.items = items.filter(item => item.productId !== productId);
    }

    if (basket.items.length === 0) {
      basket.firstItemAddedAt = null;
    }

    basket.updatedAt = new Date();
    await Basket.update(
      { items: basket.items, updatedAt: basket.updatedAt, firstItemAddedAt: basket.firstItemAddedAt },
      { where: { id: basket.id }, transaction }
    );

    const product = await Product.findByPk(productId, { transaction });
    if (product) {
      product.stock += 1;
      await product.save({ transaction });
    }

    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock += 1;
      await productMongo.save();
    }

    await transaction.commit();
    res.status(200).json({ message: 'Product decremented from basket successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error decrementing product from basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const removeFromBasket = async (req, res) => {
  const { productId } = req.body;
  const sessionId = req.headers['session-id'];

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    let basket = await Basket.findOne({ where: { sessionId } });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found.' });
    }

    const items = basket.items || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in basket.' });
    }

    const [removedItem] = items.splice(itemIndex, 1);

    if (items.length === 0) {
      basket.firstItemAddedAt = null;
    }

    basket.updatedAt = new Date();
    await Basket.update(
      { items: items, updatedAt: basket.updatedAt, firstItemAddedAt: basket.firstItemAddedAt },
      { where: { id: basket.id } }
    );

    const product = await Product.findByPk(productId);
    if (product) {
      product.stock += removedItem.quantity;
      await product.save();
    }

    const productMongo = await ProductMongo.findOne({ id: productId });
    if (productMongo) {
      productMongo.stock += removedItem.quantity;
      await productMongo.save();
    }

    res.status(200).json({ message: 'Product removed from basket successfully.' });
  } catch (error) {
    console.error('Error removing product from basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getBasket = async (req, res) => {
  const sessionId = req.headers['session-id'];

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required.' });
  }

  try {
    let basket = await Basket.findOne({ where: { sessionId } });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found.' });
    }

    await clearBasketIfExpired(basket);

    res.status(200).json({ items: basket.items });
  } catch (error) {
    console.error('Error fetching basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const checkBasketItems = async (req, res) => {
  try {
    const sessionId = req.headers['session-id'];
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const basket = await Basket.findOne({ where: { sessionId } });
    console.log('Basket found:', basket);

    if (!basket) {
      console.log('No basket found for the given session ID');
      return res.status(200).json({ hasItems: false });
    }

    console.log('Basket items:', basket.items);

    if (!basket.items || basket.items.length === 0) {
      console.log('Basket is empty');
      return res.status(200).json({ hasItems: false });
    }

    console.log('Basket has items');
    return res.status(200).json({ hasItems: true });
  } catch (error) {
    console.error('Error checking basket items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
