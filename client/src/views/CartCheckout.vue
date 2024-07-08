<template>
  <div class="checkout">
    <div class="checkout-content">
      <h2>Finalisation de la commande</h2>
      <form @submit.prevent="">
        <div class="address-section">
          <label for="address">Adresse de livraison</label>
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
        <div class="save-address">
          <input
            v-model="saveAddressForLater"
            type="checkbox"
            id="saveAddressForLater"
          />
          <label for="saveAddressForLater"
            >Sauvegarder l'adresse pour de futurs achats</label
          >
        </div>
        <div class="save-address">
          <input
            v-model="sameAddressForPayment"
            type="checkbox"
            id="sameAddressForPayment"
          />
          <label for="sameAddressForPayment"
            >si l'adresse de facturation = adresse de livraison</label
          >
        </div>
        <div v-if="!sameAddressForPayment" class="payment-address">
          <label for="street">Rue</label>
          <input
            v-model="street"
            type="text"
            id="street"
            placeholder="Entrez votre rue"
            required
          />
          <label for="city">Ville</label>
          <input
            v-model="city"
            type="text"
            id="city"
            placeholder="Entrez votre ville"
            required
          />
          <label for="postal_code">Code Postal</label>
          <input
            v-model="postalCode"
            type="number"
            id="postal_code"
            placeholder="Entrez votre code postal"
            required
          />
        </div>
        <div class="articles">
          <h3>Mes Articles</h3>
          <ShopCart
            :cartItems="cartItems"
            :incrementItemQuantity="incrementItemQuantity"
            :decrementItemQuantity="decrementItemQuantity"
            :getItemPrice="getItemPrice"
            :removeItem="removeItem"
          />
          <span>Total: {{ cartTotal }}€ /HT</span>
          <span>TVA 20%</span>
          <span>Total: {{ cartTotal * 1.2 }}€ /TTC</span>
        </div>
        <button @click="handleSubmit">Passer au paiement</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useCartStore } from "../stores/cartStore";
import ShopCart from "../ui/ShopCart.vue";
import TheLoader from "../ui/TheLoader.vue";

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);
const incrementItemQuantity = (itemId) => {
  cartStore.incrementItemQuantity(itemId);
};
const decrementItemQuantity = (itemId) => {
  cartStore.decrementItemQuantity(itemId);
};
const getItemPrice = (item) => {
  return cartStore.getItemPrice(item);
};

const removeItem = (itemId) => {
  cartStore.removeItemFromCart(itemId);
};

const address = ref("");
const fullAddress = reactive({});
const saveAddressForLater = ref(false);
const sameAddressForPayment = ref(true);
const addressForPayment = reactive({});
const city = ref("");
const street = ref("");
const postalCode = ref("");
const suggestions = ref([]);
const loading = ref(false);
let debounceTimeout = null;

const fetchSuggestions = async (query) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  loading.value = true;
  try {
    const response = await fetch(
      `${apiUrl}/geocode?address=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    suggestions.value = data.results;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching geocoded data:", error);
    loading.value = false;
  }
};

const handleInput = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (address.value.trim()) {
      fetchSuggestions(address.value);
    }
  }, 300);
};

const selectSuggestion = (suggestion) => {
  address.value = suggestion.formatted;
  Object.assign(fullAddress, suggestion, {
    saveForLater: saveAddressForLater.value,
  });
  suggestions.value = [];
};

const handleSubmit = () => {
  if (sameAddressForPayment.value == true) {
    Object.assign(addressForPayment, fullAddress);
  } else {
    addressForPayment.city = city.value;
    addressForPayment.street = street.value;
    addressForPayment.postal_code = postalCode.value;
    addressForPayment.country = "France";
  }
  console.log("Adresse de livraison courte:", address.value);
  console.log("Adresse de livraison complète:", fullAddress);
  console.log("Sauvegarder l'adresse:", saveAddressForLater.value);
  console.log("Adresse de facturation:", addressForPayment);
  console.log("panier:", cartItems.value);
  console.log("TotalPrice avec tax:", cartTotal.value * 1.2);
  console.log("User From localStorage", localStorage.getItem("userId"));

  // Ajoutez ici la logique pour traiter l'adresse de livraison et la sauvegarde de l'adresse
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

        input[type="text"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        ul {
          margin-top: 10px;
          padding: 0;
          list-style: none;

          li {
            background: #fff;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 4px;
            cursor: pointer;
          }
        }
      }

      .save-address {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }

      .payment-address {
        display: flex;
        flex-direction: column;

        label {
          margin: 5px 0;
          font-weight: bold;
          font-size: 16px;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
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
