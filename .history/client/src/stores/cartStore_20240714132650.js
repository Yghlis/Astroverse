import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => {
    // Charger l'état initial à partir du localStorage, s'il existe
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
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      const price = this.getItemPrice(item);

      try {
        // Vérifier le stock disponible via une requête fetch
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
          // Stock suffisant, ajouter ou mettre à jour l'élément dans le panier côté serveur
          const addBasketResponse = await fetch('http://localhost:8000/basket/add', {
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

          // Si le produit a bien été ajouté au panier côté serveur, mettre à jour le panier localement
          if (existingItem) {
            existingItem.quantity++;
          } else {
            this.cartItems.push({ ...item, price: price, quantity: 1 });
          }
          // Sauvegarder l'état du panier dans le localStorage
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
      // Sauvegarder l'état du panier dans le localStorage
      localStorage.setItem('cartStore', JSON.stringify(this.$state));
    },
    clearCart() {
      this.cartItems = [];
      // Sauvegarder l'état du panier dans le localStorage
      localStorage.setItem('cartStore', JSON.stringify(this.$state));
    },
    incrementItemQuantity(itemId) {
      const itemToIncrement = this.cartItems.find(item => item.id === itemId);
      if (itemToIncrement) {
        itemToIncrement.quantity++;
        // Sauvegarder l'état du panier dans le localStorage
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
        // Sauvegarder l'état du panier dans le localStorage
        localStorage.setItem('cartStore', JSON.stringify(this.$state));
      }
    },
    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    },
  },
});
