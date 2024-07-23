import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';
import { z } from 'zod';

export const addFavorite = async (req, res) => {
  const userId = req.user.userId;
  const addFavoriteSchema = z.object({
    productId: z.string().uuid("Product ID must be a valid UUID"),
  });

  console.log(`userId from token: ${userId}`);


  try {
    addFavoriteSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: e.errors });
  }

  const { productId } = req.body;
  console.log(`productId from request body: ${productId}`);

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); 
    }

    const existingFavorite = await Favorite.findOne({ where: { userId, productId } });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Product already in favorites' }); 
    }

    const favorite = await Favorite.create({ userId, productId });
    res.status(201).json(favorite); 
  } catch (error) {
    console.log('Erreur:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
};

export const removeFavorite = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  try {

    const favorite = await Favorite.findOne({ where: { userId, productId } });
    if (!favorite) {
      return res.status(404);
    }
    await favorite.destroy();
    res.status(204).end(); 
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' }); 
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user.userId;

  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [Product]
    });

    res.status(200).json(favorites);
  } catch (error) {
    res.sendStatus(500);
  }
};
