<template>
    <div class="confirmation">
      <div class="confirmation-content">
        <h2>Merci pour votre commande !</h2>
        <p>Votre paiement a été accepté et votre commande est en cours de traitement.</p>
        <p v-if="order.id">Numéro de commande : {{ order.id }}</p>
        <div v-if="order.products && order.products.length">
          <h3>Détails de la commande :</h3>
          <ul>
            <li v-for="product in order.products" :key="product.productId">
              <img :src="getProductImageUrl(product.image_preview)" alt="Product Image" />
              <p>{{ product.title }}</p>
              <p>Prix: {{ product.price }}€</p>
              <p>Quantité: {{ product.quantity }}</p>
            </li>
          </ul>
          <p>Taxe: {{ order.tax }}€</p>
          <p>Prix total: {{ order.totalPrice }}€</p>
        </div>
        <router-link to="/" @click.native="clearCart">Retour à la page d'accueil</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useCartStore } from '../stores/cartStore'; 
  
  const order = ref({});
  const apiUrl = import.meta.env.VITE_API_URL; 
  const cartStore = useCartStore();
  
  const fetchOrderDetails = async (paymentIntent) => {
    try {
      
  
      const response = await fetch(`${apiUrl}/orders/payment-intent/${paymentIntent}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
  
      
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error('Failed to fetch order details');
      }
  
      const data = await response.json();
      
      order.value = data;
    } catch (error) {
      
    }
  };
  
  const getProductImageUrl = (imagePreviewPath) => {
    const sanitizedPath = imagePreviewPath.replace('/home/node', '');
    return `${apiUrl}${sanitizedPath}`;
  };
  
  const clearCart = () => {
    cartStore.clearCart(); 
  };
  
  onMounted(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentIntent = query.get('payment_intent');
    const redirectStatus = query.get('redirect_status');
  
  
    if (redirectStatus === 'succeeded' && paymentIntent) {
      fetchOrderDetails(paymentIntent);
      clearCart();
    } else {
      console.error('Payment failed or canceled:', redirectStatus);
    }
  });
  </script>
  
  <style scoped lang="scss">
  .confirmation {
    background: linear-gradient(to bottom right, #f7f8fc, #e2e5f1);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  
    &-content {
      padding: 30px;
      max-width: 800px;
      width: 100%;
      margin: 20px;
      background-color: #ffffff;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
      font-family: 'Helvetica Neue', sans-serif;
  
      h2 {
        margin-bottom: 25px;
        font-size: 28px;
        color: #333;
        font-weight: bold;
        text-transform: uppercase;
      }
  
      p {
        margin-bottom: 15px;
        font-size: 18px;
        color: #666;
      }
  
      img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 10px;
        margin-right: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
  
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
  
        li {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          background: #f1f1f1;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
          p {
            margin: 0;
            font-size: 16px;
            color: #555;
          }
        }
      }
  
      a {
        display: inline-block;
        padding: 12px 25px;
        background-color: #41c902;
        color: #fff;
        border-radius: 5px;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s ease;
  
        &:hover {
          background-color: #36a201;
        }
      }
    }
  }
  </style>
  
  