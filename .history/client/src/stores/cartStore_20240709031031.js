import { defineStore } from 'pinia';
import axios from 'axios';

export const useCartStore = defineStore('cart', {
  state: () => {
    const savedState = localStorage.getItem('cartStore');
    return savedState ? JSON.parse(savedState) : {
      cartItems: [],
    };
  },
  getters: {
    cartTotal: (state) => {
      return state.cartItems.reduce((total, item) => total + (item.is_promotion && item.discounted_price ? item.discounted_price : item.price) * item.quantity, 0);
    },
    cartItemCount: (state) => {
      return state.cartItems.reduce((count, item) => count + item.quantity, 0);
    },
  },
  actions: {
    async checkStockAndAddItem(item, quantity) {
      try {
        // Fetch the product details from the backend
        const response = await axios.get(`/api/products/${item.id}`);
        const product = response.data;

        if (product.stock >= quantity) {
          this.addItemToCart(item, quantity);
        } else {
          alert(`Sorry, only ${product.stock} items in stock`);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    addItemToCart(item, quantity) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      const price = this.getItemPrice(item);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cartItems.push({ ...item, price: price, quantity: quantity });
      }
    },
    removeItemFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    },
    clearCart() {
      this.cartItems = [];
    },
    incrementItemQuantity(itemId) {
      const itemToIncrement = this.cartItems.find(item => item.id === itemId);
      if (itemToIncrement) {
        itemToIncrement.quantity++;
      }
    },
    decrementItemQuantity(itemId) {
      const itemToDecrement = this.cartItems.find(item => item.id === itemId);
      if (itemToDecrement) {
        if (itemToDecrement.quantity > 1) {
          itemToDecrement.quantity--;
        } else {
          this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        }
      }
    },
    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    },
  },
});
