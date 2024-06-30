<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Créer un {{ currentDataType === 'products' ? 'Produit' : currentDataType === 'universes' ? 'Univers' : currentDataType === 'characters' ? 'Personnage' : 'Utilisateur' }}
            </slot>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit" enctype="multipart/form-data">
              <!-- Formulaire pour les produits -->
              <div v-if="currentDataType === 'products'">
                <label for="title">Nom du produit</label>
                <input id="title" v-model="formData.title" type="text" />
                <span>{{ errors.title }}</span>
                <!-- Autres champs pour les produits -->
              </div>
  
              <!-- Formulaire pour les univers -->
              <div v-if="currentDataType === 'universes'">
                <label for="name">Nom de l'univers</label>
                <input id="name" v-model="formData.name" type="text" />
                <span>{{ errors.name }}</span>
                <!-- Autres champs pour les univers -->
              </div>
  
              <!-- Formulaire pour les personnages -->
              <div v-if="currentDataType === 'characters'">
                <label for="name">Nom du personnage</label>
                <input id="name" v-model="formData.name" type="text" />
                <span>{{ errors.name }}</span>
                <!-- Autres champs pour les personnages -->
              </div>
  
              <!-- Formulaire pour les utilisateurs -->
              <div v-if="currentDataType === 'users'">
                <label for="first_name">Prénom</label>
                <input id="first_name" v-model="formData.first_name" type="text" />
                <span>{{ errors.first_name }}</span>
  
                <label for="last_name">Nom</label>
                <input id="last_name" v-model="formData.last_name" type="text" />
                <span>{{ errors.last_name }}</span>
  
                <label for="email">Email</label>
                <input id="email" v-model="formData.email" type="email" />
                <span>{{ errors.email }}</span>
  
                <label for="password_hash">Mot de passe</label>
                <input id="password_hash" v-model="formData.password_hash" type="password" />
                <span>{{ errors.password_hash }}</span>
  
                <label for="phone_number">Numéro de téléphone</label>
                <input id="phone_number" v-model="formData.phone_number" type="text" />
                <span>{{ errors.phone_number }}</span>
  
                <label for="address">Adresse</label>
                <input id="address.street" v-model="formData.address.street" type="text" placeholder="Rue" />
                <input id="address.city" v-model="formData.address.city" type="text" placeholder="Ville" />
                <input id="address.postal_code" v-model="formData.address.postal_code" type="text" placeholder="Code Postal" />
                <input id="address.country" v-model="formData.address.country" type="text" placeholder="Pays" />
                <span>{{ errors.address }}</span>
  
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
  import { useProductFormStore } from '../stores/productFormStore';
  import { useCharacterFormStore } from '../stores/characterFormStore';
  import { useUserFormStore } from '../stores/userFormStore';
  import { ref, computed, onMounted, reactive } from 'vue';
  
  const universeFormStore = useUniverseFormStore();
  const productFormStore = useProductFormStore();
  const characterFormStore = useCharacterFormStore();
  const userFormStore = useUserFormStore();
  
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
    if (props.currentDataType === 'users') return userFormStore.formData;
  });
  
  const errors = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.errors;
    if (props.currentDataType === 'products') return productFormStore.errors;
    if (props.currentDataType === 'characters') return characterFormStore.errors;
    if (props.currentDataType === 'users') return userFormStore.errors;
  });
  
  const isSubmitting = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.isSubmitting;
    if (props.currentDataType === 'products') return productFormStore.isSubmitting;
    if (props.currentDataType === 'characters') return characterFormStore.isSubmitting;
    if (props.currentDataType === 'users') return userFormStore.isSubmitting;
  });
  
  const universes = computed(() => {
    if (props.currentDataType === 'products' || props.currentDataType === 'characters') {
      return props.currentDataType === 'products' ? productFormStore.universes : characterFormStore.universes;
    }
    return [];
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
    } else if (props.currentDataType === 'users') {
      await userFormStore.handleCreate();
    }
  };
  
  onMounted(async () => {
    if (props.currentDataType === 'products' || props.currentDataType === 'characters') {
      console.log('Fetching universes and characters on modal mount...');
      if (props.currentDataType === 'products') {
        await productFormStore.fetchUniverses();
        await productFormStore.fetchCharacters();
        console.log('Universes fetched:', productFormStore.universes);
        console.log('Characters fetched:', productFormStore.characters);
      } else if (props.currentDataType === 'characters') {
        await characterFormStore.fetchUniverses();
        console.log('Universes fetched:', characterFormStore.universes);
      }
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
  