import { defineStore } from "pinia";
import { useFlashMessageStore } from "../composables/useFlashMessageStore";

export const useProductStore = defineStore("product", {
  state: () => ({
    product: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProduct(id) {
      this.loading = true;
      const apiUrl = import.meta.env.VITE_API_URL;
      this.error = null;
      try {
        const response = await fetch(`${apiUrl}/products/${id}?source=client`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.product = data;
        console.log(data);
      } catch (error) {
        this.error = "Failed to fetch product";
      } finally {
        this.loading = false;
      }
    },

    async followProduct(userId, productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${apiUrl}/follow/products/${productId}/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
          throw new Error("Failed to follow product");
        }
        useFlashMessageStore().setFlashMessage("Product followed successfully", "success");
      } catch (error) {
        console.error(error);
        useFlashMessageStore().setFlashMessage("Failed to follow product", "error");
      }
    },

    async unfollowProduct(userId, productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${apiUrl}/follow/products/${productId}/unfollow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
          throw new Error("Failed to unfollow product");
        }
        useFlashMessageStore().setFlashMessage("Product unfollowed successfully", "success");
      } catch (error) {
        console.error(error);
        useFlashMessageStore().setFlashMessage("Failed to unfollow product", "error");
      }
    },
  },
});
