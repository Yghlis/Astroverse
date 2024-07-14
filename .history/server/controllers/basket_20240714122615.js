import Basket from '../models/Basket.js';
import Product from '../models/Product.js';

export const addToBasket = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.user_id : null; // Récupérer l'ID de l'utilisateur à partir du JWT si connecté
  const sessionId = req.sessionID; // Récupérer l'ID de session

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await Basket.create({
      id_user: userId,
      id_session: sessionId,
      id_product: productId,
      quantity: quantity
    });

    res.status(200).json({ message: 'Product added to basket' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
