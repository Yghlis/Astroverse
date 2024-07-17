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
    async syncCart() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/basket`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'session-id': localStorage.getItem('sessionId'),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error syncing cart:', errorText);
          return;
        }

        const data = await response.json();
        this.cartItems = data.items;
        localStorage.setItem('cartStore', JSON.stringify(this.$state));
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    },

    async addItemToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      const newQuantity = 1; // Toujours ajouter 1 au panier
      const price = this.getItemPrice(item);
      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        console.log('Checking stock for item:', item.id, 'Quantity:', newQuantity);

        const checkStockResponse = await fetch(`${apiUrl}/products/check-stock`, {
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
          const addBasketResponse = await fetch(`${apiUrl}/basket`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id })
          });

          if (!addBasketResponse.ok) {
            const errorText = await addBasketResponse.text();
            console.error('Error adding product to basket:', errorText);
            return;
          }

          console.log('Product added to basket successfully');

          // Si le produit a bien été ajouté au panier côté serveur, mettre à jour le panier localement
          if (existingItem) {
            existingItem.quantity++;
            console.log('Existing item quantity incremented:', existingItem.quantity);
          } else {
            this.cartItems.push({ ...item, price: price, quantity: 1 });
            console.log('New item added to cart:', { ...item, price: price, quantity: 1 });
          }
          localStorage.setItem('cartStore', JSON.stringify(this.$state));
        } else {
          console.error('Stock insuffisant:', checkStockData.message);
        }

        // Synchroniser le panier après chaque ajout
        await this.syncCart();
      } catch (error) {
        console.error('Error checking stock or adding to basket:', error);
      }
    },

    async decrementItemQuantity(itemId) {
      const item = this.cartItems.find(cartItem => cartItem.id === itemId);
      if (item) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;

          const decrementBasketResponse = await fetch(`${apiUrl}/basket/decrement`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id })
          });

          if (!decrementBasketResponse.ok) {
            const errorText = await decrementBasketResponse.text();
            console.error('Error decrementing product in basket:', errorText);
            return;
          }

          console.log('Product decremented in basket successfully');

          // Si la quantité est supérieure à 1, décrémenter simplement
          if (item.quantity > 1) {
            item.quantity--;
            console.log('Existing item quantity decremented:', item.quantity);
          } else {
            // Si la quantité atteint 0, retirer l'article du panier
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
            console.log('Item removed from cart:', item.id);
          }
          localStorage.setItem('cartStore', JSON.stringify(this.$state));

          // Synchroniser le panier après chaque décrémentation
          await this.syncCart();
        } catch (error) {
          console.error('Error decrementing from basket:', error);
        }
      }
    },

    async removeItemFromCart(itemId) {
      const item = this.cartItems.find(cartItem => cartItem.id === itemId);
      if (item) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;

          const removeItemResponse = await fetch(`${apiUrl}/basket/remove`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id })
          });

          if (!removeItemResponse.ok) {
            const errorText = await removeItemResponse.text();
            console.error('Error removing product from basket:', errorText);
            return;
          }

          console.log('Product removed from basket successfully');

          this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
          localStorage.setItem('cartStore', JSON.stringify(this.$state));

          // Synchroniser le panier après chaque suppression
          await this.syncCart();
        } catch (error) {
          console.error('Error removing from basket:', error);
        }
      }
    },

    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    }
  },
});
