<template>
    <div class="confirmation">
      <div class="confirmation-content">
        <h2>Merci pour votre commande !</h2>
        <p>Votre paiement a été accepté et votre commande est en cours de traitement.</p>
        <router-link to="/">Retour à la page d'accueil</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  
  onMounted(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentIntent = query.get('payment_intent');
    const paymentIntentClientSecret = query.get('payment_intent_client_secret');
    const redirectStatus = query.get('redirect_status');
  
    if (redirectStatus === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent, paymentIntentClientSecret);
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
  