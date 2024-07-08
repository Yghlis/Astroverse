import { defineStore } from "pinia";
import useFlashMessageStore from "../composables/useFlashMessageStore";

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
      const token = localStorage.getItem("jwt"); // Assurez-vous que le jeton JWT est stocké dans localStorage
      if (!token) {
        console.error("Token not present");
        useFlashMessageStore().setFlashMessage("Token not present", "error");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/follow/products/${productId}/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        console.log("API response:", response); // Log de la réponse de l'API
        if (!response.ok) {
          const errorMessage = await response.json();
          console.error("Error message from API:", errorMessage); // Log du message d'erreur de l'API
          throw new Error("Failed to follow product");
        }
        useFlashMessageStore().setFlashMessage("Product followed successfully", "success");
      } catch (error) {
        console.error("Fetch error:", error); // Log de l'erreur de la requête fetch
        useFlashMessageStore().setFlashMessage("Failed to follow product", "error");
      }
    },

    async unfollowProduct(userId, productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt"); // Assurez-vous que le jeton JWT est stocké dans localStorage
      if (!token) {
        console.error("Token not present");
        useFlashMessageStore().setFlashMessage("Token not present", "error");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/follow/products/${productId}/unfollow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        console.log("API response:", response); // Log de la réponse de l'API
        if (!response.ok) {
          const errorMessage = await response.json();
          console.error("Error message from API:", errorMessage); // Log du message d'erreur de l'API
          throw new Error("Failed to unfollow product");
        }
        useFlashMessageStore().setFlashMessage("Product unfollowed successfully", "success");
      } catch (error) {
        console.error("Fetch error:", error); // Log de l'erreur de la requête fetch
        useFlashMessageStore().setFlashMessage("Failed to unfollow product", "error");
      }
    },
  },
});
