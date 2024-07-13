import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAdmin: false,
  }),
  actions: {
    checkAdmin() {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          let userRole = decoded.role;
          if (userRole === "ROLE_ADMIN") {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
        } catch (error) {
          console.error("Failed to decode JWT:", error);
          this.isAdmin = false;
        }
      } else {
        console.log("Token JWT non trouvé dans le localStorage.");
        this.isAdmin = false;
      }
    },
  },
});
