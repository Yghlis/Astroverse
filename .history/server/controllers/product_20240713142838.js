import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import Character from '../models/Character.js';
import Follow from '../models/Follow.js';
import sequelize from '../config/database.js';
import nodemailer from 'nodemailer';
import { validate as validateUUID } from 'uuid';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', to);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};


const isUUIDValid = (id) => {
  return validateUUID(id);
};

const deleteUnusedFiles = (oldFiles, newFiles) => {
  oldFiles.forEach(file => {
    if (!newFiles.includes(file) && fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};

//suivre un produit
export const followProduct = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  if (userId !== req.user.userId) {
    return res.status(403).end();
  }

  try {
    const existingFollow = await Follow.findOne({ where: { userId, productId } });
    if (existingFollow) {
      return res.status(409).end();
    }

    const follow = await Follow.create({ userId, productId });
    res.status(201).json(follow);
  } catch {
    res.status(400).end();
  }
};

// Arrêter de suivre un produit
export const unfollowProduct = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  if (userId !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized to unfollow product for another user' });
  }

  // Validation des entrées
  if (!userId || !productId) {
    return res.status(400).json({ error: 'Missing userId or productId' });
  }

  try {
    const follow = await Follow.destroy({ where: { userId, productId } });
    if (follow) {
      return res.status(200).json({ message: 'Unfollowed product successfully' });
    } else {
      return res.status(404).json({ error: 'Follow relationship not found' });
    }
  } catch (error) {
    console.error("Error unfollowing product:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const getFollowedProducts = async (req, res) => {
  const userId = req.user.userId;
  if (userId !== req.params.userId) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
  }

  try {
    const followedProducts = await Follow.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: [
            'id', 'title', 'brand', 'price', 'discounted_price',
            'is_promotion', 'description', 'image_preview'
          ],
        },
      ],
    });

    res.status(200).json(followedProducts);
  } catch (error) {
    console.error("Error fetching followed products:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const addProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
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

    // Validate required fields
    validateProductFields({ title, price, character, universe, reference });

    // Check if reference is unique
    const existingProduct = await Product.findOne({ where: { reference }, transaction });
    if (existingProduct) {
      await transaction.rollback();
      return res.status(409).json({ error: 'Reference already exists' });
    }

    const image_preview = req.files && req.files['image_preview'] ? req.files['image_preview'][0].path : null;
    const image_gallery = Array.isArray(req.files['image_gallery']) ? req.files['image_gallery'].map(file => file.path) : [];

    const universeRecord = isUUIDValid(universe)
      ? await Universe.findByPk(universe, { transaction })
      : await Universe.findOne({ where: { name: universe }, transaction });

    if (!universeRecord) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Universe not found' });
    }

    const characterRecord = isUUIDValid(character)
      ? await Character.findByPk(character, { transaction })
      : await Character.findOne({ where: { name: character }, transaction });

    if (!characterRecord) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Character not found' });
    }

    const productTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

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
      tags: productTags,
      availability_status,
      views_count
    }, { transaction });

    await transaction.commit();

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
      tags: productTags,
      availability_status,
      views_count,
      created_at: product.created_at,
      updated_at: product.updated_at
    });

    await productMongo.save();

    // Envoyer une notification si le produit appartient à un univers suivi
    await notifyNewProductInUniverse(product);

    res.status(201).json(product);
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding product:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Notification lors de la création d'un nouveau produit dans un univers suivi
export const notifyNewProductInUniverse = async (product) => {
  try {
    const universe = await Universe.findByPk(product.universe); // Récupérer l'univers
    const followers = await Follow.findAll({ where: { universeId: product.universe }, include: [User] });
    for (const follow of followers) {
      const user = follow.User;
      const emailContent = `Un nouveau produit ${product.title} a été ajouté dans l'univers ${universe.name} que vous suivez.`;
      await sendEmail(user.email, 'Nouveau produit dans un univers suivi', emailContent);
    }
  } catch (error) {
    console.error('Error in notifyNewProductInUniverse:', error);
  }
};

export const getProducts = async (filters) => {
  const query = {};

  if (filters.title) {
    const regex = new RegExp(`^${filters.title}`, 'i');
    query.title = { $regex: regex };
  }

  if (filters.characters && filters.characters.length > 0) {
    query['character.name'] = { $in: filters.characters };
  }

  if (filters.universes && filters.universes.length > 0) {
    query['universe.name'] = { $in: filters.universes };
  }

  if (filters.ratings && filters.ratings.length > 0) {
    query.rating = { $in: filters.ratings };
  }

  if (filters.priceRange && filters.priceRange.min !== undefined && filters.priceRange.max !== undefined) {
    query.$or = [
      {
        is_promotion: false,
        price: { $gte: filters.priceRange.min, $lte: filters.priceRange.max },
      },
      {
        is_promotion: true,
        discounted_price: { $gte: filters.priceRange.min, $lte: filters.priceRange.max },
      },
    ];
  }

  if (filters.promotion === 'true') {
    query.is_promotion = true;
  }

  try {
    const products = await ProductMongo.find(query);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error('An error occurred while fetching products.');
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const { source } = req.query; 

  if (!id || !isUUIDValid(id)) {
    return res.status(400).json({ error: 'ID du produit invalide' });
  }

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Incrémenter le compteur de vues seulement si la source est client
    if (source === 'client') {
      product.views_count += 1;
      await product.save();

      // Optionnel : Mettre à jour le compteur de vues dans MongoDB si vous synchronisez les données
      const productMongo = await ProductMongo.findOne({ id });
      if (productMongo) {
        await productMongo.updateOne({ views_count: product.views_count });
      }
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).end();
  }
};

