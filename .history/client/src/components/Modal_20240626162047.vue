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
              <div v-if="currentDataType === 'universes' && modalType === 'edit'">
                <label for="name">Nom</label>
                <input id="name" v-model="formData.name" type="text" />
                <span>{{ errors.name }}</span>
  
                <label for="color1">Couleur 1</label>
                <input id="color1" v-model="formData.color1" type="text" />
                <span>{{ errors.color1 }}</span>
  
                <label for="color2">Couleur 2</label>
                <input id="color2" v-model="formData.color2" type="text" />
                <span>{{ errors.color2 }}</span>
  
                <label for="colorText">Couleur du texte</label>
                <input id="colorText" v-model="formData.colorText" type="text" />
                <span>{{ errors.colorText }}</span>
  
                <label for="link">Lien</label>
                <input id="link" v-model="formData.link" type="text" />
                <span>{{ errors.link }}</span>
              </div>
  
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
  
              <div v-if="currentDataType === 'products' && modalType === 'edit'">
                <label for="title">Nom du produit</label>
                <input id="title" v-model="formData.title" type="text" />
                <span>{{ errors.title }}</span>
  
                <label for="brand">Marque</label>
                <input id="brand" v-model="formData.brand" type="text" />
                <span>{{ errors.brand }}</span>
  
                <label for="price">Prix</label>
                <input id="price" v-model="formattedPrice" type="text" @input="formatPrice($event.target.value, 'price')" />
                <span>{{ errors.price }}</span>
  
                <label for="is_promotion">Promotion</label>
                <input id="is_promotion" v-model="formData.is_promotion" type="checkbox" />
                
                <label for="discounted_price">Prix en promotion</label>
                <input id="discounted_price" v-model="formattedDiscountedPrice" type="text" :disabled="!formData.is_promotion" @input="formatPrice($event.target.value, 'discounted_price')" />
                <span>{{ errors.discounted_price }}</span>
  
                <label for="description">Description</label>
                <input id="description" v-model="formData.description" type="text" />
                <span>{{ errors.description }}</span>
  
                <label for="stock">Stock</label>
                <input id="stock" v-model="formData.stock" type="number" />
                <span>{{ errors.stock }}</span>
  
                <label for="image_preview">Image Preview</label>
                <input id="image_preview" v-model="formData.image_preview" type="text" />
                <span>{{ errors.image_preview }}</span>
  
                <label for="image_gallery">Image Gallery</label>
                <input id="image_gallery" v-model="formData.image_gallery" type="text" />
                <span>{{ errors.image_gallery }}</span>
  
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
  
                <label for="details">Détails</label>
                <input id="details" v-model="formData.details" type="text" />
                <span>{{ errors.details }}</span>
  
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
      return Array.isArray(formData.value.tags) ? formData.value.tags.join(', ') : '';
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
        universe: newRow.universe.id || newRow.universe,
        tags: Array.isArray(newRow.tags) ? newRow.tags.join(', ') : newRow.tags
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
  