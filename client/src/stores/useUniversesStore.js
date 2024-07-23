import { defineStore } from "pinia";

export const useUniversesStore = defineStore("universe", {
  state: () => ({
    universes: [],
    followedUniverses: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUniverses() {
      this.loading = true;
      this.error = null;
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/universes`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.universes = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async followUniverse(universeId) {
      const userId = localStorage.getItem("userId");

      if (this.followedUniverses.includes(universeId)) {
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${apiUrl}/universes/${universeId}/follow`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId }),
          }
        );
        if (!response.ok) {
          if (response.status === 409) {
            this.followedUniverses.push(universeId);
          } else {
            throw new Error("Failed to follow universe");
          }
        } else {
          this.followedUniverses.push(universeId);
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error following universe:", error);
      }
    },

    async unfollowUniverse(universeId) {
      const userId = localStorage.getItem("userId");

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${apiUrl}/universes/${universeId}/unfollow`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to unfollow universe");
        }
        this.followedUniverses = this.followedUniverses.filter(
          (id) => id !== universeId
        );
      } catch (error) {
        this.error = error.message;
        console.error("Error unfollowing universe:", error);
      }
    },
  },
});
