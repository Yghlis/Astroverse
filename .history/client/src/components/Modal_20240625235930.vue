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
                  <option v-for="universe in universes" :key="universe.id" :value="universe.name">{{ universe.name }}</option>
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
  import { ref, onMounted, watch } from 'vue';
  
  const universeFormStore = useUniverseFormStore();
  const characterFormStore = useCharacterFormStore();
  const { formData: universeFormData, errors: universeErrors, isSubmitting: universeIsSubmitting, handleSubmit: handleUniverseSubmit, setFormData: setUniverseFormData } = universeFormStore;
  const { formData: characterFormData, errors: characterErrors, isSubmitting: characterIsSubmitting, handleSubmit: handleCharacterSubmit, setFormData: setCharacterFormData, fetchUniverses, universes } = characterFormStore;
  
  const props = defineProps({
    currentDataType: String,
    modalType: String,
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: 'auto'
    }
  });
  
  watch(() => props.currentDataType, (newType) => {
    if (newType === 'characters') {
      fetchUniverses();
    }
  });
  
  const onSubmit = async () => {
    console.log('Form data before submit:', props.currentDataType === 'universes' ? universeFormData : characterFormData);
    if (props.currentDataType === 'universes') {
      await handleUniverseSubmit();
    } else if (props.currentDataType === 'characters') {
      await handleCharacterSubmit();
    }
    // Logique supplémentaire après la soumission, comme fermer la modale ou notifier l'utilisateur
    // $emit('close') pour fermer la modale si nécessaire
  };
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
  
  .modal-header, .modal-footer {
    padding-bottom: 10px;
  }
  </style>
  