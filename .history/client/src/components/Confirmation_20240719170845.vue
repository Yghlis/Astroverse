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
        <router-link to="/" @click.native="clearBasket">Retour à la page d'accueil</router-link>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useBasketStore } from '../store/basketStore'; // Assuming you have a Vuex store
  
  const order = ref({});
  const apiUrl = import.meta.env.VITE_API_URL; // Récupérer l'URL de l'API
  const basketStore = useBasketStore(); // Access the basket store
  
  const fetchOrderDetails = async (paymentIntent) => {
    try {
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
  
  const getProductImageUrl = (imagePreviewPath) => {
    // Supprimer la partie "/home/node" du chemin de l'image
    const sanitizedPath = imagePreviewPath.replace('/home/node', '');
    return `${apiUrl}${sanitizedPath}`;
  };
  
  const clearBasket = () => {
    basketStore.clearBasket(); // Assuming you have an action to clear the basket
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
      clearBasket();
    } else {
      console.error('Payment failed or canceled:', redirectStatus);
    }
  });
  </script>
  