import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

// Ajouter un produit au panier
export const addToBasket = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.userId : null; // Récupérer l'ID utilisateur du token JWT
  const sessionId = req.headers['session-id'];

  if (!productId || !quantity || (!userId && !sessionId)) {
    return res.status(400).json({ message: 'Product ID, quantity, and either user ID or session ID are required.' });
  }

  try {
    // Vérifier si le produit existe et a suffisamment de stock
    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock or product not found.' });
    }

    // Vérifier si un panier existe pour cet utilisateur ou cette session
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket && sessionId) {
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
      const existingItem = basket.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        basket.items.push({ productId, quantity });
      }
      await basket.save();
    }

    // Mettre à jour le stock du produit
    product.stock -= quantity;
    await product.save();

    res.status(200).json({ message: 'Product added to basket successfully.' });
  } catch (error) {
    console.error('Error adding product to basket:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
