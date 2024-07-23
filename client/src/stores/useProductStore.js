import { defineStore } from "pinia";
import useFlashMessageStore from "../composables/useFlashMessageStore";

export const useProductStore = defineStore("product", {
  state: () => ({
    product: null,
    loading: false,
    error: null,
    isFavorite: false,
    isFollowing: false,
    followedProducts: {},
    favoriteProducts: {},
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
        

       
        await this.checkIfFavorite(id);
        await this.checkIfFollow(id);
      } catch (error) {
        this.error = "Failed to fetch product";
      } finally {
        this.loading = false;
      }
    },

    async followProduct(userId, productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
     
      if (!token) {
        console.error("Token not present");
        useFlashMessageStore().setFlashMessage("Token not present", "error");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/products/${productId}/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to follow product");
        }
        this.isFollowing = true;
        useFlashMessageStore().setFlashMessage(
          "Product followed successfully",
          "success"
        );
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(
          error.message || "Failed to follow product",
          "error"
        );
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
        const response = await fetch(`${apiUrl}/products/${productId}/follow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
       
        const responseData = await response.json();
        if (!response.ok) {
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to unfollow product");
        }
        this.isFollowing = false;
        useFlashMessageStore().setFlashMessage(
          "Product unfollowed successfully",
          "success"
        );
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(
          error.message || "Failed to unfollow product",
          "error"
        );
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
        
        const responseData = await response.json();
        if (!response.ok) {
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to add favorite");
        }
        this.isFavorite = true;
        useFlashMessageStore().setFlashMessage(
          "Product added to favorites",
          "success"
        );
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(
          error.message || "Failed to add favorite",
          "error"
        );
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
            Authorization: `Bearer ${token}`,
          },
        });
       
        if (!response.ok) {
          const responseData = await response.json();
          console.error("Error message from API:", responseData);
          throw new Error(responseData.error || "Failed to remove favorite");
        }
        this.isFavorite = false;
        useFlashMessageStore().setFlashMessage(
          "Product removed from favorites",
          "success"
        );
      } catch (error) {
        console.error("Fetch error:", error.message);
        useFlashMessageStore().setFlashMessage(
          error.message || "Failed to remove favorite",
          "error"
        );
      }
    },

    async checkIfFavorite(productId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not present");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const favorites = await response.json();
        this.isFavorite = favorites.some((fav) => fav.productId === productId);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    },

    async getFollowedProducts(userId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not present");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/products/${userId}/followed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const followedProducts = await response.json();
        
        this.followedProducts = followedProducts;
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    },

    async getFavoriteProducts() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not present");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const favorites = await response.json();
        this.favoriteProducts = favorites;
        
        return favorites;
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    },

    async checkIfFollow(productId) {
      const userId = localStorage.getItem("userId");
      await this.getFollowedProducts(userId);
      

      this.isFollowing = false; 
      for (const product of this.followedProducts) {
        
        if (product.productId === productId) {
          this.isFollowing = true;
          break; 
        }
      }

      
    },
  },
});
