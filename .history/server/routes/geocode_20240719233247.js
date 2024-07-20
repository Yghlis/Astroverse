<template>
  <div class="checkout">
    <div class="checkout-content">
      <h2>Finalisation de la commande</h2>
      <form @submit.prevent="handleSubmit">
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
        <div>
          <label for="payment-element">Détails de paiement</label>
          <div id="payment-element">
            <!-- Stripe Payment Element will be inserted here. -->
          </div>
          <div id="payment-errors" role="alert"></div>
        </div>
        <button type="submit" class="call-to-action">
          Rentrer ma cb
        </button>
        <button type="button" class="call-to-action" @click="handlePayment">
          Payer
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import ShopCart from '../ui/ShopCart.vue';
import TheLoader from '../ui/TheLoader.vue';
import { loadStripe } from '@stripe/stripe-js';
import jwtDecode from 'jwt-decode';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cartStore = useCartStore();
const router = useRouter();

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

const address = ref('');
const fullAddress = reactive({});
const saveAddressForLater = ref(false);
const sameAddressForPayment = ref(true);
const addressForPayment = reactive({});
const city = ref('');
const street = ref('');
const postalCode = ref('');
const suggestions = ref([]);
const loading = ref(false);
let debounceTimeout = null;

const fetchSuggestions = async (query) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  loading.value = true;
  try {
    const response = await fetch(`${apiUrl}/geocode?address=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    suggestions.value = data.results;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching geocoded data:', error);
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

const fetchUserAddress = async () => {
  const jwt = localStorage.getItem('jwt');
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!jwt) {
    console.error('No JWT found');
    return;
  }

  let userId;
  try {
    const decodedJwt = jwtDecode(jwt);
    userId = decodedJwt.userId;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user address');
    }

    const data = await response.json();
    if (data.address) {
      address.value = `${data.address.street}, ${data.address.city}, ${data.address.postal_code}, ${data.address.country}`;
      fullAddress.street = data.address.street;
      fullAddress.city = data.address.city;
      fullAddress.postal_code = data.address.postal_code;
      fullAddress.country = data.address.country;

      // Trigger fetching suggestions for pre-filled address
      fetchSuggestions(address.value);
    }
  } catch (error) {
    console.error('Error fetching user address:', error);
  }
};

let stripe, elements, paymentElement;

onMounted(async () => {
  stripe = await stripePromise;
  await fetchUserAddress(); // Fetch user address on mount
});

const updateUserAddress = async (address) => {
  const jwt = localStorage.getItem('jwt');
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!jwt) {
    console.error('No JWT found');
    return;
  }

  let userId;
  try {
    const decodedJwt = jwtDecode(jwt);
    userId = decodedJwt.userId; // Assurez-vous que l'ID utilisateur est correctement décodé
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return;
  }

  // Extraire les informations pertinentes
  const simplifiedAddress = {
    city: address.city,
    street: `${address.housenumber || ''} ${address.street || ''}`.trim(),
    country: address.country || address.country_code,
    postal_code: address.postal_code || address.postcode,
  };

  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ address: simplifiedAddress }),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    const data = await response.json();
    console.log('User address updated successfully:', data);
  } catch (error) {
    console.error('Error updating user address:', error);
  }
};

const handleSubmit = async () => {
  if (!stripe) {
    console.error('Stripe.js n\'a pas été initialisé');
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL;

  // Vérifier si l'utilisateur est connecté
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    alert('Veuillez vous connecter');
    return;
  }

  // Vérifier si le panier contient des produits
  try {
    const response = await fetch(`${apiUrl}/basket/check-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'session-id': localStorage.getItem('sessionId'),
        'Authorization': `Bearer ${jwt}`,
      },
    });

    const data = await response.json();
    if (!data.hasItems) {
      alert('Votre panier est vide');
      return;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du panier:', error);
    alert('Erreur lors de la vérification du panier');
    return;
  }

  if (sameAddressForPayment.value) {
    Object.assign(addressForPayment, fullAddress);
  } else {
    addressForPayment.city = city.value;
    addressForPayment.street = street.value;
    addressForPayment.postal_code = postalCode.value;
    addressForPayment.country = 'France';
  }

  if (saveAddressForLater.value) {
    await updateUserAddress(addressForPayment);
  }

  try {
    // Créer une commande
    const orderResponse = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session-id': localStorage.getItem('sessionId'),
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        shippingAddress: fullAddress.formatted,
        billingAddress: sameAddressForPayment.value
          ? fullAddress.formatted
          : `${street.value}, ${city.value}, ${postalCode.value}, France`,
      }),
    });

    const orderData = await orderResponse.json();

    if (orderResponse.ok) {
      console.log('Order created:', orderData);

      // Initialiser Stripe Elements après la création de la commande
      const clientSecret = orderData.clientSecret;
      elements = stripe.elements({ clientSecret });
      paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
    } else {
      console.error('Erreur lors de la création de la commande:', orderData);
      alert(`Erreur lors de la création de la commande: ${orderData.message}`);
    }
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    alert('Erreur lors de la création de la commande');
  }
};

const handlePayment = async () => {
  if (!stripe || !elements) {
    console.error('Stripe.js n\'a pas été initialisé');
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const jwt = localStorage.getItem('jwt');

  try {
    // Créer le paiement Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
      },
    });

    if (error) {
      console.error('Échec du paiement:', error);
      alert('Échec du paiement. Veuillez réessayer.');
      // Supprimer la commande si le paiement échoue
      await fetch(`${apiUrl}/orders/${orderData.orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
    } else {
      alert('Commande créée avec succès');
      router.push('/confirmation'); // Redirigez vers une page de confirmation si nécessaire
    }
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    alert('Erreur lors de la création du paiement');
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
            transition: all 0.3s ease;
            &:hover {
              background-color: #e7e7e7;
            }
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
