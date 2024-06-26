import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
  }),
  getters: {
    // Calculer le total des éléments dans le panier
    cartTotal: (state) => {
        return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      // Compter le nombre d'articles dans le panier
      cartItemCount: (state) => {
        return state.cartItems.reduce((count, item) => count + item.quantity, 0);
      },
  },
  actions: {
    addItemToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({ ...item, quantity: 1 });
      }
    },
    removeItemFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    },
    clearCart() {
      this.cartItems = [];
    },
  },
});
