import Order from '../models/Order.js';
import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import User from '../models/user.js';
import Stripe from 'stripe';
import cron from 'node-cron';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getAllOrders = async (req, res) => {
    try {
      const { userId } = req.query;
  
      let orders;
      if (userId) {
        orders = await Order.findAll({
          where: { userId },
        });
      } else {
        orders = await Order.findAll();
      }
  
      const detailedOrders = await Promise.all(
        orders.map(async (order) => {
          const productsDetails = await Promise.all(
            order.products.map(async (item) => {
              const product = await Product.findByPk(item.productId);
              return {
                ...item,
                title: product.title,
                image_preview: product.image_preview,
              };
            })
          );
          return {
            ...order.toJSON(),
            products: productsDetails,
          };
        })
      );
  
      res.status(200).json(detailedOrders);
    } catch (error) {
      res.status(500).json();
    }
  };

  const createOrderSchema = z.object({
    shippingAddress: z.string().nonempty(),
    billingAddress: z.string().nonempty(),
    saveAddress: z.boolean().optional(),
  });
  

  export const createOrder = async (req, res) => {
    const userId = req.user.userId;
    const sessionId = req.headers['session-id'];
    const { shippingAddress, billingAddress, saveAddress } = req.body;
  
    try {
      createOrderSchema.parse({ shippingAddress, billingAddress, saveAddress });
    } catch (e) {
      return res.status(400).json();
    }
  
    const transaction = await sequelize.transaction();
  
    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json();
      }
      const basket = await Basket.findOne({ where: { sessionId }, transaction });
      if (!basket || basket.items.length === 0) {
        await transaction.rollback();
        return res.status(400).json();
      }
      let totalPrice = 0;
      const products = await Promise.all(
        basket.items.map(async (item) => {
          const product = await Product.findByPk(item.productId, { transaction });
          if (!product) {
            throw new Error(`Product with id ${item.productId} not found`);
          }
          // Determine the price to use based on promotion status
          const priceToUse = product.is_promotion && product.discounted_price != null ? parseFloat(product.discounted_price) : parseFloat(product.price);
          totalPrice += priceToUse * item.quantity;
          return {
            productId: product.id,
            quantity: item.quantity,
            price: priceToUse,  
          };
        })
      );

      const tax = totalPrice * 0.20;
      const finalPrice = totalPrice + tax;
      const order = await Order.create({
        userId,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        shippingAddress,
        billingAddress,
        products,
        tax,
        totalPrice: finalPrice,
        status: 'En attente',
      }, { transaction });
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalPrice * 100), 
        currency: 'eur',
        metadata: { orderId: order.id, sessionId: sessionId },
      });
  
      order.stripePaymentIntentId = paymentIntent.id;
      await order.save({ transaction });
      await transaction.commit();
      res.status(201).json({ orderId: order.id, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json();
    }
  };

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json();
    }
    await order.destroy();
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
};

export const getOrderByPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.params;

  try {
    const order = await Order.findOne({ where: { stripePaymentIntentId: paymentIntentId } });

    if (!order) {
      return res.status(404).json();
    }
    const productsDetails = await Promise.all(
      order.products.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item,
          title: product.title,
          image_preview: product.image_preview,
        };
      })
    );

    res.status(200).json({
      ...order.toJSON(),
      products: productsDetails,
    });
  } catch (error) {
    res.status(500).json();
  }
};

const stripeWebhookSchema = z.object({
  orderId: z.string().uuid(),
  sessionId: z.string().nonempty(),
});

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;
  const { orderId, sessionId } = paymentIntent.metadata; 

  try {
    stripeWebhookSchema.parse({ orderId, sessionId });
  } catch (e) {
    return res.status(400).json();
  }

  const transaction = await sequelize.transaction();

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await Order.update({ status: 'En cours' }, { where: { id: orderId }, transaction });
        await Basket.destroy({ where: { sessionId }, transaction });
        break;

      case 'payment_intent.payment_failed':
        await Order.destroy({ where: { id: orderId }, transaction });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    await transaction.commit();
    res.json({ received: true });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json();
  }
};

