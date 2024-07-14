import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js'; // Importer le modèle MongoDB
import { v4 as uuidv4 } from 'uuid';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const clearBasketIfExpired = async (basket) => {
  const now = new Date();
  if (basket.firstItemAddedAt && now - new Date(basket.firstItemAddedAt) > FIFTEEN_MINUTES) {
    basket.items = [];
    basket.firstItemAddedAt = null;
    await basket.save();
    console.log('Basket cleared due to expiration');
  }
};


// Ajouter ou mettre à jour un produit dans le panier
export const addToBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user ? req.user.userId : null;
  const sessionId = req.headers['session-id'];

  console.log('Request body:', req.body);

  if (!productId || !sessionId) {
    return res.status(400).json({ message: 'Product ID and session ID are required.' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product || product.stock < 1) {
      console.log('Insufficient stock or product not found.');
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
        items: [{ productId, quantity: 1 }],
        firstItemAddedAt: new Date()
      });
      console.log('New basket created with item:', basket.items);
    } else {
      await clearBasketIfExpired(basket);

      const items = basket.items || [];
      const existingItem = items.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += 1;
        console.log('Existing item found, updated quantity:', existingItem.quantity);
      } else {
        items.push({ productId, quantity: 1 });
        console.log('New item added:', { productId, quantity: 1 });
      }

      if (items.length === 1) {
        basket.firstItemAddedAt = new Date();
      }

      basket.items = items;
      basket.updatedAt = new Date();
      await basket.save();
      console.log('Basket updated with new items:', basket.items);
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
// Décrémenter ou supprimer un produit dans le panier
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
      return res.status(404).json({ message: 'Basket not found.' });
    }

    await clearBasketIfExpired(basket);

    const items = basket.items || [];
    const existingItem = items.find(item => item.productId === productId);

    if (!existingItem) {
      return res.status(404).json({ message: 'Product not found in basket.' });
    }

    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      console.log('Existing item found, updated quantity:', existingItem.quantity);
    } else {
      basket.items = items.filter(item => item.productId !== productId);
      console.log('Item removed:', productId);
    }

    if (basket.items.length === 0) {
      basket.firstItemAddedAt = null;
    }

    await Basket.update({ items: basket.items, firstItemAddedAt: basket.firstItemAddedAt, updatedAt: new Date() }, { where: { id: basket.id } });

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
      return res.status(404).json({ message: 'Basket not found.' });
    }

    await clearBasketIfExpired(basket);

    const items = basket.items || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in basket.' });
    }

    const [removedItem] = items.splice(itemIndex, 1);

    if (items.length === 0) {
      basket.firstItemAddedAt = null;
    }

    await Basket.update({ items: items, firstItemAddedAt: basket.firstItemAddedAt, updatedAt: new Date() }, { where: { id: basket.id } });

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