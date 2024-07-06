<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" :style="{ width: width, height: height }">
        <div class="modal-header">
          <slot name="header">Default Header</slot>
        </div>
        <div class="modal-body">
          <p v-if="flashMessage" class="flash-message" :class="{ 'active': flashMessage, 'success': flashMessageType === 'success', 'error': flashMessageType === 'error' }">{{ flashMessage }}</p>
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <!-- Formulaire pour les produits -->
            <div v-if="currentDataType === 'products' && modalType === 'edit'">
              <!-- ...other input fields... -->

              <label for="tags">Tags</label>
              <input id="tags" v-model="tagsInput" type="text" @change="updateTags" />
              <span>{{ errors.tags }}</span>

              <!-- ...other input fields... -->
            </div>

            <!-- ...other forms... -->

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
import { useUserFormStore } from '../stores/userFormStore';
import useFlashMessageStore from '../stores/useFlashMessageStore';
import { ref, computed, watch, reactive, onMounted } from 'vue';

const universeFormStore = useUniverseFormStore();
const characterFormStore = useCharacterFormStore();
const productFormStore = useProductFormStore();
const userFormStore = useUserFormStore();
const { flashMessage, flashMessageType } = useFlashMessageStore();

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
  if (props.currentDataType === 'users') return userFormStore.formData;
});

const errors = computed(() => {
  if (props.currentDataType === 'universes') return universeFormStore.errors;
  if (props.currentDataType === 'characters') return characterFormStore.errors;
  if (props.currentDataType === 'products') return productFormStore.errors;
  if (props.currentDataType === 'users') return userFormStore.errors;
});

const isSubmitting = computed(() => {
  if (props.currentDataType === 'universes') return universeFormStore.isSubmitting;
  if (props.currentDataType === 'characters') return characterFormStore.isSubmitting;
  if (props.currentDataType === 'products') return productFormStore.isSubmitting;
  if (props.currentDataType === 'users') return userFormStore.isSubmitting;
});

const universes = computed(() => {
  return productFormStore.universes;
});

const characterUniverses = computed(() => {
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

const capitalizeEmail = () => {
  if (formData.value.email) {
    formData.value.email = formData.value.email.charAt(0).toUpperCase() + formData.value.email.slice(1);
  }
};

const onSubmit = async () => {
  console.log('Form data before submit:', formData.value); // Debug log
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
  } else if (props.currentDataType === 'users') {
    capitalizeEmail();
    await userFormStore.handleSubmit();
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
  console.log('selectedRow:', newRow);
  if (props.currentDataType === 'characters' && newRow) {
    console.log('Setting form data for character:', newRow); // Debug log
    characterFormStore.setFormData({
      ...newRow,
      universe: newRow.universe?.id || newRow.universe
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

    // Mettre à jour les tags dans le champ input
    tagsInput.value = formData.value.tags;
    console.log('Tags input value:', tagsInput.value); // Log the tags input value

    if (newRow.details) {
      detailsData.dimensions = newRow.details.dimensions || '';
      detailsData.weight = newRow.details.weight || '';
      detailsData.materials = newRow.details.materials || '';
    }
  } else if (props.currentDataType === 'users' && newRow) {
    console.log('Setting form data for user:', newRow); // Debug log
    userFormStore.setFormData({
      user_id: newRow.user_id,
      first_name: newRow.first_name,
      last_name: newRow.last_name,
      email: newRow.email,
      password_hash: newRow.password_hash,
      phone_number: newRow.phone_number,
      address: {
        street: newRow.address?.street || '',
        city: newRow.address?.city || '',
        postal_code: newRow.address?.postal_code || '',
        country: newRow.address?.country || ''
      },
      roles: newRow.roles || []
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
