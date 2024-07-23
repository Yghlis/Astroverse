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

        this.cartItems = data.items.map(item => {
          const product = item.product || item;
          return {
            productId: product.productId || product.id || product._id, // Assurez-vous que chaque article a un identifiant unique
            title: product.title || 'Unknown title', // Assurez-vous que chaque article a un titre
            price: product.price || 0, // Assurez-vous que chaque article a un prix
            image_gallery: product.image_gallery || [], // Assurez-vous que chaque article a une galerie d'images
            discounted_price: product.discounted_price || 0, // Ajout de discounted_price
            is_promotion: product.is_promotion || false, // Ajout de is_promotion
            quantity: item.quantity || 1 // Assurez-vous que la quantité est définie
          };
        });
        console.log('Processed cartItems:', this.cartItems);
        localStorage.setItem('cartStore', JSON.stringify(this.$state));
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    },

    async addItemToCart(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.productId === item.id);
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
            const newItem = {
              productId: item.id,
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
        item.quantity++;
        localStorage.setItem('cartStore', JSON.stringify(this.$state));
        console.log('Existing item quantity incremented:', item.quantity);
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
          const apiUrl = import.meta.env.VITE_API_URL;

          const removeItemResponse = await fetch(`${apiUrl}/basket/remove`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.productId })
          });

          if (!removeItemResponse.ok) {
            const errorText = await removeItemResponse.text();
            console.error('Error removing product from basket:', errorText);
            return;
          }

          console.log('Product removed from basket successfully');

          this.cartItems = this.cartItems.filter(cartItem => cartItem.productId !== item.productId);
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

// Log initial du state du store
console.log("Initial state:", JSON.parse(localStorage.getItem('cartStore')));
