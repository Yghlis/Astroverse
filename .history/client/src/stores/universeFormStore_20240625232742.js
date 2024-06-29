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
    Object.assign(formData, data);
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
      return;
    }
    isSubmitting.value = true;
    try {
      const response = await fetch('http://localhost:8000/universes', {
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

    } catch (error) {
      httpError.value = error.message;
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
