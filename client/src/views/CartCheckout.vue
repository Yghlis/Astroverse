<template>
  <div class="checkout">
    <div class="checkout-content">
      <h2>Finalisation de la commande</h2>
      <form @submit.prevent="handleSubmit">
        <div class="address-section">
          <label for="address">Adresse de livraison</label>
          <input
            v-model="address"
            type="text"
            id="address"
            placeholder="Entrez votre adresse"
            required
          />
        </div>
        <div class="save-address">
          <input v-model="saveAddress" type="checkbox" id="saveAddress" />
          <label for="saveAddress"
            >Sauvegarder l'adresse pour de futurs achats</label
          >
          <label for="saveAddress"
            >si l'adress de facturation = adress livraison</label
          >
        </div>
        <div class="articles">
          <h3>Mes Articles</h3>
          <ShopCart
            :cartItems="cartItems"
            :removeItem="removeItem"
          />
          <span>Total: {{ cartTotal }}€</span>
        </div>
        <button type="submit">Passer au paiement</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cartStore';
import ShopCart from '../ui/ShopCart.vue';
import axios from 'axios';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);

const address = ref('');
const saveAddress = ref(false);

const handleSubmit = async () => {
  console.log('Adresse de livraison:', address.value);
  console.log('Sauvegarder l\'adresse:', saveAddress.value);

  try {
    const response = await axios.get(`http://localhost:8000/geocode`, {
      params: { address: address.value },
    });
    console.log('Geocoded data:', response.data);
    // Process the geocoded data as needed
  } catch (error) {
    console.error('Error fetching geocoded data:', error);
  }
};
</script>

<style scoped lang="scss">
.checkout {
  background-color: #ccc;
  &-content {
    padding: 20px;
    max-width: 700px;
    margin: 50px auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    h2 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .address-section {
        display: flex;
        flex-direction: column;

        label {
          margin-bottom: 8px;
          font-weight: bold;
          font-size: 20px;
        }

        input[type='text'] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }
      }

      .save-address {
        display: flex;
        align-items: center;
        gap: 10px;

        input[type='checkbox'] {
          width: 20px;
          height: 20px;
        }
      }

      .articles {
        display: flex;
        flex-direction: column;
        h3 {
          font-size: 20px;
          margin: 8px 0 0 0;
        }

        span {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          color: white;
          background-color: black;
          padding: 0.5rem 0.5rem;
          border-radius: 5px;
        }
      }

      button {
        padding: 10px;
        background-color: #41c902;
        color: #fff;
        border: none;
        width: 200px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          background-color: #55af00;
        }
      }
    }
  }
}
</style>