const validateProductFields = (fields) => {
  const requiredFields = ['title', 'price', 'character', 'universe', 'reference'];
  const missingFields = requiredFields.filter(field => !fields[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

export const updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
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

    // Validate required fields
    validateProductFields({ title, price, character, universe, reference });

    const product = await Product.findByPk(id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Check if reference is unique
    if (reference !== product.reference) {
      const existingProduct = await Product.findOne({ where: { reference }, transaction });
      if (existingProduct) {
        await transaction.rollback();
        return res.status(409).json({ error: 'Reference already exists' });
      }
    }

    const oldImagePreview = product.image_preview;
    const oldImageGallery = [...product.image_gallery];

    const image_preview = req.files && req.files['image_preview']
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files['image_preview'][0].filename}`
      : product.image_preview;

    let image_gallery = [...product.image_gallery];

    if (req.files && req.files['image_gallery']) {
      req.files['image_gallery'].forEach((file, index) => {
        if (file) {
          image_gallery[index] = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }
      });
    }

    const universeRecord = isUUIDValid(universe)
      ? await Universe.findByPk(universe, { transaction })
      : await Universe.findOne({ where: { name: universe }, transaction });

    if (!universeRecord) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Universe non trouvée' });
    }

    const characterRecord = isUUIDValid(character)
      ? await Character.findByPk(character, { transaction })
      : await Character.findOne({ where: { name: character }, transaction });

    if (!characterRecord) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Personnage non trouvé' });
    }

    const productTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const previousStock = product.stock;
    const previousIsPromotion = product.is_promotion;

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
      tags: productTags,
      availability_status,
      views_count
    }, { transaction });

    await transaction.commit();

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
        tags: productTags,
        availability_status,
        views_count,
        updated_at: new Date()
      });
    } else {
      return res.status(404).json({ error: 'Produit non trouvé dans MongoDB' });
    }

    if (image_preview !== oldImagePreview && fs.existsSync(oldImagePreview)) {
      fs.unlinkSync(oldImagePreview);
    }
    deleteUnusedFiles(oldImageGallery, image_gallery);

    // Envoyer des notifications de changement de produit
    await notifyProductChange(product, previousStock, previousIsPromotion);

    res.json(product);
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction error:", error);
    res.status(500).end();
  }
};

// Notification lors du changement de stock ou de promotion
export const notifyProductChange = async (product, previousStock, previousIsPromotion) => {
  try {
    const followers = await Follow.findAll({ where: { productId: product.id }, include: [User] });
    console.log(`Found ${followers.length} followers for product ${product.title} with ID ${product.id}`);
    
    for (const follow of followers) {
      const user = follow.User;
      console.log(`Checking conditions for user ${user.email}`);
      
      const currentStock = product.stock;
      const currentPromotion = product.is_promotion;
      
      console.log(`Previous stock: ${previousStock}, Current stock: ${currentStock}`);
      console.log(`Previous promotion: ${previousIsPromotion}, Current promotion: ${currentPromotion}`);
      
      if (currentStock === 0 && previousStock > 0) {
        console.log(`Notifying ${user.email} that product ${product.title} is out of stock`);
        const emailContent = `Le produit ${product.title} est en rupture de stock.`;
        await sendEmail(user.email, 'Produit en rupture de stock', emailContent);
      } else if (previousStock === 0 && currentStock > 0) {
        console.log(`Notifying ${user.email} that product ${product.title} is back in stock`);
        const emailContent = `Le produit ${product.title} est de nouveau en stock.`;
        await sendEmail(user.email, 'Produit de nouveau en stock', emailContent);
      }

      if (currentPromotion && previousIsPromotion === false) {
        console.log(`Notifying ${user.email} that product ${product.title} is now on promotion`);
        const emailContent = `Le produit ${product.title} est maintenant en promotion.`;
        await sendEmail(user.email, 'Produit en promotion', emailContent);
      } else if (!currentPromotion && previousIsPromotion === true) {
        console.log(`Notifying ${user.email} that product ${product.title} is no longer on promotion`);
        const emailContent = `Le produit ${product.title} n'est plus en promotion.`;
        await sendEmail(user.email, 'Produit plus en promotion', emailContent);
      }
    }
  } catch (error) {
    console.error('Error in notifyProductChange:', error);
  }
};

export const deleteProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    if (!id || !isUUIDValid(id)) {
      return res.status(400).end(); 
    }

    const product = await Product.findByPk(id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).end(); 
    }

    const oldImagePreview = product.image_preview;
    const oldImageGallery = [...product.image_gallery];

    await product.destroy({ transaction });

    const productMongo = await ProductMongo.findOne({ id });
    if (productMongo) {
      await ProductMongo.deleteOne({ id });
    }

    await transaction.commit();

    // Suppression des anciens fichiers d'image
    if (oldImagePreview && fs.existsSync(oldImagePreview)) {
      fs.unlinkSync(oldImagePreview);
    }
    oldImageGallery.forEach(file => {
      if (file && fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    res.status(204).end(); 
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting product:", error);
    res.status(500).end(); 
  }
};
