import { defineStore } from 'pinia';

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
    async addItemToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      const newQuantity = 1; // Toujours ajouter 1 à la fois
      const price = this.getItemPrice(item);

      try {
        console.log('Checking stock for item:', item.id, 'Quantity:', newQuantity);
        const checkStockResponse = await fetch('http://localhost:8000/products/check-stock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'session-id': localStorage.getItem('sessionId'),
          },
          body: JSON.stringify({ productId: item.id, quantity: newQuantity })
        });

        if (!checkStockResponse.ok) {
          const errorText = await checkStockResponse.text();
          console.error('Error checking stock:', errorText);
          return;
        }

        const checkStockData = await checkStockResponse.json();
        console.log('Parsed JSON response:', checkStockData);

        if (checkStockData.available) {
          const addBasketResponse = await fetch('http://localhost:8000/basket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id, quantity: newQuantity })
          });

          if (!addBasketResponse.ok) {
            const errorText = await addBasketResponse.text();
            console.error('Error adding product to basket:', errorText);
            return;
          }

          if (existingItem) {
            existingItem.quantity += newQuantity;
          } else {
            this.cartItems.push({ ...item, price: price, quantity: newQuantity });
          }
          localStorage.setItem('cartStore', JSON.stringify(this.$state));
        } else {
          console.error('Stock insuffisant:', checkStockData.message);
        }
      } catch (error) {
        console.error('Error checking stock or adding to basket:', error);
      }
    },
    removeItemFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      localStorage.setItem('cartStore', JSON.stringify(this.$state));
    },
    clearCart() {
      this.cartItems = [];
      localStorage.setItem('cartStore', JSON.stringify(this.$state));
    },
    incrementItemQuantity(itemId) {
      const itemToIncrement = this.cartItems.find(item => item.id === itemId);
      if (itemToIncrement) {
        itemToIncrement.quantity++;
        localStorage.setItem('cartStore', JSON.stringify(this.$state));
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
        localStorage.setItem('cartStore', JSON.stringify(this.$state));
      }
    },
    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    },
  },
});
