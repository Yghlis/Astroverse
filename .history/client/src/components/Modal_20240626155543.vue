<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Default Header
            </slot>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit">
              <!-- Your other input fields -->
  
              <div v-if="currentDataType === 'products' && modalType === 'edit'">
                <!-- Your other input fields for products -->
  
                <label for="tags">Tags</label>
                <input id="tags" v-model="tagsString" type="text" />
                <span>{{ errors.tags }}</span>
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
  import { ref, computed, watch, onMounted } from 'vue';
  
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
  
  const formattedPrice = computed({
    get() {
      return formData.value.price ? formData.value.price.toString().replace('.', ',') : '';
    },
    set(value) {
      formData.value.price = parseFloat(value.replace(',', '.')) || 0;
    }
  });
  
  const formattedDiscountedPrice = computed({
    get() {
      return formData.value.discounted_price ? formData.value.discounted_price.toString().replace('.', ',') : '';
    },
    set(value) {
      formData.value.discounted_price = parseFloat(value.replace(',', '.')) || 0;
    }
  });
  
  const tagsString = computed({
    get() {
      return formData.value.tags ? formData.value.tags.join(', ') : '';
    },
    set(value) {
      formData.value.tags = value.split(',').map(tag => tag.trim());
    }
  });
  
  const onSubmit = async () => {
    console.log('Form data before submit:', formData.value);
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
        universe: newRow.universe.id || newRow.universe // Assuming `universe` is an object containing the ID
      });
    } else if (props.currentDataType === 'universes' && newRow) {
      console.log('Setting form data for universe:', newRow); // Debug log
      universeFormStore.setFormData(newRow);
    } else if (props.currentDataType === 'products' && newRow) {
      console.log('Setting form data for product:', newRow); // Debug log
      productFormStore.setFormData({
        ...newRow,
        character: newRow.character.id || newRow.character,
        universe: newRow.universe.id || newRow.universe
      });
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
  