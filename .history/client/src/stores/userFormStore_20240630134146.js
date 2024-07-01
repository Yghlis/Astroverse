import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';

export const useUserFormStore = defineStore('userForm', () => {
  // Définition des données initiales du formulaire
  const initialData = {
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password_hash: '',
    phone_number: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: ''
    },
    roles: [], // Initialise comme un tableau vide
  };

  // Schéma de validation des données du formulaire
  const schema = z.object({
    first_name: z.string().nonempty('Le prénom est requis'),
    last_name: z.string().nonempty('Le nom est requis'),
    email: z.string().email('Email invalide'),
    password_hash: z.string().nonempty('Le mot de passe est requis'),
    phone_number: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional()
    }).optional(),
    roles: z.array(z.string()).nonempty('Au moins un rôle est requis'), // Validation pour les rôles
  });

  // Données réactives pour le formulaire
  const formData = reactive({ ...initialData });
  const errors = reactive({});
  const isSubmitting = ref(false);
  const httpError = ref(null);

  // Fonction pour définir les données du formulaire
  function setFormData(data) {
    console.log('Setting form data:', data);
    Object.assign(formData, data);
    console.log('Form data after setting:', formData);
  }

  // Fonction de validation des données du formulaire
  function validate() {
    try {
      schema.parse(formData);
      Object.keys(errors).forEach(key => delete errors[key]);
    } catch (e) {
      e.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
    }
  }

  // Fonction pour capitaliser le premier caractère de l'email
  function capitalizeEmail() {
    if (formData.email && formData.email.length > 0) {
      formData.email = formData.email.charAt(0).toUpperCase() + formData.email.slice(1);
    }
  }

  // Fonction de soumission du formulaire pour la mise à jour
  async function handleSubmit() {
    validate();
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return;
    }
    isSubmitting.value = true;

    capitalizeEmail();

    try {
      const url = `http://localhost:8000/users/${formData.user_id}`;
      const method = 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erreur: ${response.status} - ${errorMessage.error}`);
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

  // Fonction de soumission du formulaire pour la création
  async function handleCreate() {
    validate();
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return;
    }
    isSubmitting.value = true;

    capitalizeEmail();

    try {
      const url = 'http://localhost:8000/users/admin';
      const method = 'POST';

      const dataToSend = {
        ...formData,
        isEmailVerified: true,
        mustChangePassword: true
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erreur: ${response.status} - ${errorMessage.error}`);
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
    setFormData,
    validate,
    handleSubmit,
    handleCreate
  };
});
