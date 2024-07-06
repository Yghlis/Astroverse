<template>
    <div class="loader" v-if="loading">
      <span class="material-symbols-outlined">autorenew</span>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  });
  </script>
  
  <style scoped>
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  
  .material-symbols-outlined {
    font-size: 48px;
    animation: spin 1s linear infinite;
    background-color: white;
    padding: 20px;
    border-radius: 50%;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  