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
    {{ cartItems }}
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
import ShopCart from '../ui/ShopCart.vue';

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

// Définir les événements
const emit = defineEmits(["update:hideCartSideBar"]);

// Fonction pour émettre l'événement
const toggle = () => {
  emit("update:hideCartSideBar", false);
};

// Fonction pour gérer le passage à la caisse
const handleCheckout = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${apiUrl}/basket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'session-id': localStorage.getItem('sessionId'),
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
      alert('Votre panier est vide');
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
