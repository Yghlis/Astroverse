import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { z } from "zod";
import useFlashMessageStore from './useFlashMessageStore';

export const useCharacterFormStore = defineStore("characterForm", () => {
    const { setFlashMessage } = useFlashMessageStore();
  const initialData = {
    id: "",
    name: "",
    universe: "",
  };

  const schema = z.object({
    name: z.string().nonempty('Le nom est requis'),
    universe: z.string().uuid('L\'univers est requis et doit être un UUID valide')
  });

  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const universes = ref([]);
  const universeName = ref('');  // Ajoutez cette ligne

  function setFormData(data) {
    console.log("Setting form data:", data);
    Object.assign(formData, data);
    console.log("Form data after setting:", formData);
  }

  async function fetchUniverses() {
    const apiUrl = import.meta.env.VITE_API_URL; // Utiliser l'URL d'API dynamique
    try {
      console.log("Fetching universes...");
      const response = await fetch(`${apiUrl}/universes`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch universes");
      }
      const data = await response.json();
      console.log("Universes fetched:", data);
      universes.value = data;
    } catch (error) {
      console.error("Error fetching universes:", error);
    }
  }

  async function fetchUniverseNameById(universeId) {
    try {
      const response = await fetch(`http://localhost:8000/universes/${universeId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch universe name');
      }
      const data = await response.json();
      universeName.value = data.name;
    } catch (error) {
      console.error('Error fetching universe name:', error);
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
        console.log('Validation errors:', errors.value);
        setFlashMessage("Votre personnage n'a pas été créé car votre formulaire est incorrect.", 'error'); // Message flash pour erreurs de validation
        return;
      }
    isSubmitting.value = true;
    try {
      const url = 'http://localhost:8000/characters';
      console.log('Creating new character');
      console.log('URL:', url);
      console.log('Form Data:', JSON.stringify(formData));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log('API response:', responseData);

      if (!response.ok) {
        const errorMessage = await responseData;
        throw new Error(`Erreur: ${response.status} - ${errorMessage.message}`);
      }

    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', error.message);
    } finally {
      isSubmitting.value = false;
    }
  }

  async function handleSubmit() {
    validate();
    if (Object.keys(errors.value).length > 0) {
      console.log("Validation errors:", errors.value);
      return;
    }
    isSubmitting.value = true;
    const apiUrl = import.meta.env.VITE_API_URL; // Utiliser l'URL d'API dynamique
    try {
      const url = `${apiUrl}/characters/${formData.id}`;
      console.log("Updating existing character with ID:", formData.id);
      console.log("URL:", url);
      console.log("Form Data:", JSON.stringify(formData));

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("API response:", responseData);

      if (!response.ok) {
        const errorMessage = await responseData;
        throw new Error(`Erreur: ${response.status} - ${errorMessage.message}`);
      }
    } catch (error) {
      httpError.value = error.message;
      console.log("HTTP error:", error.message);
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
    handleCreate
  };
});
