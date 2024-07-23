import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { z } from "zod";
import useFlashMessageStore from "../composables/useFlashMessageStore";

export const useCharacterFormStore = defineStore("characterForm", () => {
  const { setFlashMessage } = useFlashMessageStore();
  const initialData = {
    id: "",
    name: "",
    universe: "",
  };

  const schema = z.object({
    name: z.string().nonempty("Le nom est requis"),
    universe: z
      .string()
      .uuid("L'univers est requis et doit être un UUID valide"),
  });

  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const universes = ref([]);
  const universeName = ref("");

  function setFormData(data) {
    Object.assign(formData, data);
  }

  async function fetchUniverses() {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/universes`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch universes");
      }
      const data = await response.json();

      universes.value = data;
    } catch (error) {
      console.error("Error fetching universes:", error);
    }
  }

  async function fetchUniverseNameById(universeId) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/universes/${universeId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch universe name");
      }
      const data = await response.json();
      universeName.value = data.name;
    } catch (error) {
      console.error("Error fetching universe name:", error);
    }
  }

  function validate() {
    try {
      schema.parse(formData);
      errors.value = {};
    } catch (e) {
      errors.value = e.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
    }
  }

  async function handleCreate() {
    validate();
    if (Object.keys(errors.value).length > 0) {
      setFlashMessage(
        "Votre personnage n'a pas été créé car votre formulaire est incorrect.",
        "error"
      );
      return;
    }
    isSubmitting.value = true;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const url = `${apiUrl}/characters`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = await responseData;
        if (response.status === 409) {
          setFlashMessage(
            "Un personnage avec ce nom existe déjà. Veuillez choisir un autre nom.",
            "error"
          );
        } else {
          throw new Error(
            `Erreur: ${response.status} - ${errorMessage.message}`
          );
        }
        return;
      }
      setFlashMessage("Votre personnage a bien été créé", "success");
    } catch (error) {
      httpError.value = error.message;

      setFlashMessage(
        "Problème serveur, veuillez réessayer ultérieurement",
        "error"
      );
    } finally {
      isSubmitting.value = false;
    }
  }

  async function handleSubmit() {
    validate();
    if (Object.keys(errors.value).length > 0) {
      setFlashMessage(
        "Votre personnage n'a pas été mis à jour car votre formulaire est incorrect.",
        "error"
      );
      return;
    }
    isSubmitting.value = true;
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const url = `${apiUrl}/characters/${formData.id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = await responseData;
        if (response.status === 409) {
          setFlashMessage(
            "Un personnage avec ce nom existe déjà. Veuillez choisir un autre nom.",
            "error"
          );
        } else {
          throw new Error(
            `Erreur: ${response.status} - ${errorMessage.message}`
          );
        }
        return;
      }
      setFlashMessage("Votre personnage a bien été mis à jour", "success");
    } catch (error) {
      httpError.value = error.message;

      setFlashMessage(
        "Problème serveur, veuillez réessayer ultérieurement",
        "error"
      );
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    httpError,
    universes,
    universeName,
    setFormData,
    fetchUniverses,
    fetchUniverseNameById,
    validate,
    handleSubmit,
    handleCreate,
  };
});
