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
          // Vérifier si le panier existe déjà et si le produit est déjà présent
          const basketExistsResponse = await fetch('http://localhost:8000/basket/exists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id })
          });

          const basketExistsData = await basketExistsResponse.json();
          const method = basketExistsData.exists ? 'PUT' : 'POST';

          // Ajouter ou mettre à jour le produit dans le panier côté serveur
          const addBasketResponse = await fetch(`http://localhost:8000/basket`, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id, quantity: 1 })
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
    async incrementItemQuantity(itemId) {
      const itemToIncrement = this.cartItems.find(item => item.id === itemId);
      if (itemToIncrement) {
        try {
          // Vérifier le stock disponible via une requête fetch
          console.log('Checking stock for item:', itemId, 'Quantity:', itemToIncrement.quantity + 1);
          const checkStockResponse = await fetch('http://localhost:8000/products/check-stock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
            },
            body: JSON.stringify({ productId: itemId, quantity: itemToIncrement.quantity + 1 })
          });

          if (!checkStockResponse.ok) {
            const errorText = await checkStockResponse.text();
            console.error('Error checking stock:', errorText);
            return;
          }

          const checkStockData = await checkStockResponse.json();
          console.log('Parsed JSON response:', checkStockData);

          if (checkStockData.available) {
            // Mettre à jour le panier côté serveur
            const updateBasketResponse = await fetch('http://localhost:8000/basket', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'session-id': localStorage.getItem('sessionId'),
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
              },
              body: JSON.stringify({ productId: itemId, quantity: 1 })
            });

            if (!updateBasketResponse.ok) {
              const errorText = await updateBasketResponse.text();
              console.error('Error updating product in basket:', errorText);
              return;
            }

            // Si le produit a bien été mis à jour dans le panier côté serveur, mettre à jour le panier localement
            itemToIncrement.quantity++;
            // Sauvegarder l'état du panier dans le localStorage
            localStorage.setItem('cartStore', JSON.stringify(this.$state));
          } else {
            console.error('Stock insuffisant:', checkStockData.message);
          }
        } catch (error) {
          console.error('Error checking stock or updating basket:', error);
        }
      }
    },
    async decrementItemQuantity(itemId) {
      const itemToDecrement = this.cartItems.find(item => item.id === itemId);
      if (itemToDecrement) {
        try {
          // Mettre à jour le panier côté serveur pour décrémenter l'article
          const updateBasketResponse = await fetch('http://localhost:8000/basket', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: itemId, quantity: -1 })
          });

          if (!updateBasketResponse.ok) {
            const errorText = await updateBasketResponse.text();
            console.error('Error decrementing product in basket:', errorText);
            return;
          }

          // Si le produit a bien été décrémenté du panier côté serveur, mettre à jour le panier localement
          if (itemToDecrement.quantity > 1) {
            itemToDecrement.quantity--;
          } else {
            this.cartItems = this.cartItems.filter(item => item.id !== itemId);
          }
          // Sauvegarder l'état du panier dans le localStorage
          localStorage.setItem('cartStore', JSON.stringify(this.$state));
        } catch (error) {
          console.error('Error decrementing item quantity or updating basket:', error);
        }
      }
    },
    async removeItemFromCart(itemId) {
      const itemToRemove = this.cartItems.find(item => item.id === itemId);
      if (itemToRemove) {
        try {
          // Mettre à jour le panier côté serveur pour supprimer l'article
          const removeBasketResponse = await fetch('http://localhost:8000/basket', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: itemId })
          });

          if (!removeBasketResponse.ok) {
            const errorText = await removeBasketResponse.text();
            console.error('Error removing product from basket:', errorText);
            return;
          }

          // Si le produit a bien été supprimé du panier côté serveur, mettre à jour le panier localement
          this.cartItems = this.cartItems.filter(item => item.id !== itemId);
          // Sauvegarder l'état du panier dans le localStorage
          localStorage.setItem('cartStore', JSON.stringify(this.$state));
        } catch (error) {
          console.error('Error removing item from basket:', error);
        }
      }
    },
    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    },
  },
});
