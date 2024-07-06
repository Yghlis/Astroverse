import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { z } from 'zod';

function ensureAbsoluteUrl(url) {
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://localhost:8000/uploads/${url.split('/').pop()}`;
  }
  return url;
}

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
    number_of_purchases: 0,
    number_of_favorites: 0,
    rating: 0,
    availability_status: 'En stock',
    views_count: 0,
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
    tags: '',
    image_preview_url: '',
    image_gallery_urls: ['', '', '', '']
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
    tags: z.string().optional()
  });

  const formData = reactive({ ...initialData });
  const errors = reactive({});
  const isSubmitting = ref(false);
  const httpError = ref(null);
  const characters = ref([]);
  const universes = ref([]);

  function setFormData(data) {
    console.log('Setting form data:', JSON.stringify(data, null, 2)); // Affichez toutes les infos de l'objet
  
    // Corriger les tags
    const parsedTags = Array.isArray(data.tags) ? data.tags.join(', ').replace(/[\[\]"]/g, '') : '';
    console.log('Parsed tags:', parsedTags);
  
    Object.assign(formData, {
      ...data,
      price: data.price != null ? data.price.toString() : '0',
      discounted_price: data.discounted_price != null ? data.discounted_price.toString() : '0',
      character: data.character != null ? (data.character.id || data.character) : '',
      universe: data.universe != null ? (data.universe.id || data.universe) : '',
      tags: parsedTags, // Utiliser parsedTags ici
      details: data.details || { dimensions: '', weight: '', materials: '' },
      image_preview_url: data.image_preview ? ensureAbsoluteUrl(data.image_preview) : '',
      image_gallery_urls: data.image_gallery ? data.image_gallery.map(ensureAbsoluteUrl) : ['', '', '', '']
    });
  
    console.log('Form data after setting:', formData);
  }
  
  
  

  async function fetchCharacters() {
    const apiUrl = import.meta.env.VITE_API_URL; // Utiliser l'URL d'API dynamique
    try {
      console.log('Fetching characters...');
      const response = await fetch(`${apiUrl}/characters`, {
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
    const apiUrl = import.meta.env.VITE_API_URL; // Utiliser l'URL d'API dynamique
    try {
      console.log('Fetching universes...');
      const response = await fetch(`${apiUrl}/universes`, {
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

  watch(() => formData.character, async (newCharacterId) => {
    if (newCharacterId) {
      const character = characters.value.find(c => c.id === newCharacterId);
      if (character) {
        const universe = universes.value.find(u => u.id === character.universe);
        formData.universe = universe ? universe.name : '';
      }
    }
  });

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

  async function handleSubmit() {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      console.log('Handling submit...');
      isSubmitting.value = true;

      formData.price = parseFloat(formData.price.replace(',', '.'));
      formData.discounted_price = formData.discounted_price ? parseFloat(formData.discounted_price.replace(',', '.')) : 0;

      console.log('Form data after conversion:', formData);

      validate();

      console.log('Form data after validation:', formData);

      const url = `http://localhost:8000/products/${formData.id}`;
      const method = 'PUT';

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== 'image_gallery') {
          if (typeof formData[key] === 'object' && formData[key] !== null) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }

      if (formData.image_preview instanceof File) {
        formDataToSend.append('image_preview', formData.image_preview);
      }

      formData.image_gallery.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append('image_gallery', image);
        }
      });

      formDataToSend.forEach((value, key) => {
        console.log(`Key: ${key}, Value:`, value);
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
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

  async function handleCreate() {
    try {
      console.log('Handling create...');
      isSubmitting.value = true;

      formData.price = parseFloat(formData.price.replace(',', '.'));
      formData.discounted_price = formData.discounted_price ? parseFloat(formData.discounted_price.replace(',', '.')) : 0;

      console.log('Form data after conversion:', formData);

      validate();

      console.log('Form data after validation:', formData);

      const url = 'http://localhost:8000/products';
      const method = 'POST';

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== 'image_gallery') {
          if (typeof formData[key] === 'object' && formData[key] !== null) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }

      if (formData.image_preview instanceof File) {
        formDataToSend.append('image_preview', formData.image_preview);
      }

      formData.image_gallery.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append('image_gallery', image);
        }
      });

      formDataToSend.forEach((value, key) => {
        console.log(`Key: ${key}, Value:`, value);
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
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
      formData.image_preview_url = URL.createObjectURL(file);
    } else {
      errors.image_preview = 'Please select a valid image file.';
    }
  }

  function handleImageGalleryChange(event, index) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      formData.image_gallery[index] = file;
      formData.image_gallery_urls[index] = URL.createObjectURL(file);
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
    handleCreate,
    handleImagePreviewChange,
    handleImageGalleryChange
  };
});
