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
    height:Pour adapter le composant `ModalCreate.vue` afin de gérer correctement les rôles et les erreurs associées, ainsi que pour vous assurer que les champs obligatoires sont bien pris en compte, suivez les étapes ci-dessous.
  
  ### Adaptation du store `userFormStore`
  
  Assurez-vous que le champ `roles` est bien initialisé comme un tableau vide et validé correctement :
  
  ```javascript
  import { defineStore } from 'pinia';
  import { reactive, ref } from 'vue';
  import { z } from 'zod';
  
  export const useUserFormStore = defineStore('userForm', () => {
    const initialData = {
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password_hash: '',
      phone_number: '',
      address: {
        street: '',
        city: '',
        postal_code: '',
        country: ''
      },
      roles: [], // Initialize as an empty array
    };
  
    const schema = z.object({
      first_name: z.string().nonempty('Le prénom est requis'),
      last_name: z.string().nonempty('Le nom est requis'),
      email: z.string().email('Email invalide'),
      password_hash: z.string().nonempty('Le mot de passe est requis'),
      phone_number: z.string().optional(),
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        postal_code: z.string().optional(),
        country: z.string().optional()
      }).optional(),
      roles: z.array(z.string()).nonempty('Au moins un rôle est requis'), // Validation for roles
    });
  
    const formData = reactive({ ...initialData });
    const errors = reactive({});
    const isSubmitting = ref(false);
    const httpError = ref(null);
  
    function setFormData(data) {
      console.log('Setting form data:', data);
      Object.assign(formData, data);
      console.log('Form data after setting:', formData);
    }
  
    function validate() {
      try {
        schema.parse(formData);
        Object.keys(errors).forEach(key => delete errors[key]);
      } catch (e) {
        e.errors.forEach(err => {
          errors[err.path[0]] = err.message;
        });
      }
    }
  
    async function handleSubmit() {
      validate();
      if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors);
        return;
      }
      isSubmitting.value = true;
      try {
        const url = `http://localhost:8000/users/${formData.user_id}`;
        const method = 'PUT';
  
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(`Erreur: ${response.status} - ${errorMessage.error}`);
        }
  
        const responseData = await response.json();
        console.log('API response:', responseData);
      } catch (error) {
        httpError.value = error.message;
        console.log('HTTP error:', httpError.value);
      } finally {
        isSubmitting.value = false;
      }
    }
  
    async function handleCreate() {
      validate();
      if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors);
        return;
      }
      isSubmitting.value = true;
      try {
        const url = 'http://localhost:8000/users';
        const method = 'POST';
  
        // Ajouter isEmailVerified et mustChangePassword
        const dataToSend = {
          ...formData,
          isEmailVerified: true,
          mustChangePassword: true
        };
  
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
  
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(`Erreur: ${response.status} - ${errorMessage.error}`);
        }
  
        const responseData = await response.json();
        console.log('API response:', responseData);
      } catch (error) {
        httpError.value = error.message;
        console.log('HTTP error:', httpError.value);
      } finally {
        isSubmitting.value = false;
      }
    }
  
    return {
      formData,
      errors,
      isSubmitting,
      httpError,
      setFormData,
      validate,
      handleSubmit,
      handleCreate
    };
  });
  