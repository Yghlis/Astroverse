import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAdmin: false,
    userData: {},
  }),
  actions: {
    checkAdmin() {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          let userRole = decoded.role;
          this.isAdmin = userRole === "ROLE_ADMIN";
        } catch (error) {
          console.error("Échec du décodage du JWT :", error);
          this.isAdmin = false;
        }
      } else {
        console.log("Token JWT non trouvé dans le localStorage.");
        this.isAdmin = false;
      }
    },

    async getUserById(id) {
      const token = localStorage.getItem("jwt");
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log(id);
      try {
        const response = await fetch(`${apiUrl}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Échec de la récupération de l'utilisateur");
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          this.userData = await response.json();
          console.log(this.userData);
        } else {
          throw new Error("Réponse non-JSON reçue");
        }
      } catch (error) {
        console.error(
          "Échec de la récupération de l'utilisateur par ID :",
          error
        );
      }
    },

    async updateUser(id, user) {
      const token = localStorage.getItem("jwt");
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${apiUrl}/users/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          throw new Error("Échec de la mise à jour de l'utilisateur");
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          this.userData = await response.json();
        } else {
          throw new Error("Réponse non-JSON reçue");
        }
      } catch (error) {
        console.error("Échec de la mise à jour de l'utilisateur :", error);
      }
    },
  },
});
