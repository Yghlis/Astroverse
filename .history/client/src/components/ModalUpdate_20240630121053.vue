<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" :style="{ width: width, height: height }">
        <div class="modal-header">
          <slot name="header">Default Header</slot>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <!-- Formulaire pour les utilisateurs -->
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
import { ref, computed, watch, onMounted, reactive } from 'vue';

const universeFormStore = useUniverseFormStore();
const characterFormStore = useCharacterFormStore();
const productFormStore = useProductFormStore();
const userFormStore = useUserFormStore();

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

const capitalizeEmail = () => {
  formData.value.email = formData.value.email.charAt(0).toUpperCase() + formData.value.email.slice(1);
};

const onSubmit = async () => {
  console.log('Form data before submit:', formData.value); // Debug log

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
  } else if (props.currentDataType === 'users' && newRow) {
    console.log('Setting form data for user:', newRow); // Debug log
    userFormStore.setFormData(newRow);
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
