<template>
    <div v-if="isFullscreen" class="overlay" @click="closeFullscreen">
      <img :src="imageSrc" alt="Fullscreen Image" class="fullscreen-image" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { defineEmits } from 'vue';
  
  // Définir les props
  const props = defineProps({
    imageSrc: {
      type: String,
      required: true,
      default: '',
    },
    isFullscreen : {
      type: Boolean,
      default: false,
    }
  });
 
  
const emit = defineEmits(['update:isFullscreen']);

// Fonction pour fermer le mode plein écran
const closeFullscreen = () => {
  emit('update:isFullscreen', false);
};
  </script>
  
  <style lang="scss" scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: pointer;
  }
  
  .fullscreen-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
  </style>
  