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
              <input id="image_preview" name="image_preview" type="file" @change="handleImagePreviewChange" accept="image/*" />
              <span>{{ errors.image_preview }}</span>
              <div v-if="formData.image_preview_url">
                <img :src="formData.image_preview_url" alt="Image Preview" style="max-width: 200px;">
              </div>

              <label for="image_gallery_0">Image Gallery 1</label>
              <input id="image_gallery_0" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 0)" accept="image/*" />
              <span>{{ errors.image_gallery && errors.image_gallery[0] }}</span>
              <div v-if="formData.image_gallery_urls[0]">
                <img :src="formData.image_gallery_urls[0]" alt="Image Gallery 1" style="max-width: 200px;">
              </div>

              <label for="image_gallery_1">Image Gallery 2</label>
              <input id="image_gallery_1" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 1)" accept="image/*" />
              <span>{{ errors.image_gallery && errors.image_gallery[1] }}</span>
              <div v-if="formData.image_gallery_urls[1]">
                <img :src="formData.image_gallery_urls[1]" alt="Image Gallery 2" style="max-width: 200px;">
              </div>

              <label for="image_gallery_2">Image Gallery 3</label>
              <input id="image_gallery_2" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 2)" accept="image/*" />
              <span>{{ errors.image_gallery && errors.image_gallery[2] }}</span>
              <div v-if="formData.image_gallery_urls[2]">
                <img :src="formData.image_gallery_urls[2]" alt="Image Gallery 3" style="max-width: 200px;">
              </div>

              <label for="image_gallery_3">Image Gallery 4</label>
              <input id="image_gallery_3" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 3)" accept="image/*" />
              <span>{{ errors.image_gallery && errors.image_gallery[3] }}</span>
              <div v-if="formData.image_gallery_urls[3]">
                <img :src="formData.image_gallery_urls[3]" alt="Image Gallery 4" style="max-width: 200px;">
              </div>

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

            <!-- Formulaire pour les univers -->
            <div v-if="currentDataType === 'universes' && modalType === 'edit'">
              <label for="name">Nom de l'univers</label>
              <input id="name" v-model="formData.name" type="text" />
              <span>{{ errors.name }}</span>

              <label for="color1">Couleur 1</label>
              <input id="color1" v-model="formData.color1" type="color" />
              <span>{{ errors.color1 }}</span>

              <label for="color2">Couleur 2</label>
              <input id="color2" v-model="formData.color2" type="color" />
              <span>{{ errors.color2 }}</span>

              <label for="colorText">Couleur du Texte</label>
              <input id="colorText" v-model="formData.colorText" type="color" />
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
                <option v-for="universe in characterUniverses" :key="universe.id" :value="universe.id">{{ universe.name }}</option>
              </select>
              <span>{{ errors.universe }}</span>
            </div>

            <div v-if="currentDataType === 'users' && modalType === 'edit'">
              <label for="first_name">Prénom</label>
              <input id="first_name" v-model="formData.first_name" type="text" />
              <span>{{ errors.first_name }}</span>

              <label for="last_name">Nom</label>
              <input id="last_name" v-model="formData.last_name" type="text" />
              <span>{{ errors.last_name }}</span>

              <label for="email">Email</label>
              <input id="email" v-model="formData.email" type="email" @blur="capitalizeEmail" />
              <span>{{ errors.email }}</span>

              <label for="phone_number">Numéro de téléphone</label>
              <input id="phone_number" v-model="formData.phone_number" type="text" />
              <span>{{ errors.phone_number }}</span>

              <label for="address.street">Rue</label>
              <input id="address.street" v-model="formData.address.street" type="text" />
              <span>{{ errors.address?.street }}</span>

              <label for="address.city">Ville</label>
              <input id="address.city" v-model="formData.address.city" type="text" />
              <span>{{ errors.address?.city }}</span>

              <label for="address.postal_code">Code Postal</label>
              <input id="address.postal_code" v-model="formData.address.postal_code" type="text" />
              <span>{{ errors.address?.postal_code }}</span>

              <label for="address.country">Pays</label>
              <input id="address.country" v-model="formData.address.country" type="text" />
              <span>{{ errors.address?.country }}</span>

              <label for="roles">Rôles</label>
              <select id="roles" v-model="formData.roles" multiple>
                <option value="ROLE_ADMIN">Administrateur</option>
                <option value="ROLE_USER">Utilisateur</option>
              </select>
              <span>{{ errors.roles }}</span>
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
import { useUserFormStore } from '../stores/userFormStore';
import useFlashMessageStore from '../composables/useFlashMessageStore';
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
    characterFormStore.setFormData({
      ...newRow,
      universe: newRow.universe?.id || newRow.universe
    });
  } else if (props.currentDataType === 'universes' && newRow) {
    universeFormStore.setFormData(newRow);
  } else if (props.currentDataType === 'products' && newRow) {
    productFormStore.setFormData({
      ...newRow,
      character: newRow.character?.id || newRow.character,
      universe: newRow.universe?.id || newRow.universe
    });
    tagsInput.value = formData.value.tags;
    if (newRow.details) {
      detailsData.dimensions = newRow.details.dimensions || '';
      detailsData.weight = newRow.details.weight || '';
      detailsData.materials = newRow.details.materials || '';
    }
  } else if (props.currentDataType === 'users' && newRow) {
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
}, { immediate: true });

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
../composables/useFlashMessageStore