import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

// Ajouter un produit aux favoris
export const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.user_id;

  console.log(`userId from token: ${userId}`);
  console.log(`productId from request body: ${productId}`);

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const existingFavorite = await Favorite.findOne({ where: { userId, productId } });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Produit déjà ajouté aux favoris' });
    }

    const favorite = await Favorite.create({ userId, productId });
    res.status(201).json(favorite);
  } catch (error) {
    console.log('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un produit des favoris
export const removeFavorite = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.user_id;

  try {
    const favorite = await Favorite.findOne({ where: { userId, productId } });
    if (!favorite) {
      return res.status(404).json({ error: 'Favori non trouvé' });
    }

    await favorite.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les produits favoris de l'utilisateur
export const getFavorites = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [Product]
    });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
