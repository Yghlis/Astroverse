import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';
import useFlashMessageStore from '../composables/useFlashMessageStore';

export const useUniversesFormStore = defineStore('universes', () => {
  const { setFlashMessage } = useFlashMessageStore();

  const initialData = {
    id: '',
    name: '',
    color1: '',
    color2: '',
    colorText: '',
  };

  const schema = z.object({
    name: z.string().nonempty('Le nom est requis'),
    color1: z.string().nonempty('La couleur 1 est requise'),
    color2: z.string().nonempty('La couleur 2 est requise'),
    colorText: z.string().nonempty('La couleur du texte est requise'),
  });

  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const followedUniverses = ref([]);  // Assurez-vous que followedUniverses est initialisé

  function setFormData(data) {
    console.log('Setting form data:', data);
    Object.assign(formData, data);
    console.log('Form data after setting:', formData);
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
      setFlashMessage("Votre univers n'a pas été créé car votre formulaire est incorrect.", 'error');
      return;
    }
    isSubmitting.value = true;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/universes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status === 409) { 
          setFlashMessage("Un univers avec ce nom existe déjà. Veuillez choisir un autre nom.", 'error');
        } else {
          throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
        }
        return;
    }
  
      const responseData = await response.json();
      console.log('API response:', responseData);
      setFlashMessage('Votre univers a bien été créé', 'success');
      // Emit success event
      return responseData;
    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', httpError.value);
      setFlashMessage('Problème serveur, veuillez réessayer ultérieurement', 'error');
    } finally {
      isSubmitting.value = false;
    }
  }
  

  async function handleSubmit() {
    validate();
    if (Object.keys(errors.value).length > 0) {
        console.log('Validation errors:', errors.value);
        setFlashMessage("Votre univers n'a pas été créé car votre formulaire est incorrect.", 'error');
        return;
      }

    isSubmitting.value = true;
    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Utiliser l'URL d'API dynamique
      let response;
      console.log('Updating existing universe with ID:', formData.id);
      response = await fetch(`${apiUrl}/universes/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status === 409) { 
          setFlashMessage("Un univers avec ce nom existe déjà. Veuillez choisir un autre nom.", 'error');
        } else {
          throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
        }
        return;
    }

      const responseData = await response.json();
      console.log('API response:', responseData);
      setFlashMessage('Votre univers a bien été mis à jour', 'success');
    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', httpError.value);
      setFlashMessage('Problème serveur, veuillez réessayer ultérieurement', 'error');
    } finally {
      isSubmitting.value = false;
    }
  }

  async function followUniverse(universeId) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/universes/${universeId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to follow universe');
      }
      followedUniverses.value.push(universeId);
      setFlashMessage('Vous suivez maintenant cet univers.', 'success');
    } catch (error) {
      setFlashMessage('Erreur lors du suivi de l\'univers.', 'error');
      console.error('Error following universe:', error);
    }
  }

  async function unfollowUniverse(universeId) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/universes/${universeId}/unfollow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to unfollow universe');
      }
      followedUniverses.value = followedUniverses.value.filter(id => id !== universeId);
      setFlashMessage('Vous ne suivez plus cet univers.', 'success');
    } catch (error) {
      setFlashMessage('Erreur lors de l\'arrêt du suivi de l\'univers.', 'error');
      console.error('Error unfollowing universe:', error);
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    httpError,
    setFormData,
    validate,
    handleCreate,
    handleSubmit,
    followUniverse,
    unfollowUniverse,
    followedUniverses  // Ajouté pour l'export
  };
});
