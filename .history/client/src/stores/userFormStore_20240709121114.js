import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';
import useFlashMessageStore from '../composables/useFlashMessageStore';

export const useUserFormStore = defineStore('userForm', () => {
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
    roles: [],
  };

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
    roles: z.array(z.string()).nonempty('Au moins un rôle est requis'),
  });

  const formData = reactive({ ...initialData });
  const errors = reactive({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const { flashMessage, setFlashMessage } = useFlashMessageStore();

  function setFormData(data) {
    console.log('Setting form data:', data);
    Object.assign(formData, {
      ...data,
      address: {
        ...initialData.address,
        ...data.address,
      },
    });
    console.log('Form data after setting:', formData);
  }

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

  function capitalizeEmail() {
    if (formData.email && formData.email.length > 0) {
      formData.email = formData.email.charAt(0).toUpperCase() + formData.email.slice(1);
    }
  }

  async function handleSubmit() {
    validate();
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      setFlashMessage("Erreur de validation, veuillez vérifier les données saisies", 'error');
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw    Error(`Erreur: ${response.status} - ${errorMessage.error}`);
      }

      const responseData = await response.json();
      console.log('API response:', responseData);
      setFlashMessage('Utilisateur mis à jour avec succès', 'success');
    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', httpError.value);
      setFlashMessage('Erreur serveur, veuillez réessayer plus tard', 'error');
    } finally {
      isSubmitting.value = false;
    }
  }

  async function handleCreate() {
    validate();
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      setFlashMessage("Erreur de validation, veuillez vérifier les données saisies", 'error');
      return;
    }
    isSubmitting.value = true;

    capitalizeEmail();

    try {
      const url = 'http://localhost:8000/users';
      const method = 'POST';

      const dataToSend = {
        ...formData,
        isEmailVerified: true,
        mustChangePassword: true
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erreur: ${response.status} - ${errorMessage.error}`);
      }

      const responseData = await response.json();
      console.log('API response:', responseData);
      setFlashMessage('Utilisateur créé avec succès', 'success');
    } catch (error) {
      httpError.value = error.message;
      console.log('HTTP error:', httpError.value);
      setFlashMessage('Erreur serveur, veuillez réessayer plus tard', 'error');
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
