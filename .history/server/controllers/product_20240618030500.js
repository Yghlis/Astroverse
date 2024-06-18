// server/controllers/product.js
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import sequelize from '../config/database.js';

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
    universe, // Univers en tant que nom
    reference,
    details,
    tags,
    availability_status,
    views_count
  } = req.body;

  const transaction = await sequelize.transaction();
  try {
    // Vérification de l'existence de l'univers par son nom
    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      throw new Error('Universe not found');
    }

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
      universe: universeRecord.id, // Utilisation de l'ID de l'univers
      reference,
      details,
      tags,
      availability_status,
      views_count
    }, { transaction });

    const productMongo = new ProductMongo({
      id: product.id,
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
      universe: {
        id: universeRecord.id,
        name: universeRecord.name
      },
      reference,
      details,
      tags,
      availability_status,
      views_count,
      created_at: product.created_at,
      updated_at: product.updated_at
    });

    await productMongo.save();

    await transaction.commit();
    res.status(201).json(product);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Autres fonctions du contrôleur...
