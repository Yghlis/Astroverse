import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import Character from '../models/Character.js';
import sequelize from '../config/database.js';

export const addProduct = async (req, res) => {
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
  const image_gallery = req.files && req.files['image_gallery'] ? req.files['image_gallery'].map(file => file.path) : [];

  const transaction = await sequelize.transaction();
  try {
    console.log("Finding universe record");
    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    console.log("Finding character record");
    const characterRecord = await Character.findOne({ where: { name: character } });
    if (!characterRecord) {
      return res.status(404).json({ error: 'Character not found' });
    }

    console.log("Creating product in SQL");
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
      tags,
      availability_status,
      views_count
    }, { transaction });

    console.log("Creating product in MongoDB");
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

    console.log("Committing transaction");
    await transaction.commit();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error in addProduct:", error);
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    console.log("Fetching all products from MongoDB");
    const products = await ProductMongo.find({});
    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Fetching product by id from MongoDB:", id);
    const product = await ProductMongo.findOne({ id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  console.log("updateProduct called with req.body:", req.body);
  console.log("updateProduct called with req.files:", req.files);

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
    character,
    universe,
    reference,
    details,
    tags,
    availability_status,
    views_count
  } = req.body;

  const image_preview = req.files && req.files['image_preview'] ? req.files['image_preview'][0].path : null;
  const image_gallery = req.files && req.files['image_gallery'] ? req.files['image_gallery'].map(file => file.path) : [];

  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      console.error('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }

    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      console.error('Universe not found');
      return res.status(404).json({ error: 'Universe not found' });
    }

    const characterRecord = await Character.findOne({ where: { name: character } });
    if (!characterRecord) {
      console.error('Character not found');
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
      image_preview: image_preview || product.image_preview,
      image_gallery: image_gallery.length ? image_gallery : product.image_gallery,
      character: characterRecord.id,
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
        image_preview: image_preview || productMongo.image_preview,
        image_gallery: image_gallery.length ? image_gallery : productMongo.image_gallery,
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
    } else {
      console.error('ProductMongo not found');
      return res.status(404).json({ error: 'ProductMongo not found' });
    }

    await transaction.commit();
    res.json(product);
  } catch (error) {
    await transaction.rollback();
    console.error('Error during transaction', error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  console.log("deleteProduct called with req.params:", req.params);

  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    console.log("Finding product by id:", id);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log("Deleting product in SQL");
    await product.destroy({ transaction });
    console.log("Deleting product in MongoDB");
    await ProductMongo.deleteOne({ id });

    console.log("Committing transaction");
    await transaction.commit();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
