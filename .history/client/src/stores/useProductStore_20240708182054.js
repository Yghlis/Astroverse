import { defineStore } from "pinia";
import useFlashMessageStore from "../composables/useFlashMessageStore";

export const useProductStore = defineStore("product", {
  state: () => ({
    product: null,
    loading: false,
    error: null,
    isFavorite: false, // Ajouter l'état pour le favori
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
        // Vérifier si le produit est déjà en favori
        await this.checkIfFavorite(id);
        console.log(data);
      } catch (error) {
        this.error = "Failed to fetch product";
      } finally {
        this.loading = false;
      }
    },

    async followProduct(userId, productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      console.log("Token:", token);
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
        console.log("API response:", response);
        const responseData = await response.json();
        if (!response.ok) {
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to follow product");
        }
        useFlashMessageStore().setFlashMessage("Product followed successfully", "success");
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(error.message || "Failed to follow product", "error");
      }
    },

    async unfollowProduct(userId, productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
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
        console.log("API response:", response);
        const responseData = await response.json();
        if (!response.ok) {
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to unfollow product");
        }
        useFlashMessageStore().setFlashMessage("Product unfollowed successfully", "success");
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(error.message || "Failed to unfollow product", "error");
      }
    },

    async addFavorite(productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not present");
        useFlashMessageStore().setFlashMessage("Token not present", "error");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
        console.log("API response:", response);
        const responseData = await response.json();
        if (!response.ok) {
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to add favorite");
        }
        this.isFavorite = true;
        useFlashMessageStore().setFlashMessage("Product added to favorites", "success");
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(error.message || "Failed to add favorite", "error");
      }
    },

    async removeFavorite(productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not present");
        useFlashMessageStore().setFlashMessage("Token not present", "error");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/favorites/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log("API response:", response);
        if (!response.ok) {
          const responseData = await response.json();
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to remove favorite");
        }
        this.isFavorite = false;
        useFlashMessageStore().setFlashMessage("Product removed from favorites", "success");
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(error.message || "Failed to remove favorite", "error");
      }
    },

    async checkIfFavorite(productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not present");
        this.isFavorite = false;
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/favorites`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          this.isFavorite = data.some((favorite) => favorite.productId === productId);
        } else {
          console.error("Error checking favorites:", data);
          this.isFavorite = false;
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        this.isFavorite = false;
      }
    },
  },
});
