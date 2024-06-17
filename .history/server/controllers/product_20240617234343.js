import Product from '../models/Product.js';

// Ajouter un produit
export const addProduct = async (req, res) => {
  const {
    title,
    brand,
    price,
    discounted_price,
    is_promotion,
    description,
    stock,
    number_of_purchases,
    number_of_favorites,
    rating,
    image_preview,
    image_gallery,
    character,
    universe,
    reference,
    details,
    tags,
    availability_status,
    views_count
  } = req.body;

  try {
    const product = await Product.create({
      title,
      brand,
      price,
      discounted_price,
      is_promotion,
      description,
      stock,
      number_of_purchases,
      number_of_favorites,
      rating,
      image_preview,
      image_gallery,
      character,
      universe,
      reference,
      details,
      tags,
      availability_status,
      views_count
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
