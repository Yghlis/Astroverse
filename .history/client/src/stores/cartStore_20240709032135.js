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
    async checkStockAndAddItem(item, quantity) {
      try {
        console.log('Fetching product details for item:', item.id);
        const response = await fetch(`http://localhost:8000/products/${item.id}`);
        console.log('Fetch response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const product = await response.json();
        console.log('Product details fetched:', product);

        if (product.stock >= quantity) {
          this.addItemToCart(item, quantity);
          console.log('Product added to cart:', item);
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
      console.log('Current cart items:', this.cartItems);
    },
    removeItemFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      console.log('Item removed from cart. Current cart items:', this.cartItems);
    },
    clearCart() {
      this.cartItems = [];
      console.log('Cart cleared. Current cart items:', this.cartItems);
    },
    incrementItemQuantity(itemId) {
      const itemToIncrement = this.cartItems.find(item => item.id === itemId);
      if (itemToIncrement) {
        itemToIncrement.quantity++;
      }
      console.log('Item quantity incremented. Current cart items:', this.cartItems);
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
      console.log('Item quantity decremented. Current cart items:', this.cartItems);
    },
    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    },
  },
});
