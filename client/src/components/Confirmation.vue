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
  
  <style scoped>
  .confirmation {
    background-color: #ccc;
    &-content {
      padding: 20px;
      max-width: 700px;
      margin: 50px auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
  
      h2 {
        margin-bottom: 20px;
        font-size: 24px;
      }
  
      p {
        margin-bottom: 20px;
        font-size: 18px;
      }
  
      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
      }
  
      ul {
        list-style-type: none;
        padding: 0;
      }
  
      li {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
  
      a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #41c902;
        color: white;
        border-radius: 4px;
        text-decoration: none;
        &:hover {
          background-color: #55af00;
        }
      }
    }
  }
  </style>
  