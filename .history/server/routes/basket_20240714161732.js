import express from 'express';
import { addToBasket, decrementFromBasket, removeFromBasket } from '../controllers/basket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route pour ajouter un produit au panier
router.post('/', addToBasket);

// Route pour décrémenter un produit du panier
router.put('/', decrementFromBasket);

// Route pour supprimer un produit du panier
router.delete('/', removeFromBasket);

// Route pour vérifier si le produit existe déjà dans le panier
router.post('/exists', authenticateToken, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user ? req.user.userId : null; // Récupérer l'ID utilisateur du token JWT si disponible
    const sessionId = req.headers['session-id'];
  
    if (!productId || !sessionId) {
      return res.status(400).json({ exists: false, message: 'Product ID and session ID are required.' });
    }
  
    try {
      let basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        basket = await Basket.findOne({ where: { sessionId } });
      }
  
      if (!basket) {
        return res.status(200).json({ exists: false });
      }
  
      const existingItem = basket.items.find(item => item.productId === productId);
      res.status(200).json({ exists: !!existingItem });
    } catch (error) {
      console.error('Error checking basket:', error);
      res.status(500).json({ exists: false, message: 'Internal server error.' });
    }
  });
  

export default router;