const updateOrderStatusSchema = z.object({
  status: z.enum(['En attente', 'En cours', 'Expédiée', 'Livrée', 'Échouée', 'Retour demandée', 'Retour reçue', 'Remboursée']),
});

const orderIdSchema = z.object({
  orderId: z.string().uuid(),
});


export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const userId = req.user.userId; 
  const userRole = req.user.role;

  try {
    orderIdSchema.parse({ orderId });
    updateOrderStatusSchema.parse({ status });
  } catch (e) {
    return res.status(400).json({ message: 'Validation error', details: e.errors });
  }

  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }
import express from 'express';
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  followProduct,
  unfollowProduct,
  getFollowedProducts,
  checkStock
} from '../controllers/product.js';
import upload from '../middleware/multer.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const logRequest = (req, res, next) => {
  next();
};

const logMulterResult = (req, res, next) => {
  next();
};

// Route pour ajouter un produit avec upload d'images (accessible uniquement aux administrateurs)
router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), addProduct);

// Route pour récupérer tous les produits avec filtres (accessible à tous)
router.get('/', async (req, res) => {
  const { title, characters, universes, ratings, priceRange, promotion } = req.query || {};

  const characterArray = characters ? characters.split(',') : [];
  const universeArray = universes ? universes.split(',') : [];
  const ratingArray = ratings ? ratings.split(',').map(Number) : [];
  const [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [0, Infinity];

  const filters = {
    title,
    characters: characterArray,
    universes: universeArray,
    ratings: ratingArray,
    priceRange: { min: minPrice, max: maxPrice },
    promotion
  };

  try {
    const products = await getProducts(filters);
    res.json(products);
  } catch (error) {
    res.status(500).end();
  }
});

router.post('/check-stock', checkStock);
router.get('/:id', getProductById);
router.put('/:id', authenticateToken, requireRole(['ROLE_ADMIN', 'ROLE_STORE_KEEPER']), logRequest, upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), logMulterResult, updateProduct);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), deleteProduct);
router.post('/:productId/follow', authenticateToken, followProduct);
router.delete('/:productId/follow', authenticateToken, unfollowProduct);
router.get('/:userId/followed', authenticateToken, getFollowedProducts);

export default router;

    if (order.userId !== userId && userRole !== 'ROLE_ADMIN') {
      await transaction.rollback();
      return res.status(403).json();
    }

    order.status = status;
    await order.save({ transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json();
  }
};

  export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findByPk(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      const productsDetails = await Promise.all(
        order.products.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return {
            ...item,
            title: product.title,
            image_preview: product.image_preview,
          };
        })
      );
  
      res.status(200).json({
        ...order.toJSON(),
        products: productsDetails,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const refundOrderSchema = z.object({
    orderId: z.string().uuid(),
  });
  
  
  export const refundOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
      refundOrderSchema.parse({ orderId });
    } catch (e) {
      return res.status(400).json({ message: 'Validation error', details: e.errors });
    }
  
    const transaction = await sequelize.transaction();
  
    try {
      const order = await Order.findByPk(orderId, { transaction });
      if (!order) {
        await transaction.rollback();
        return res.status(404).send({ error: 'Order not found' });
      }
  
      console.log(`Initiating refund for Payment Intent ID: ${order.stripePaymentIntentId}`);
  
      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });
  
      if (refund.status === 'succeeded') {
        order.paymentStatus = 'refunded';
        await order.save({ transaction });
        await transaction.commit();
        return res.status(200).send({ success: true });
      } else {
        await transaction.rollback();
        return res.status(500).send({ error: 'Failed to refund the payment' });
      }
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send({ error: error.message });
    }
  };
  
cron.schedule('* * * * *', async () => {
  const pendingOrders = await Order.findAll({
    where: {
      status: 'En attente',
      createdAt: {
        [Op.lt]: new Date(Date.now() - 3 * 60 * 1000)
      }
    }
  });

  for (const order of pendingOrders) {
    await Order.destroy({ where: { id: order.id } });
  }
});
