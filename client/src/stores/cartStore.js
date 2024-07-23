import { defineStore } from "pinia";
import useFlashMessageStore from "../composables/useFlashMessageStore";

export const useCartStore = defineStore("cart", {
  state: () => {
    const savedState = localStorage.getItem("cartStore");
    return savedState
      ? JSON.parse(savedState)
      : {
          cartItems: [],
        };
  },
  getters: {
    cartTotal: (state) => {
      return state.cartItems.reduce(
        (total, item) =>
          total +
          (item.is_promotion && item.discounted_price
            ? item.discounted_price
            : item.price) *
            item.quantity,
        0
      );
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
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "session-id": localStorage.getItem("sessionId"),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error syncing cart:", errorText);
          return;
        }

        const data = await response.json();

        const serverIds = new Set(
          data.items.map((item) => item.productId || item.id || item._id)
        );

        this.cartItems = this.cartItems.filter((cartItem) =>
          serverIds.has(cartItem.productId || cartItem.id || cartItem._id)
        );

        localStorage.setItem("cartStore", JSON.stringify(this.cartItems));
      } catch (error) {
        console.error("Error syncing cart:", error);
      }
    },

    async addItemToCart(item, isIncrement = false) {
      const existingItem = this.cartItems.find(
        (cartItem) =>
          cartItem.productId === item.id ||
          cartItem.productId === item.productId
      );
      const newQuantity = isIncrement ? item.quantity + 1 : 1;
      const price = this.getItemPrice(item);
      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        const checkStockResponse = await fetch(
          `${apiUrl}/products/check-stock`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "session-id": localStorage.getItem("sessionId"),
            },
            body: JSON.stringify({
              productId: item.id || item.productId,
              quantity: newQuantity,
            }),
          }
        );

        if (!checkStockResponse.ok) {
          const errorText = await checkStockResponse.text();
          console.error("Error checking stock:", errorText);
          return;
        }

        const checkStockData = await checkStockResponse.json();

        if (checkStockData.available) {
          const addBasketResponse = await fetch(`${apiUrl}/basket`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "session-id": localStorage.getItem("sessionId"),
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({ productId: item.id || item.productId }),
          });

          if (!addBasketResponse.ok) {
            const errorText = await addBasketResponse.text();
            console.error("Error adding product to basket:", errorText);
            return;
          }

          if (existingItem) {
            existingItem.quantity++;

          } else {
            const newItem = {
              productId: item.id || item.productId,
              price: price,
              quantity: 1,
              title: item.title || "Unknown title",
              image_gallery: item.image_gallery || [],
              discounted_price: item.discounted_price || 0,
              is_promotion: item.is_promotion || false,
            };
            this.cartItems.push(newItem);
          }

          localStorage.setItem("cartStore", JSON.stringify(this.$state));
        } else {
          console.error("Stock insuffisant:", checkStockData.message);
        }

        await this.syncCart();
      } catch (error) {
        console.error("Error checking stock or adding to basket:", error);
      }
    },

    async incrementItemQuantity(productId) {
      const item = this.cartItems.find(
        (cartItem) => cartItem.productId === productId
      );
      if (item) {
        await this.addItemToCart(item, true);
      }
    },

    async decrementItemQuantity(productId) {
      const item = this.cartItems.find(
        (cartItem) => cartItem.productId === productId
      );
      if (item) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;

          const decrementBasketResponse = await fetch(
            `${apiUrl}/basket/decrement`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "session-id": localStorage.getItem("sessionId"),
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({ productId: item.productId }),
            }
          );

          if (!decrementBasketResponse.ok) {
            const errorText = await decrementBasketResponse.text();
            console.error("Error decrementing product in basket:", errorText);
            return;
          }

          if (item.quantity > 1) {
            item.quantity--;
          } else {
            this.cartItems = this.cartItems.filter(
              (cartItem) => cartItem.productId !== item.productId
            );
          }
          localStorage.setItem("cartStore", JSON.stringify(this.$state));

          await this.syncCart();
        } catch (error) {
          console.error("Error decrementing from basket:", error);
        }
      }
    },

    async removeItemFromCart(productId) {
      const { setFlashMessage } = useFlashMessageStore();
      const item = this.cartItems.find(
        (cartItem) => cartItem.productId === productId
      );
      if (item) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/basket`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "session-id": localStorage.getItem("sessionId"),
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({ productId: productId }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error removing item:", errorText);
            setFlashMessage(
              "Une erreur s'est produite lors de la suppression de l'article du panier",
              "error"
            );
            return;
          }
          this.cartItems = this.cartItems.filter(
            (cartItem) => cartItem.productId !== item.productId
          );
          localStorage.setItem("cartStore", JSON.stringify(this.$state));
          setFlashMessage("Le produit a été retiré du panier", "success");
          return "Le produit a été retiré du panier";
        } catch (error) {
          console.error("Error removing item:", error);
          setFlashMessage(
            "Une erreur s'est produite lors de la suppression de l'article du panier",
            "error"
          );
        }
      }
    },

    clearCart() {
      this.cartItems = [];
      localStorage.removeItem("cartStore");
    },

    getItemPrice(item) {
      return item.is_promotion && item.discounted_price
        ? item.discounted_price
        : item.price;
    },
  },
});
