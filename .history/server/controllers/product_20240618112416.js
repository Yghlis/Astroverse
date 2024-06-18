import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import Character from '../models/Character.js';
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
    character, // Nom du personnage
    universe, // Nom de l'univers
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
      return res.status(404).json({ error: 'Universe not found' });
    }

    // Vérification de l'existence du personnage par son nom
    const characterRecord = await Character.findOne({ where: { name: character } });
    if (!characterRecord) {
      return res.status(404).json({ error: 'Character not found' });
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
      character: characterRecord.id, // Utilisation de l'ID du personnage
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
      character: {
        id: characterRecord.id,
        name: characterRecord.name
      },
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

// Obtenir les produits
export const getProducts = async (req, res) => {
  try {
    const products = await ProductMongo.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  const { id } = req.params;
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
    character, // Nom du personnage
    universe, // Nom de l'univers
    reference,
    details,
    tags,
    availability_status,
    views_count
  } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Vérification de l'existence de l'univers par son nom
    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    // Vérification de l'existence du personnage par son nom
    const characterRecord = await Character.findOne({ where: { name: character } });
    if (!characterRecord) {
      return res.status(404).json({ error: 'Character not found' });
    }

    await product.update({
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
      character: characterRecord.id, // Utilisation de l'ID du personnage
      universe: universeRecord.id,
      reference,
      details,
      tags,
      availability_status,
      views_count
    }, { transaction });

    const productMongo = await ProductMongo.findOne({ id });
    if (productMongo) {
      await productMongo.updateOne({
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
        character: {
          id: characterRecord.id,
          name: characterRecord.name
        },
        universe: {
          id: universeRecord.id,
          name: universeRecord.name
        },
        reference,
        details,
        tags,
        availability_status,
        views_count,
        updated_at: new Date()
      });
    }

    await transaction.commit();
    res.json(product);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy({ transaction });
    await ProductMongo.deleteOne({ id });

    await transaction.commit();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
