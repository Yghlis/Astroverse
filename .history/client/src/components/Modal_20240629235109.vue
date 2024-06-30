<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">Default Header</slot>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit" enctype="multipart/form-data">
              <!-- Formulaire pour les produits -->
              <div v-if="currentDataType === 'products' && modalType === 'edit'">
                <!-- Form fields for product data -->
                <!-- ... (votre code de formulaire de produit ici) -->
              </div>
              <!-- Formulaire pour les univers -->
              <div v-if="currentDataType === 'universes' && modalType === 'edit'">
                <label for="name">Nom de l'univers</label>
                <input id="name" v-model="formData.name" type="text" />
                <span>{{ errors.name }}</span>
  
                <label for="color1">Couleur 1</label>
                <input id="color1" v-model="formData.color1" type="text" />
                <span>{{ errors.color1 }}</span>
  
                <label for="color2">Couleur 2</label>
                <input id="color2" v-model="formData.color2" type="text" />
                <span>{{ errors.color2 }}</span>
  
                <label for="colorText">Couleur du Texte</label>
                <input id="colorText" v-model="formData.colorText" type="text" />
                <span>{{ errors.colorText }}</span>
  
                <label for="link">Lien</label>
                <input id="link" v-model="formData.link" type="text" />
                <span>{{ errors.link }}</span>
              </div>
              <!-- Formulaire pour les personnages -->
              <div v-if="currentDataType === 'characters' && modalType === 'edit'">
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
  import { useCharacterFormStore } from '../stores/characterFormStore';
  import { useProductFormStore } from '../stores/productFormStore';
  import { ref, computed, watch, onMounted, reactive } from 'vue';
  
  const universeFormStore = useUniverseFormStore();
  const characterFormStore = useCharacterFormStore();
  const productFormStore = useProductFormStore();
  
  const props = defineProps({
    currentDataType: String,
    modalType: String,
    selectedRow: Object,
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
    if (props.currentDataType === 'characters') return characterFormStore.formData;
    if (props.currentDataType === 'products') return productFormStore.formData;
  });
  
  const errors = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.errors;
    if (props.currentDataType === 'characters') return characterFormStore.errors;
    if (props.currentDataType === 'products') return productFormStore.errors;
  });
  
  const isSubmitting = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.isSubmitting;
    if (props.currentDataType === 'characters') return characterFormStore.isSubmitting;
    if (props.currentDataType === 'products') return productFormStore.isSubmitting;
  });
  
  const universes = computed(() => {
    return productFormStore.universes;
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
  
    if (props.currentDataType === 'products') {
      formData.value.details = {
        dimensions: detailsData.dimensions,
        weight: detailsData.weight,
        materials: detailsData.materials
      };
    }
  
    if (props.currentDataType === 'universes') {
      await universeFormStore.handleSubmit();
    } else if (props.currentDataType === 'characters') {
      await characterFormStore.handleSubmit();
    } else if (props.currentDataType === 'products') {
      await productFormStore.handleSubmit();
    }
  };
  
  watch(() => props.currentDataType, async (newType) => {
    if (newType === 'characters') {
      console.log('Fetching universes for characters...');
      await characterFormStore.fetchUniverses();
      console.log('Universes fetched:', characterFormStore.universes);
    } else if (newType === 'products') {
      console.log('Fetching universes and characters for products...');
      await productFormStore.fetchUniverses();
      await productFormStore.fetchCharacters();
      console.log('Universes fetched:', productFormStore.universes);
      console.log('Characters fetched:', productFormStore.characters);
    }
  });
  
  watch(() => props.selectedRow, (newRow) => {
    if (props.currentDataType === 'characters' && newRow) {
      console.log('Setting form data for character:', newRow); // Debug log
      characterFormStore.setFormData({
        ...newRow,
        universe: newRow.universe?.id || newRow.universe // Assuming `universe` is an object containing the ID
      });
    } else if (props.currentDataType === 'universes' && newRow) {
      console.log('Setting form data for universe:', newRow); // Debug log
      universeFormStore.setFormData(newRow);
    } else if (props.currentDataType === 'products' && newRow) {
      console.log('Setting form data for product:', newRow); // Debug log
      productFormStore.setFormData({
        ...newRow,
        character: newRow.character?.id || newRow.character,
        universe: newRow.universe?.id || newRow.universe
      });
      tagsInput.value = newRow.tags ? newRow.tags.join(', ') : ''; // Mise à jour du champ tags
      if (newRow.details) {
        detailsData.dimensions = newRow.details.dimensions || '';
        detailsData.weight = newRow.details.weight || '';
        detailsData.materials = newRow.details.materials || '';
      }
    }
  });
  
  onMounted(async () => {
    if (props.currentDataType === 'characters') {
      console.log('Fetching universes on modal mount...');
      await characterFormStore.fetchUniverses();
      console.log('Universes fetched:', characterFormStore.universes);
    } else if (props.currentDataType === 'products') {
      console.log('Fetching universes and characters on modal mount...');
      await productFormStore.fetchUniverses();
      await productFormStore.fetchCharacters();
      console.log('Universes fetched:', productFormStore.universes);
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
  