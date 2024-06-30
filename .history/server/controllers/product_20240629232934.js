import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import Character from '../models/Character.js';
import sequelize from '../config/database.js';
import { validate as validateUUID } from 'uuid';

const isUUIDValid = (id) => {
  return validateUUID(id);
};

export const addProduct = async (req, res) => {
  try {
    console.log("addProduct called with req.body:", req.body);
    console.log("addProduct called with req.files:", req.files);

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
      character,
      universe,
      reference,
      details,
      tags,
      availability_status,
      views_count
    } = req.body;

    const image_preview = req.files && req.files['image_preview'] ? req.files['image_preview'][0].path : null;
    const image_gallery = Array.isArray(req.files['image_gallery']) ? req.files['image_gallery'].map(file => file.path) : [];

    const transaction = await sequelize.transaction();
    try {
      const universeRecord = isUUIDValid(universe)
        ? await Universe.findByPk(universe)
        : await Universe.findOne({ where: { name: universe } });

      if (!universeRecord) {
        return res.status(404).json({ error: 'Universe not found' });
      }

      const characterRecord = isUUIDValid(character)
        ? await Character.findByPk(character)
        : await Character.findOne({ where: { name: character } });

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
        character: characterRecord.id,
        universe: universeRecord.id,
        reference,
        details,
        tags: Array.isArray(tags) ? tags : [],
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
        tags: Array.isArray(tags) ? tags : [],
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
  } catch (error) {
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await ProductMongo.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!id || !isUUIDValid(id)) {
    return res.status(400).json({ error: 'ID du produit invalide' });
  }
  try {
    const product = await ProductMongo.findOne({ id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log("updateProduct appelé avec req.body:", req.body);
    console.log("updateProduct appelé avec req.files:", req.files);

    const { id } = req.params;
    if (!id || !isUUIDValid(id)) {
      return res.status(400).json({ error: 'ID du produit invalide' });
    }

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
      character,
      universe,
      reference,
      details,
      tags,
      availability_status,
      views_count
    } = req.body;

    // Trouver le produit existant dans la base de données
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const image_preview = req.files && req.files['image_preview'] 
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files['image_preview'][0].filename}` 
      : product.image_preview;

    // Traiter les images de la galerie
    let image_gallery = [...product.image_gallery]; // Clone de la galerie existante

    if (req.files && req.files['image_gallery']) {
      req.files['image_gallery'].forEach((file, index) => {
        if (file) {
          image_gallery[index] = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }
      });
    }

    const transaction = await sequelize.transaction();
    try {
      const universeRecord = isUUIDValid(universe)
        ? await Universe.findByPk(universe)
        : await Universe.findOne({ where: { name: universe } });

      if (!universeRecord) {
        return res.status(404).json({ error: 'Universe non trouvée' });
      }

      const characterRecord = isUUIDValid(character)
        ? await Character.findByPk(character)
        : await Character.findOne({ where: { name: character } });

      if (!characterRecord) {
        return res.status(404).json({ error: 'Personnage non trouvé' });
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
        character: characterRecord.id,
        universe: universeRecord.id,
        reference,
        details,
        tags: Array.isArray(tags) ? tags : [],
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
          tags: Array.isArray(tags) ? tags : [],
          availability_status,
          views_count,
          updated_at: new Date()
        });
      } else {
        return res.status(404).json({ error: 'Produit non trouvé dans MongoDB' });
      }

      await transaction.commit();
      res.json(product);
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction error:", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ error: 'Erreur serveur inattendue' });
  }
};




export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isUUIDValid(id)) {
      return res.status(400).json({ error: 'ID du produit invalide' });
    }

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
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur inattendue' });
  }
};
