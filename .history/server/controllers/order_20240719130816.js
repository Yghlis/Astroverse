import Order from '../models/Order.js';
import Basket from '../models/Basket.js';
import Product from '../models/Product.js';
import User from '../models/user.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  const userId = req.user.userId; // Récupérer l'ID utilisateur du token JWT
  const sessionId = req.headers['session-id'];
  const { shippingAddress, billingAddress } = req.body;

  try {
    console.log('User ID:', userId);
    console.log('Session ID:', sessionId);
    console.log('Shipping Address:', shippingAddress);
    console.log('Billing Address:', billingAddress);

    // Récupérer les informations de l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Récupérer le panier de l'utilisateur
    const basket = await Basket.findOne({ where: { sessionId } });
    if (!basket || basket.items.length === 0) {
      console.log('Basket is empty or not found');
      return res.status(400).json({ message: 'Basket is empty' });
    }

    console.log('Basket found:', basket);

    // Calculer le total de la commande
    let totalPrice = 0;
    const products = await Promise.all(
      basket.items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
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
    });

    console.log('Order created:', order);

    // Créer une session de paiement Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalPrice * 100), // Montant en centimes
      currency: 'eur',
      metadata: { orderId: order.id },
    });

    console.log('Payment Intent created:', paymentIntent);
    console.log('Payment Intent Amount:', paymentIntent.amount); 

    // Mettre à jour l'ID de l'intention de paiement Stripe dans la commande
    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    console.log('Order updated with Stripe Payment Intent ID:', order.stripePaymentIntentId);

    res.status(201).json({ orderId: order.id, clientSecret: paymentIntent.client_secret });
  } catch (error) {
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
    const order = await Order.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'title', 'price', 'image_preview']
        }
      ]
    });

    if (!order) {
      console.log('Order not found for Payment Intent ID:', paymentIntentId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order found:', order);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by payment intent:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

