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
    image_preview: z.string().url().nonempty('L\'image de prévisualisation est requise'),
    image_gallery: z.array(z.string().url()).length(4, 'Il faut exactement 4 images pour la galerie'),
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
      // Convertir les valeurs de prix en chaîne de caractères avant la validation
      formData.price = formData.price.toString();
      formData.discounted_price = formData.discounted_price.toString();

      schema.parse(formData);
      Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
    } catch (e) {
      e.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
    }
  }

  async function handleSubmit() {
    try {
      console.log('Handling submit...');
      isSubmitting.value = true;
  
      // Convertir les valeurs de prix avec des virgules en nombres
      formData.price = parseFloat(formData.price.replace(',', '.'));
      formData.discounted_price = formData.discounted_price ? parseFloat(formData.discounted_price.replace(',', '.')) : 0;
  
      console.log('Form data after conversion:', formData);
  
      // Valider les données
      validate();
  
      console.log('Form data after validation:', formData);
  
      const url = `http://localhost:8000/products/${formData.id}`;
      console.log('Submitting to URL:', url);
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
      const reader = new FileReader();
      reader.onload = () => {
        formData.image_preview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      errors.image_preview = 'Please select a valid image file.';
    }
  }

  function handleImageGalleryChange(event, index) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        formData.image_gallery[index] = reader.result;
      };
      reader.readAsDataURL(file);
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
