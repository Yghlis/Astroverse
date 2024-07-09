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
    <RouterLink @click.prevent="proceedToCheckout" to="/cart-checkout" class="call-to-action">
      Passer votre Commande
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import useFlashMessageStore from '../composables/useFlashMessageStore';
import ShopCart from '../ui/ShopCart.vue';

const cartStore = useCartStore();
const { setFlashMessage } = useFlashMessageStore();
const router = useRouter();

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

// Vérification de l'authentification avant la redirection
const proceedToCheckout = async (event) => {
  event.preventDefault(); // Empêche le comportement par défaut du lien

  const token = localStorage.getItem('token');
  if (!token) {
    setFlashMessage('Vous devez être connecté pour passer votre commande', 'error');
    router.push('/login'); // Redirigez vers la page de login si l'utilisateur n'est pas connecté
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/auth/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      toggle(); // Cache le side-bar avant de rediriger
      router.push('/cart-checkout');
    } else {
      setFlashMessage('Session expirée ou utilisateur invalide. Veuillez vous reconnecter.', 'error');
      router.push('/login');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    setFlashMessage('Erreur lors de la vérification de votre session. Veuillez vous reconnecter.', 'error');
    router.push('/login');
  }
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
