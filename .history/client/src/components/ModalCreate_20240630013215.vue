<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Créer un {{ currentDataType === 'products' ? 'Produit' : (currentDataType === 'universes' ? 'Univers' : 'Personnage') }}
            </slot>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit" enctype="multipart/form-data">
              <!-- Formulaire pour les produits -->
              <div v-if="currentDataType === 'products'">
                <!-- Champs spécifiques aux produits -->
              </div>

              <!-- Formulaire pour les univers -->
              <div v-if="currentDataType === 'universes'">
                <!-- Champs spécifiques aux univers -->
              </div>

              <!-- Formulaire pour les personnages -->
              <div v-if="currentDataType === 'characters'">
                <label for="name">Nom du personnage</label>
                <input id="name" v-model="formData.name" type="text" />
                <span>{{ errors.name }}</span>
  
                <label for="universe">Univers</label>
                <select id="universe" v-model="formData.universe">
                  <option v-for="universe in universes" :key="universe.id" :value="universe.id">{{ universe.name }}</option>
                </select>
                <span>{{ errors.universe }}</span>
              </div>

              <button type="submit" :disabled="isSubmitting">Soumettre</button>
            </form>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              Default Footer
              <button class="modal-default-button" @click="$emit('close')">Fermer</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUniverseFormStore } from '../stores/universeFormStore';
  import { useProductFormStore } from '../stores/productFormStore';
  import { useCharacterFormStore } from '../stores/characterFormStore';
  import { ref, computed, onMounted, reactive } from 'vue';
  
  const universeFormStore = useUniverseFormStore();
  const productFormStore = useProductFormStore();
  const characterFormStore = useCharacterFormStore();
  
  const props = defineProps({
    currentDataType: String,
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: 'auto'
    }
  });
  
  const formData = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.formData;
    if (props.currentDataType === 'products') return productFormStore.formData;
    if (props.currentDataType === 'characters') return characterFormStore.formData;
  });
  
  const errors = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.errors;
    if (props.currentDataType === 'products') return productFormStore.errors;
    if (props.currentDataType === 'characters') return characterFormStore.errors;
  });
  
  const isSubmitting = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.isSubmitting;
    if (props.currentDataType === 'products') return productFormStore.isSubmitting;
    if (props.currentDataType === 'characters') return characterFormStore.isSubmitting;
  });
  
  const universes = computed(() => {
    return characterFormStore.universes;
  });
  
  const characters = computed(() => {
    return productFormStore.characters;
  });
  
  const tagsInput = ref('');
  const detailsData = reactive({
    dimensions: '',
    weight: '',
    materials: ''
  });
  
  const updateTags = () => {
    formData.value.tags = tagsInput.value.split(',').map(tag => tag.trim());
  };
  
  const handleImagePreviewChange = (event) => {
    productFormStore.handleImagePreviewChange(event);
  };
  
  const handleImageGalleryChange = (event, index) => {
    productFormStore.handleImageGalleryChange(event, index);
  };
  
  const onSubmit = async () => {
    console.log('Form data before submit:', formData.value); // Debug log
  
    formData.value.details = {
      dimensions: detailsData.dimensions,
      weight: detailsData.weight,
      materials: detailsData.materials
    };
  
    if (props.currentDataType === 'universes') {
      await universeFormStore.handleCreate();
    } else if (props.currentDataType === 'products') {
      await productFormStore.handleCreate();
    } else if (props.currentDataType === 'characters') {
      await characterFormStore.handleCreate();
    }
  };
  
  onMounted(async () => {
    if (props.currentDataType === 'products' || props.currentDataType === 'characters') {
      console.log('Fetching universes on modal mount...');
      await characterFormStore.fetchUniverses();
      console.log('Universes fetched:', characterFormStore.universes);
    }
    if (props.currentDataType === 'products') {
      await productFormStore.fetchCharacters();
      console.log('Characters fetched:', productFormStore.characters);
    }
  });
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10px;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    max-width: 90%;
  }
  
  .modal-header,
  .modal-footer {
    padding-bottom: 10px;
  }
  </style>
