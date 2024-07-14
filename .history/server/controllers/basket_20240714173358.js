import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js'; // Importer le modèle MongoDB

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

    await Basket.update({ items: basket.items, updatedAt: new Date() }, { where: { id: basket.id } });

    // Mettre à jour le stock du produit
    const product = await Product.findByPk(productId);
    if (product) {
      product.stock += 1;
      await product.save();
    }

    // Mettre à jour le stock du produit dans MongoDB
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
