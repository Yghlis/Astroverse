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
        // Vérifier le stock disponible via une requête fetch
        console.log('Checking stock for item:', item.id, 'Quantity:', existingItem ? existingItem.quantity + 1 : newQuantity);
        const checkStockResponse = await fetch('http://localhost:8000/products/check-stock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'session-id': localStorage.getItem('sessionId'),
          },
          body: JSON.stringify({ productId: item.id, quantity: existingItem ? existingItem.quantity + 1 : newQuantity })
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
          const addBasketResponse = await fetch('http://localhost:8000/basket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: item.id, quantity: newQuantity }) // ici, on ajoute juste 1 au panier
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
    }
    

    async incrementItemQuantity(itemId) {
      const itemToIncrement = this.cartItems.find(item => item.id === itemId);
      if (itemToIncrement) {
        try {
          console.log('Checking stock for item:', itemId, 'Quantity:', 1);
          const checkStockResponse = await fetch('http://localhost:8000/products/check-stock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
            },
            body: JSON.stringify({ productId: itemId, quantity: 1 })
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
              body: JSON.stringify({ productId: itemId, quantity: 1 })
            });

            if (!addBasketResponse.ok) {
              const errorText = await addBasketResponse.text();
              console.error('Error adding product to basket:', errorText);
              return;
            }

            itemToIncrement.quantity++;
            localStorage.setItem('cartStore', JSON.stringify(this.$state));
          } else {
            console.error('Stock insuffisant:', checkStockData.message);
          }
        } catch (error) {
          console.error('Error checking stock or adding to basket:', error);
        }
      }
    },

    async decrementItemQuantity(itemId) {
      const itemToDecrement = this.cartItems.find(item => item.id === itemId);
      if (itemToDecrement) {
        try {
          const removeBasketResponse = await fetch('http://localhost:8000/basket', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: itemId, quantity: 1 })
          });

          if (!removeBasketResponse.ok) {
            const errorText = await removeBasketResponse.text();
            console.error('Error decrementing product in basket:', errorText);
            return;
          }

          if (itemToDecrement.quantity > 1) {
            itemToDecrement.quantity--;
          } else {
            this.cartItems = this.cartItems.filter(item => item.id !== itemId);
          }
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
          const removeBasketResponse = await fetch('http://localhost:8000/basket', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'session-id': localStorage.getItem('sessionId'),
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({ productId: itemId, quantity: itemToRemove.quantity })
          });

          if (!removeBasketResponse.ok) {
            const errorText = await removeBasketResponse.text();
            console.error('Error removing product from basket:', errorText);
            return;
          }

          this.cartItems = this.cartItems.filter(item => item.id !== itemId);
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
