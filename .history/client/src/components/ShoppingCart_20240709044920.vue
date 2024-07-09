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
    <RouterLink @click="toggle" to="/cart-checkout" class="call-to-action">
      Passer votre Commande
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "../stores/cartStore";
import ShopCart from '../ui/ShopCart.vue';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);
const incrementItemQuantity = async (itemId) => {
  await cartStore.incrementItemQuantity(itemId);
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

console.log('Cart items in ShoppingCart:', cartItems.value);
console.log('Cart total:', cartTotal.value);
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
