import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

// Ajouter un produit aux favoris
export const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId;

  console.log(`userId from token: ${userId}`);
  console.log(`productId from request body: ${productId}`);

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404); // Produit non trouvé
    }

    const existingFavorite = await Favorite.findOne({ where: { userId, productId } });
    if (existingFavorite) {
      return res.status(400); // Produit déjà ajouté aux favoris
    }

    const favorite = await Favorite.create({ userId, productId });
    res.status(201).json(favorite); // Succès, favori créé
  } catch (error) {
    console.log('Erreur:', error);
    res.status(500); // Erreur interne du serveur
  }
};

// Supprimer un produit des favoris
export const removeFavorite = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  try {
    // Recherche du favori dans la base de données
    const favorite = await Favorite.findOne({ where: { userId, productId } });
    if (!favorite) {
      return res.status(404); // Favori non trouvé
    }

    // Suppression du favori
    await favorite.destroy();
    res.status(204).end(); // Succès, pas de contenu à retourner
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }); // Erreur interne du serveur
  }
};

// Récupérer tous les produits favoris de l'utilisateur
export const getFavorites = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Recherche des favoris dans la base de données
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'brand', 'price', 'discounted_price', 'is_promotion', 'description', 'stock', 'image_preview'],
        },
      ],
    });

    // Retourne les favoris
    res.status(200).json(favorites); // Succès, retourne les favoris
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }); // Erreur interne du serveur
  }
};
