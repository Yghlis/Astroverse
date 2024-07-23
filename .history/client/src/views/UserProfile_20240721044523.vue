<template>
  <div class="profile-container">
    <h2>Mes Informations</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="firstName">Prénom<span>*</span>:</label>
        <input v-model="firstName" id="firstName" type="text" required />
      </div>

      <div class="form-group">
        <label for="lastName">Nom<span>*</span>:</label>
        <input v-model="lastName" id="lastName" type="text" required />
      </div>

      <div class="form-group">
        <label for="email">Email<span>*</span>:</label>
        <input v-model="email" id="email" type="email" required />
      </div>

      <div class="form-group" v-if="phoneNumber">
        <label for="phoneNumber">Numéro de Téléphone:</label>
        <input v-model="phoneNumber" id="phoneNumber" type="text" />
      </div>

      <div class="form-group address-section">
        <label for="address">Adresse</label>
        <input
          v-model="address"
          @input="handleInput"
          type="text"
          id="address"
          placeholder="Entrez votre adresse"
          required
        />
        <ul v-if="suggestions.length">
          <TheLoader v-if="loading" :loading="loading"></TheLoader>
          <li
            v-else
            v-for="suggestion in suggestions"
            :key="suggestion.place_id"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion.formatted }}
          </li>
        </ul>
      </div>
      <button type="submit" :disabled="!addressSelected">
        Mettre à jour le profil
      </button>
      <p @click="sendResetEmail">Modifier le mot de passe</p>
    </form>
    <h2>Mes produits suivis</h2>
    <TheCarousel>
      <shopCard
        v-for="item in displayProducts"
        :key="item.id"
        :product="item.Product"
      ></shopCard>
    </TheCarousel>
    
    <!-- Section des commandes -->
    <h2>Mes Commandes</h2>
    <div v-for="order in orders" :key="order.id" class="order-container">
      <div class="order-header">
        <div>
          <p>Commande effectuée le {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          <p>Total : {{ order.totalPrice }} €</p>
        </div>
        <div>
          <p>Livraison à {{ order.shippingAddress }}</p>
        </div>
      </div>
      <div class="order-items">
        <div v-for="item in order.products" :key="item.productId" class="order-item">
          <img :src="item.product.imageUrl" alt="product image" class="product-image" />
          <div class="product-details">
            <p>{{ item.product.title }}</p>
            <p>{{ item.quantity }} x {{ item.price }} €</p>
          </div>
        </div>
      </div>
      <div class="order-actions">
        <button @click="refundOrder(order.id)">Demander un remboursement</button>
        <button @click="reorder(item.productId)">Acheter à nouveau</button>
        <button @click="viewOrder(order.id)">Consulter la commande</button>
      </div>
    </div>
  </div>
</template>
