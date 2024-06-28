import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';

export const useCharacterFormStore = defineStore('characterForm', () => {
  const initialData = {
    id: '',
    name: '',
    universe: ''
  };

  const schema = z.object({
    name: z.string().nonempty('Le nom est requis'),
    universe: z.string().nonempty('L\'univers est requis')
  });

  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const universes = ref([]);

  function setFormData(data) {
    console.log('Setting form data:', data);
    Object.assign(formData, data);
    console.log('Form data after setting:', formData);
  }

  async function fetchUniverses() {
    try {
      const response = await fetch('http://localhost:8000/universes');
      if (!response.ok) {
        throw new Error('Failed to fetch universes');
      }
      universes.value = await response.json();
    } catch (error) {
      console.error('Error fetching universes:', error);
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

  async function handleSubmit() {
    validate();
    if (Object.keys(errors.value).length > 0) {
      console.log('Validation errors:', errors.value);
      return;
    }
    isSubmitting.value = true;
    try {
      let response;
      console.log('Updating existing character with ID:', formData.id);
      response = await fetch(`http://localhost:8000/characters/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erreur: ${response.status} - ${errorMessage.message}`);
      }

      const responseData = await response.json();
      console.log('API response:', responseData);
    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', httpError.value);
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
    setFormData,
    fetchUniverses,
    validate,
    handleSubmit
  };
});
