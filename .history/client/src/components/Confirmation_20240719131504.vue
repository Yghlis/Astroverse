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
                <img :src="`${apiUrl}/${product.image_preview}`" alt="Product Image" />
              <p>{{ product.title }}</p>
              <p>Prix: {{ product.price }}€</p>
              <p>Quantité: {{ product.quantity }}</p>
            </li>
          </ul>
          <p>Taxe: {{ order.tax }}€</p>
          <p>Prix total: {{ order.totalPrice }}€</p>
        </div>
        <router-link to="/">Retour à la page d'accueil</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const order = ref({});
  
  const fetchOrderDetails = async (paymentIntent) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('API URL:', apiUrl);
      console.log('Fetching order details with Payment Intent ID:', paymentIntent);
      
      const response = await fetch(`${apiUrl}/orders/${paymentIntent}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error('Failed to fetch order details');
      }
  
      const data = await response.json();
      console.log('Order details fetched successfully:', data);
      order.value = data;
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  
  onMounted(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentIntent = query.get('payment_intent');
    const redirectStatus = query.get('redirect_status');
  
    console.log('Redirect status:', redirectStatus);
    console.log('Payment Intent:', paymentIntent);
  
    if (redirectStatus === 'succeeded' && paymentIntent) {
      console.log('Payment succeeded:', paymentIntent);
      // Fetch the order details using the paymentIntent ID
      fetchOrderDetails(paymentIntent);
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
  