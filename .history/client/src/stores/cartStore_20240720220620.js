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
        console.log('Data from server:', data);

        // Extract the IDs from the server data
        const serverIds = new Set(data.items.map(item => item.productId || item.id || item._id));

        // Filter out items from cartItems that are not in serverIds
        this.cartItems = this.cartItems.filter(cartItem => serverIds.has(cartItem.productId || cartItem.id || cartItem._id));

        console.log('Filtered cartItems:', this.cartItems);

        // Optionally, save the updated cartItems to localStorage
        localStorage.setItem('cartStore', JSON.stringify(this.cartItems));
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    },

    async addItemToCart(item, isIncrement = false) {
      const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.id || cartItem.productId === item.productId);
      const newQuantity = isIncrement ? item.quantity + 1 : 1; // Ajouter 1 au panier ou incrémenter
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
          body: JSON.stringify({ productId: item.id || item.productId, quantity: newQuantity })
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
            body: JSON.stringify({ productId: item.id || item.productId })
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
            const newItem = {
              productId: item.id || item.productId,
              price: price,
              quantity: 1,
              title: item.title || 'Unknown title',
              image_gallery: item.image_gallery || [],
              discounted_price: item.discounted_price || 0,
              is_promotion: item.is_promotion || false,
            };
            this.cartItems.push(newItem);
            console.log('New item added to cart:', newItem);
          }
          console.log('Cart items:', this.cartItems);
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

    async incrementItemQuantity(productId) {
      const item = this.cartItems.find(cartItem => cartItem.productId === productId);
      if (item) {
        await this.addItemToCart(item, true); // Passez true pour indiquer que c'est une incrémentation
      }
    },

    async decrementItemQuantity(productId) {
      const item = this.cartItems.find(cartItem => cartItem.productId === productId);
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
            body: JSON.stringify({ productId: item.productId })
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
            this.cartItems = this.cartItems.filter(cartItem => cartItem.productId !== item.productId);
            console.log('Item removed from cart:', item.productId);
          }
          localStorage.setItem('cartStore', JSON.stringify(this.$state));

          // Synchroniser le panier après chaque décrémentation
          await this.syncCart();
        } catch (error) {
          console.error('Error decrementing from basket:', error);
        }
      }
    },

    async removeItemFromCart(productId) {
      
      const item = this.cartItems.find(cartItem => cartItem.productId === productId);
      if (item) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/basket`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: productId })
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error removing item:', errorText);
           
            return;
          }
          this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
          localStorage.setItem('cartStore', JSON.stringify(this.$state));
        } catch (error) {
          console.error('Error removing item:', error);
         
        }
      }
    },

    clearCart() {
      this.cartItems = [];
      localStorage.removeItem('cartStore');
    },

    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    }
  },
});

// Log initial du state du store
console.log("Initial state:", JSON.parse(localStorage.getItem('cartStore')));
