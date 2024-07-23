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
      return res.status(400).json({ message: 'Validation error', details: e.errors });
    }
  
    const transaction = await sequelize.transaction();
  
    try {
      console.log('User ID:', userId);
      console.log('Session ID:', sessionId);
      console.log('Shipping Address:', shippingAddress);
      console.log('Billing Address:', billingAddress);
      console.log('Save Address:', saveAddress);
  
      // Récupérer les informations de l'utilisateur
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        console.log('User not found');
        await transaction.rollback();
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log('User found:', user);
  
      // Récupérer le panier de l'utilisateur
      const basket = await Basket.findOne({ where: { sessionId }, transaction });
      if (!basket || basket.items.length === 0) {
        console.log('Basket is empty or not found');
        await transaction.rollback();
        return res.status(400).json({ message: 'Basket is empty' });
      }
  
      console.log('Basket found:', basket);
  
      // Calculer le total de la commande
      let totalPrice = 0;
      const products = await Promise.all(
        basket.items.map(async (item) => {
          const product = await Product.findByPk(item.productId, { transaction });
          if (!product) {
            console.log(`Product with id ${item.productId} not found`);
            throw new Error(`Product with id ${item.productId} not found`);
          }
          console.log('Product found:', product);
          totalPrice += parseFloat(product.price) * item.quantity;
          return {
            productId: product.id,
            quantity: item.quantity,
            price: parseFloat(product.price),
          };
        })
      );
  
      console.log('Products:', products);
      console.log('Total Price:', totalPrice);
  
      const tax = totalPrice * 0.20; // 20% tax
      const finalPrice = totalPrice + tax;
  
      console.log('Tax:', tax);
      console.log('Final Price:', finalPrice);
  
      // Créer la commande
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
  
      console.log('Order created:', order);
  
      // Créer une session de paiement Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalPrice * 100), // Montant en centimes
        currency: 'eur',
        metadata: { orderId: order.id, sessionId: sessionId }, // Ajout du sessionId dans les métadonnées
      });
  
      console.log('Payment Intent created:', paymentIntent);
      console.log('Payment Intent Amount:', paymentIntent.amount);
  
      // Mettre à jour l'ID de l'intention de paiement Stripe dans la commande
      order.stripePaymentIntentId = paymentIntent.id;
      await order.save({ transaction });
  
      console.log('Order updated with Stripe Payment Intent ID:', order.stripePaymentIntentId);
  
      await transaction.commit();
      res.status(201).json({ orderId: order.id, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating order:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.destroy();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getOrderByPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.params;
  console.log('Received request for Payment Intent ID:', paymentIntentId);

  try {
    const order = await Order.findOne({ where: { stripePaymentIntentId: paymentIntentId } });

    if (!order) {
      console.log('Order not found for Payment Intent ID:', paymentIntentId);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Récupérer les détails des produits dans la commande
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

    console.log('Order found:', order);
    res.status(200).json({
      ...order.toJSON(),
      products: productsDetails,
    });
  } catch (error) {
    console.error('Error fetching order by payment intent:', error.message);
    res.status(500).json({ message: 'Internal server error' });
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
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;
  const { orderId, sessionId } = paymentIntent.metadata; // Récupérer le sessionId des métadonnées

  // Validation des métadonnées
  try {
    stripeWebhookSchema.parse({ orderId, sessionId });
  } catch (e) {
    console.error('Validation error:', e.errors);
    return res.status(400).json({ message: 'Validation error', details: e.errors });
  }

  console.log(`Received event: ${event.type} for order: ${orderId}`);

  const transaction = await sequelize.transaction();

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await Order.update({ status: 'En cours' }, { where: { id: orderId }, transaction });
        console.log(`Payment succeeded for order ${orderId}`);
        // Supprimer les données du panier associées au session_id
        await Basket.destroy({ where: { sessionId }, transaction });
        console.log(`Basket with session ID ${sessionId} deleted`);
        break;

      case 'payment_intent.payment_failed':
        await Order.destroy({ where: { id: orderId }, transaction });
        console.log(`Payment failed for order ${orderId}`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    await transaction.commit();
    res.json({ received: true });
  } catch (error) {
    await transaction.rollback();
    console.error('Error handling Stripe webhook:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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
  const userId = req.user.userId; // ID de l'utilisateur récupéré à partir du token JWT
  const userRole = req.user.role; // Rôle de l'utilisateur récupéré à partir du token JWT

  // Validation des données d'entrée
  try {
    orderIdSchema.parse({ orderId });
    updateOrderStatusSchema.parse({ status });
  } catch (e) {
    console.error('Validation error:', e.errors);
    return res.status(400).json({ message: 'Validation error', details: e.errors });
  }

  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    // Vérification de l'utilisateur ou du rôle administrateur
    if (order.userId !== userId && userRole !== 'ROLE_ADMIN') {
      await transaction.rollback();
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this order' });
    }

    order.status = status;
    await order.save({ transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

  export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    console.log(`Received request for Order ID: ${orderId}`);
    try {
      const order = await Order.findByPk(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Récupérer les détails des produits dans la commande
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
      console.error('Error fetching order by ID:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const refundOrderSchema = z.object({
    orderId: z.string().uuid(),
  });
  
  
  export const refundOrder = async (req, res) => {
    const { orderId } = req.params;
  
    // Validation des données d'entrée
    try {
      refundOrderSchema.parse({ orderId });
    } catch (e) {
      console.error('Validation error:', e.errors);
      return res.status(400).json({ message: 'Validation error', details: e.errors });
    }
  
    const transaction = await sequelize.transaction();
  
    try {
      const order = await Order.findByPk(orderId, { transaction });
      if (!order) {
        console.log('Order not found');
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
        console.log('Refund succeeded');
        await transaction.commit();
        return res.status(200).send({ success: true });
      } else {
        await transaction.rollback();
        console.log('Refund failed');
        return res.status(500).send({ error: 'Failed to refund the payment' });
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Error during refund:', error.message);
      return res.status(500).send({ error: error.message });
    }
  };
  
  
  
  

// Planifier une vérification des commandes en attente toutes les minutes
cron.schedule('* * * * *', async () => {
  console.log('Vérification des commandes en attente');
  const pendingOrders = await Order.findAll({
    where: {
      status: 'En attente',
      createdAt: {
        [Op.lt]: new Date(Date.now() - 3 * 60 * 1000) // Commandes créées il y a plus de 3 minutes
      }
    }
  });

  for (const order of pendingOrders) {
    console.log(`Order ${order.id} is still pending after 3 minutes. Deleting order.`);
    await Order.destroy({ where: { id: order.id } });
  }
});
