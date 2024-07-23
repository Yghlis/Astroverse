import fs from 'fs';
import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import Character from '../models/Character.js';
import Follow from '../models/Follow.js';
import sequelize from '../config/database.js';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
import { validate as validateUUID } from 'uuid';
import { z } from 'zod';
import { Op } from 'sequelize';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
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

const getAdminAndStoreKeeperUsers = async () => {
  try {
    const users = await User.findAll({
      where: {
        roles: {
          [Op.overlap]: ['ROLE_ADMIN', 'ROLE_STORE_KEEPER']
        }
      }
    });
    return users;
  } catch (error) {
    throw new Error('marche po lo');
  }
};

export const followProduct = async (req, res) => {
  const followProductSchema = z.object({
    userId: z.string().uuid(),
  });

  const { productId } = req.params;

  try {
    followProductSchema.parse(req.body);
    const { userId } = req.body;

    if (userId !== req.user.userId) {
      return res.status(403).end();
    }

    const transaction = await sequelize.transaction();

    try {
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json();
      }

      const existingFollow = await Follow.findOne({ where: { userId, productId }, transaction });
      if (existingFollow) {
        await transaction.rollback();
        return res.status(409).end();
      }

      const follow = await Follow.create({ userId, productId }, { transaction });
      await transaction.commit();
      res.status(201).json(follow);
    } catch (error) {
      await transaction.rollback();
      res.status(400).end();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json();
    }
    res.status(500).json();
  }
};

export const unfollowProduct = async (req, res) => {
  const unfollowProductSchema = z.object({
    userId: z.string().uuid(),
  });

  const { productId } = req.params;

  try {
    unfollowProductSchema.parse(req.body);
    const { userId } = req.body;

    if (userId !== req.user.userId) {
      return res.status(403).json();
    }

    const transaction = await sequelize.transaction();

    try {
      const follow = await Follow.destroy({ where: { userId, productId }, transaction });
      if (follow) {
        await transaction.commit();
        return res.status(200).json();
      } else {
        await transaction.rollback();
        return res.status(404).json();
      }
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json();
    }
    return res.status(500).json();
  }
};

export const getFollowedProducts = async (req, res) => {
  const userId = req.user.userId;
  const requestedUserId = req.params.userId;
  
  if (userId !== requestedUserId) {
    return res.status(403).json();
  }

  try {
    const followedProducts = await Follow.findAll({
      where: { userId: requestedUserId },
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

    res.json(followedProducts);
  } catch (error) {
    res.status(500).json();
  }
};

export const checkStock = async (req, res) => {
  const checkStockSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive()
  });
  try {
    console.log('Request body:', req.body);
    checkStockSchema.parse(req.body);
  } catch (e) {
    console.error('Validation error:', e.errors);
    return res.status(400).json({ available: false, message: 'Validation error', details: e.errors });
  }

  const { productId, quantity } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({ available: false, message: 'Product not found' });
    }
    if (product.stock < quantity) {
      console.log('Insufficient stock for product:', productId);
      return res.status(200).json({ available: false, message: 'Insufficient stock' });
    }

    console.log('Stock available for product:', productId);
    res.status(200).json({ available: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ available: false, message: 'Server error', error });
  }
};

