import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';

export const useProductFormStore = defineStore('productForm', () => {
  const initialData = {
    id: '',
    title: '',
    brand: '',
    price: 0,
    discounted_price: 0,
    is_promotion: false,
    description: '',
    stock: 0,
    image_preview: '',
    image_gallery: ['', '', '', ''],
    character: '',
    universe: '',
    reference: '',
    details: '',
    tags: ''
  };

  const schema = z.object({
    title: z.string().nonempty('Le titre est requis'),
    brand: z.string().nonempty('La marque est requise'),
    price: z.string().refine(val => /^\d+([.,]\d{1,2})?$/.test(val), {
      message: 'Le prix doit être un nombre positif avec ou sans centimes',
    }),
    discounted_price: z.string().optional().refine(val => /^\d+([.,]\d{1,2})?$/.test(val), {
      message: 'Le prix promotionnel doit être un nombre positif avec ou sans centimes',
    }),
    is_promotion: z.boolean(),
    description: z.string().nonempty('La description est requise'),
    stock: z.number().int().nonnegative('Le stock doit être un entier positif'),
    image_preview: z.string().url().nonempty('L\'image de prévisualisation est requise'),
    image_gallery: z.array(z.string().url()).length(4, 'Il faut exactement 4 images pour la galerie'),
    character: z.string().nonempty('Le personnage est requis'),
    universe: z.string().nonempty('L\'univers est requis'),
    reference: z.string().optional(),
    details: z.string().optional(),
    tags: z.string().optional()
  });

  const formData = reactive({ ...initialData });
  const errors = ref({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const characters = ref([]);
  const universes = ref([]);

  function setFormData(data) {
    console.log('Setting form data:', data);
    Object.assign(formData, {
      ...data,
      character: data.character.id || data.character,
      universe: data.universe.id || data.universe
    });
    console.log('Form data after setting:', formData);
  }

  async function fetchCharacters() {
    try {
      console.log('Fetching characters...');
      const response = await fetch('http://localhost:8000/characters', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }
      const data = await response.json();
      console.log('Characters fetched:', data);
      characters.value = data;
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  }

  async function fetchUniverses() {
    try {
      console.log('Fetching universes...');
      const response = await fetch('http://localhost:8000/universes', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch universes');
      }
      const data = await response.json();
      console.log('Universes fetched:', data);
      universes.value = data;
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
    try {
      console.log('Handling submit...');
      isSubmitting.value = true;

      // Convertir les valeurs de prix avec des virgules en nombres
      formData.price = parseFloat(formData.price.replace(',', '.'));
      formData.discounted_price = formData.discounted_price ? parseFloat(formData.discounted_price.replace(',', '.')) : 0;

      // Valider les données
      schema.parse(formData);
      errors.value = {};

      let response;
      const url = `http://localhost:8000/products/${formData.id}`;
      response = await fetch(url, {
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
      if (error instanceof z.ZodError) {
        errors.value = error.flatten().fieldErrors;
      } else {
        httpError.value = error.message;
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    httpError,
    characters,
    universes,
    setFormData,
    fetchCharacters,
    fetchUniverses,
    validate,
    handleSubmit
  };
});
