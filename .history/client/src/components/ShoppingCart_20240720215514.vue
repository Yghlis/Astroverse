<template>
  <div>
    <h2>Mon Panier</h2>
    <ShopCart
      :cartItems="cartItems"
      :incrementItemQuantity="incrementItemQuantity"
      :decrementItemQuantity="decrementItemQuantity"
      :getItemPrice="getItemPrice"
      :removeItem="removeItem"
    />
    <p>Total: {{ cartTotal }}€</p>
    <button @click="handleCheckout" class="call-to-action">
      Passer votre Commande
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router';
import { useCartStore } from "../stores/cartStore";
import useFlashMessageStore from "@composables/useFlashMessageStore";
import ShopCart from '../ui/ShopCart.vue';

const cartStore = useCartStore();
const router = useRouter();
const { setFlashMessage } = useFlashMessageStore(); // Utilisation du store des messages flash

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);
const incrementItemQuantity = async (itemId) => {
  const item = cartItems.value.find(cartItem => cartItem.productId === itemId);
  if (item) {
    await cartStore.addItemToCart(item, true); // Passez true pour indiquer que c'est une incrémentation
  }
};
const decrementItemQuantity = (itemId) => {
  cartStore.decrementItemQuantity(itemId);
};
const getItemPrice = (item) => {
  return cartStore.getItemPrice(item);
};

const removeItem = async (itemId) => {
  
    cartStore.removeItemFromCart(itemId);
  
};

// Définir les événements
const emit = defineEmits(["update:hideCartSideBar"]);

// Fonction pour émettre l'événement
const toggle = () => {
  emit("update:hideCartSideBar", false);
};

// Fonction pour gérer le passage à la caisse
const handleCheckout = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // Vérifier si l'utilisateur est connecté
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    setFlashMessage('Vous devez être connecté pour passer votre commande.', 'error');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/basket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'session-id': localStorage.getItem('sessionId'),
        'Authorization': `Bearer ${jwt}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching cart:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Basket items:', data.items);

    if (data.items.length === 0) {
      setFlashMessage('Votre panier est vide', 'error');
    } else {
      toggle();
      router.push('/cart-checkout');
    }
  } catch (error) {
    console.error('Error checking cart:', error);
  }
};
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0;
}

.call-to-action {
  background-color: #41c902;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover {
    background-color: #55af00;
  }
}
</style>
