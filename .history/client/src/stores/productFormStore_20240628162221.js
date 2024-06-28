import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { z } from 'zod';

export const useProductFormStore = defineStore('productForm', () => {
  const initialData = {
    id: '',
    title: '',
    brand: '',
    price: '0',
    discounted_price: '0',
    is_promotion: false,
    description: '',
    stock: 0,
    image_preview: '',
    image_gallery: ['', '', '', ''],
    character: '',
    universe: '',
    reference: '',
    details: {
      dimensions: '',
      weight: '',
      materials: ''
    },
    tags: []
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
    character: z.string().nonempty('Le personnage est requis'),
    universe: z.string().nonempty('L\'univers est requis'),
    reference: z.string().optional(),
    details: z.object({
      dimensions: z.string().nonempty('Les dimensions sont requises'),
      weight: z.string().nonempty('Le poids est requis'),
      materials: z.string().nonempty('Les matériaux sont requis')
    }).optional(),
    tags: z.array(z.string()).optional()
  });

  const formData = reactive({ ...initialData });
  const errors = reactive({});  // Make errors reactive to track changes
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const characters = ref([]);
  const universes = ref([]);

  function setFormData(data) {
    console.log('Setting form data:', data);
    Object.assign(formData, {
      ...data,
      price: data.price != null ? data.price.toString() : '0',
      discounted_price: data.discounted_price != null ? data.discounted_price.toString() : '0',
      character: data.character != null ? (data.character.id || data.character) : '',
      universe: data.universe != null ? (data.universe.id || data.universe) : '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      details: data.details || { dimensions: '', weight: '', materials: '' }
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
      formData.price = formData.price.toString();
      formData.discounted_price = formData.discounted_price.toString();

      schema.parse(formData);
      Object.keys(errors).forEach(key => delete errors[key]);
    } catch (e) {
      e.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
    }
  }

  // productFormStore.js
  async function handleSubmit() {
    try {
      console.log('Handling submit...');
      isSubmitting.value = true;
  
      formData.price = parseFloat(formData.price.replace(',', '.'));
      formData.discounted_price = formData.discounted_price ? parseFloat(formData.discounted_price.replace(',', '.')) : 0;
  
      console.log('Form data after conversion:', formData);
  
      validate();
  
      console.log('Form data after validation:', formData);
  
      const url = formData.id ? `http://localhost:8000/products/${formData.id}` : 'http://localhost:8000/products';
      const method = formData.id ? 'PUT' : 'POST';
  
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== 'image_gallery') {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      // Ajoutez les fichiers d'images
      const imagePreviewInput = document.querySelector('input[name="image_preview"]');
      if (imagePreviewInput && imagePreviewInput.files[0]) {
        formDataToSend.append('image_preview', imagePreviewInput.files[0]);
      }
  
      formData.image_gallery.forEach((image, index) => {
        if (image) {
          formDataToSend.append('image_gallery', image);
        }
      });
  
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        console.error(`Erreur: ${response.status} - ${errorMessage.error}`);
        throw new Error(`Erreur: ${response.status} - ${errorMessage.error}`);
      }
  
      const responseData = await response.json();
      console.log('API response:', responseData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          errors[err.path[0]] = err.message;
        });
        console.log('Validation errors:', errors);
      } else {
        httpError.value = error.message;
        console.log('HTTP error:', httpError.value);
      }
    } finally {
      isSubmitting.value = false;
    }
  }
  
  function handleImagePreviewChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      formData.image_preview = file;
    } else {
      errors.image_preview = 'Please select a valid image file.';
    }
  }
  
  function handleImageGalleryChange(event, index) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      formData.image_gallery[index] = file;
    } else {
      errors.image_gallery = errors.image_gallery || [];
      errors.image_gallery[index] = 'Please select a valid image file.';
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
    handleSubmit,
    handleImagePreviewChange,
    handleImageGalleryChange
  };
});
