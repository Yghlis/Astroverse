import { defineStore } from 'pinia';
import useFlashMessageStore from '../composables/useFlashMessageStore';

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
      const { setFlashMessage } = useFlashMessageStore();
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
          setFlashMessage("Produit ajouté au panier avec succès", "success");
        } else {
          setFlashMessage(`Désolé, seulement ${product.stock} articles en stock`, "error");
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setFlashMessage("Erreur lors de la récupération des détails du produit", "error");
      }
    },
    async incrementItemQuantity(itemId) {
      const { setFlashMessage } = useFlashMessageStore();
      try {
        const itemToIncrement = this.cartItems.find(item => item.id === itemId);
        if (itemToIncrement) {
          console.log('Fetching product details for item:', itemId);
          const response = await fetch(`http://localhost:8000/products/${itemId}`);
          console.log('Fetch response:', response);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const product = await response.json();
          console.log('Product details fetched:', product);

          if (product.stock >= itemToIncrement.quantity + 1) {
            itemToIncrement.quantity++;
            console.log('Item quantity incremented. Current cart items:', this.cartItems);
            setFlashMessage("Quantité de produit incrémentée", "success");
          } else {
            setFlashMessage(`Désolé, seulement ${product.stock} articles en stock`, "error");
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setFlashMessage("Erreur lors de la récupération des détails du produit", "error");
      }
    },
    decrementItemQuantity(itemId) {
      const { setFlashMessage } = useFlashMessageStore();
      const itemToDecrement = this.cartItems.find(item => item.id === itemId);
      if (itemToDecrement) {
        if (itemToDecrement.quantity > 1) {
          itemToDecrement.quantity--;
          setFlashMessage("Quantité de produit décrémentée", "success");
        } else {
          this.cartItems = this.cartItems.filter(item => item.id !== itemId);
          setFlashMessage("Produit retiré du panier", "success");
        }
      }
      console.log('Item quantity decremented. Current cart items:', this.cartItems);
    },
    addItemToCart(item, quantity) {
      const { setFlashMessage } = useFlashMessageStore();
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      const price = this.getItemPrice(item);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cartItems.push({ ...item, price: price, quantity: quantity });
      }
      console.log('Current cart items:', this.cartItems);
      setFlashMessage("Produit ajouté au panier avec succès", "success");
    },
    removeItemFromCart(itemId) {
      const { setFlashMessage } = useFlashMessageStore();
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      console.log('Item removed from cart. Current cart items:', this.cartItems);
      setFlashMessage("Produit retiré du panier", "success");
    },
    clearCart() {
      const { setFlashMessage } = useFlashMessageStore();
      this.cartItems = [];
      console.log('Cart cleared. Current cart items:', this.cartItems);
      setFlashMessage("Panier vidé", "success");
    },
    getItemPrice(item) {
      return item.is_promotion && item.discounted_price ? item.discounted_price : item.price;
    },
  },
});
