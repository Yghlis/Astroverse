import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode"; // Corrigé l'import
import { z } from "zod";
import useFlashMessageStore from "../composables/useFlashMessageStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAdmin: false,
    userData: {},
    errors: {},
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
        this.isAdmin = false;
      }
    },

    async getUserById(id) {
      const token = localStorage.getItem("jwt");
      const apiUrl = import.meta.env.VITE_API_URL;

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
      const { setFlashMessage } = useFlashMessageStore();

      this.validate(user);
      if (Object.keys(this.errors).length > 0) {
        setFlashMessage(
          "Erreur de validation, veuillez vérifier les données saisies",
          "error"
        );
        return;
      }

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
          setFlashMessage("Utilisateur mis à jour avec succès", "success");
        } else {
          throw new Error("Réponse non-JSON reçue");
        }
      } catch (error) {
        console.error("Échec de la mise à jour de l'utilisateur :", error);
        setFlashMessage("Échec de la mise à jour de l'utilisateur", "error");
      }
    },

    validate(data) {
      const schema = z.object({
        first_name: z.string().nonempty("Le prénom est requis"),
        last_name: z.string().nonempty("Le nom est requis"),
        email: z.string().email("Email invalide"),
        phone_number: z.string().optional(),
        address: z
          .object({
            street: z.string().optional(),
            city: z.string().optional(),
            postal_code: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(),
      });

      try {
        schema.parse(data);
        this.errors = {};
      } catch (e) {
        this.errors = {};
        e.errors.forEach((err) => {
          this.errors[err.path[0]] = err.message;
        });
      }
    },
  },
});
