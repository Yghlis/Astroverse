import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';

export const useUniverseFormStore = defineStore('universeForm', () => {
  const initialData = {
    id: '',
    name: '',
    color1: '',
    color2: '',
    colorText: '',
    link: ''
  };

  const schema = z.object({
    name: z.string().nonempty('Le nom est requis'),
    color1: z.string().nonempty('La couleur 1 est requise'),
    color2: z.string().nonempty('La couleur 2 est requise'),
    colorText: z.string().nonempty('La couleur du texte est requise'),
    link: z.string().url('Le lien doit être une URL valide')
  });

  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);

  function setFormData(data) {
    console.log('Setting form data:', data); // Ajout de console.log ici
    Object.assign(formData, data);
    console.log('Form data after setting:', formData); // Vérifiez les données du formulaire après les avoir définies
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

  async function handleSubmit() {
    validate();
    if (Object.keys(errors.value).length > 0) {
      console.log('Validation errors:', errors.value); // Vérifiez les erreurs de validation
      return;
    }
    isSubmitting.value = true;
    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Utiliser l'URL d'API dynamique
      let response;
      console.log('Updating existing universe with ID:', formData.id); // Ajout de console.log pour vérifier l'ID
      // If there's an ID, update the existing universe
      response = await fetch(`${apiUrl}/universes/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log('API response:', responseData); // Vérifiez la réponse de l'API

      // Si la soumission est réussie, vous pouvez ajouter une logique supplémentaire ici,
      // comme réinitialiser le formulaire ou notifier l'utilisateur.
    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', httpError.value); // Vérifiez les erreurs HTTP
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    httpError,
    setFormData,
    validate,
    handleSubmit
  };
});
