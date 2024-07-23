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
  