<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">Default Header</slot>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit">
              <div v-if="currentDataType === 'products' && modalType === 'edit'">
                <!-- Form fields for product data -->
                <label for="title">Nom du produit</label>
                <input id="title" v-model="formData.title" type="text" />
                <span>{{ errors.title }}</span>
  
                <label for="brand">Marque</label>
                <input id="brand" v-model="formData.brand" type="text" />
                <span>{{ errors.brand }}</span>
  
                <label for="price">Prix</label>
                <input id="price" v-model="formData.price" type="text" />
                <span>{{ errors.price }}</span>
  
                <label for="is_promotion">Promotion</label>
                <input id="is_promotion" v-model="formData.is_promotion" type="checkbox" />
  
                <label for="discounted_price">Prix en promotion</label>
                <input id="discounted_price" v-model="formData.discounted_price" type="text" :disabled="!formData.is_promotion" />
                <span>{{ errors.discounted_price }}</span>
  
                <label for="description">Description</label>
                <input id="description" v-model="formData.description" type="text" />
                <span>{{ errors.description }}</span>
  
                <label for="stock">Stock</label>
                <input id="stock" v-model="formData.stock" type="number" />
                <span>{{ errors.stock }}</span>
  
                <label for="image_preview">Image Preview</label>
                <input id="image_preview" type="file" @change="handleImagePreviewChange" accept="image/*" />
                <span>{{ errors.image_preview }}</span>
  
                <label for="image_gallery_0">Image Gallery 1</label>
                <input id="image_gallery_0" type="file" @change="event => handleImageGalleryChange(event, 0)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[0] }}</span>
  
                <label for="image_gallery_1">Image Gallery 2</label>
                <input id="image_gallery_1" type="file" @change="event => handleImageGalleryChange(event, 1)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[1] }}</span>
  
                <label for="image_gallery_2">Image Gallery 3</label>
                <input id="image_gallery_2" type="file" @change="event => handleImageGalleryChange(event, 2)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[2] }}</span>
  
                <label for="image_gallery_3">Image Gallery 4</label>
                <input id="image_gallery_3" type="file" @change="event => handleImageGalleryChange(event, 3)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[3] }}</span>
  
                <label for="character">Personnage</label>
                <select id="character" v-model="formData.character">
                  <option v-for="character in characters" :key="character.id" :value="character.id">{{ character.name }}</option>
                </select>
                <span>{{ errors.character }}</span>
  
                <label for="universe">Univers</label>
                <select id="universe" v-model="formData.universe">
                  <option v-for="universe in universes" :key="universe.id" :value="universe.id">{{ universe.name }}</option>
                </select>
                <span>{{ errors.universe }}</span>
  
                <label for="reference">Référence</label>
                <input id="reference" v-model="formData.reference" type="text" />
                <span>{{ errors.reference }}</span>
  
                <label for="dimensions">Dimensions</label>
                <input id="dimensions" v-model="detailsData.dimensions" type="text" />
                <span>{{ errors.details?.dimensions }}</span>
  
                <label for="weight">Poids</label>
                <input id="weight" v-model="detailsData.weight" type="text" />
                <span>{{ errors.details?.weight }}</span>
  
                <label for="materials">Matériaux</label>
                <input id="materials" v-model="detailsData.materials" type="text" />
                <span>{{ errors.details?.materials }}</span>
  
                <label for="tags">Tags</label>
                <input id="tags" v-model="tagsInput" type="text" @change="updateTags" />
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
  
  const tagsInput = ref(formData.value.tags.join(', '));
  
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
    formData.value.details = {
      dimensions: detailsData.dimensions,
      weight: detailsData.weight,
      materials: detailsData.materials
    };
  
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
      await characterFormStore.fetchUniverses();
    } else if (newType === 'products') {
      await productFormStore.fetchUniverses();
      await productFormStore.fetchCharacters();
    }
  });
  
  watch(() => props.selectedRow, (newRow) => {
    if (props.currentDataType === 'characters' && newRow) {
      characterFormStore.setFormData({
        ...newRow,
        universe: newRow.universe.id || newRow.universe
      });
    } else if (props.currentDataType === 'universes' && newRow) {
      universeFormStore.setFormData(newRow);
    } else if (props.currentDataType === 'products' && newRow) {
      productFormStore.setFormData({
        ...newRow,
        character: newRow.character.id || newRow.character,
        universe: newRow.universe.id || newRow.universe
      });
      tagsInput.value = formData.value.tags.join(', ');
      if (newRow.details) {
        detailsData.dimensions = newRow.details.dimensions || '';
        detailsData.weight = newRow.details.weight || '';
        detailsData.materials = newRow.details.materials || '';
      }
    }
  });
  
  onMounted(async () => {
    if (props.currentDataType === 'characters') {
      await characterFormStore.fetchUniverses();
    } else if (props.currentDataType === 'products') {
      await productFormStore.fetchUniverses();
      await productFormStore.fetchCharacters();
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
  