export const addProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("addProduct called with req.body:", req.body);
    console.log("addProduct called with req.files:", req.files);

    const schema = z.object({
      title: z.string().nonempty('Le titre est requis'),
      brand: z.string().nonempty('La marque est requise'),
      price: z.string().refine(val => /^\d+([.,]\d{1,2})?$/.test(val), {
        message: 'Le prix doit être un nombre positif avec ou sans centimes',
      }),
      discounted_price: z.string().optional().refine(val => /^\d+([.,]\d{1,2})?$/.test(val), {
        message: 'Le prix promotionnel doit être un nombre positif avec ou sans centimes',
      }),
      is_promotion: z.union([z.boolean(), z.string().transform(val => val.toLowerCase() === 'true')]),
      description: z.string().nonempty('La description est requise'),
      stock: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]),
      alert_stock: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]).optional(),
      character: z.string().nonempty('Le personnage est requis'),
      universe: z.string().nonempty('L\'univers est requis'),
      reference: z.string().optional(),
      details: z.union([z.object({
        dimensions: z.string().nonempty('Les dimensions sont requises'),
        weight: z.string().nonempty('Le poids est requis'),
        materials: z.string().nonempty('Les matériaux sont requis')
      }), z.string().transform(val => JSON.parse(val))]).optional(),
      tags: z.string().optional(),
      availability_status: z.string().nonempty('Le statut de disponibilité est requis'),
      views_count: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]),
      number_of_purchases: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]).optional(),
      number_of_favorites: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]).optional(),
      rating: z.union([z.number().nonnegative(), z.string().transform(val => parseFloat(val))]).optional()
    })

    const validatedData = schema.parse(req.body);

    const {
      title,
      brand,
      price,
      discounted_price,
      is_promotion,
      description,
      stock,
      alert_stock,
      character,
      universe,
      reference,
      details,
      tags,
      availability_status,
      views_count,
      number_of_purchases,
      number_of_favorites,
      rating
    } = validatedData;

    validateProductFields({ title, price, character, universe, reference });
    // Check if reference is unique
    const existingProduct = await Product.findOne({ where: { reference }, transaction });
    if (existingProduct) {
      await transaction.rollback();
      return res.status(409).json({ error: 'Reference already exists' });
    }

    const image_preview = req.files && req.files['image_preview'] ? req.files['image_preview'][0].path : null;
    const image_gallery = req.files && Array.isArray(req.files['image_gallery']) ? req.files['image_gallery'].map(file => file.path) : [];

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
      alert_stock,
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
      alert_stock,
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

    const schema = z.object({
      title: z.string().nonempty('Le titre est requis'),
      brand: z.string().nonempty('La marque est requise'),
      price: z.string().refine(val => /^\d+([.,]\d{1,2})?$/.test(val), {
        message: 'Le prix doit être un nombre positif avec ou sans centimes',
      }),
      discounted_price: z.string().optional().refine(val => /^\d+([.,]\d{1,2})?$/.test(val), {
        message: 'Le prix promotionnel doit être un nombre positif avec ou sans centimes',
      }),
      is_promotion: z.union([z.boolean(), z.string().transform(val => val.toLowerCase() === 'true')]),
      description: z.string().nonempty('La description est requise'),
      stock: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]),
      alert_stock: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]).optional(),
      character: z.string().nonempty('Le personnage est requis'),
      universe: z.string().nonempty('L\'univers est requis'),
      reference: z.string().optional(),
      details: z.union([z.object({
        dimensions: z.string().nonempty('Les dimensions sont requises'),
        weight: z.string().nonempty('Le poids est requis'),
        materials: z.string().nonempty('Les matériaux sont requis')
      }), z.string().transform(val => JSON.parse(val))]).optional(),
      tags: z.string().optional(),
      availability_status: z.string().nonempty('Le statut de disponibilité est requis'),
      views_count: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]),
      number_of_purchases: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]).optional(),
      number_of_favorites: z.union([z.number().int().nonnegative(), z.string().transform(val => parseInt(val, 10))]).optional(),
      rating: z.union([z.number().nonnegative(), z.string().transform(val => parseFloat(val))]).optional()
    }).passthrough();

    const validatedData = schema.parse(req.body);

    const {
      title,
      brand,
      price,
      discounted_price,
      is_promotion,
      description,
      stock,
      alert_stock,
      character,
      universe,
      reference,
      details,
      tags,
      availability_status,
      views_count,
      number_of_purchases,
      number_of_favorites,
      rating
    } = validatedData;

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
      alert_stock,
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
        alert_stock,
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

    // Envoyer des notifications de stock bas
    if (product.stock < product.alert_stock) {
      const usersToNotify = await getAdminAndStoreKeeperUsers();
      const emailContent = `Le stock du produit ${product.title} est bas. Stock restant: ${product.stock}.`;
      const emailPromises = usersToNotify.map(user => 
        sendEmail(user.email, 'Stock bas pour un produit', emailContent)
      );
      await Promise.all(emailPromises);
    }

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
