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
    <input v-model="orderSearchQuery" placeholder="Rechercher une commande..." />
    <div v-for="order in filteredOrders" :key="order.id" class="order-container">
      <div class="order-header">
        <div>
          <p>Commande effectuée le {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          <p>Numéro de commande: {{ order.id }}</p>
          <p>Livraison à {{ order.shippingAddress }}</p>
        </div>
        <div>
          <p>Status de la commande: {{ order.status }}</p>
        </div>
      </div>
      <div class="order-items">
        <div v-for="item in order.products" :key="item.productId" class="order-item">
          <img :src="getImageUrl(item.image_preview)" alt="product image" class="product-image" />
          <div class="product-details">
            <p>{{ item.title }}</p>
            <p>{{ item.quantity }} x {{ item.price }} €</p>
          </div>
        </div>
      </div>
      <p class="order-total">Total : {{ order.totalPrice }} €</p>
      <div class="order-actions">
        <button :disabled="order.status !== 'Livrée'" @click="refundOrder(order.id)">Demander un remboursement</button>
        <button @click="reorder(order.products)">Acheter à nouveau</button>
        <button @click="downloadInvoice(order)">Télécharger la facture</button>
      </div>
    </div>
  </div>
</template>
