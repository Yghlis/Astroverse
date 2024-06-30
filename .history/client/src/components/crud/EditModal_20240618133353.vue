<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="cancel">&times;</span>
        <h2>Modifier {{ data.name || data.title }}</h2>
        <form @submit.prevent="submitForm">
          <div v-for="key in fields" :key="key" class="form-group">
            <label :for="key">{{ key }}</label>
            <input v-model="editableData[key]" :id="key" :type="inputType(key)" required />
          </div>
          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Définit les propriétés reçues du composant parent
  const props = defineProps({
    data: Object,
    fields: Array
  });
  
  // Définit les événements émis vers le composant parent
  const emit = defineEmits(['save', 'cancel']);
  
  const editableData = ref({});
  
  // Met à jour editableData lorsque props.data change
  watch(() => props.data, (newData) => {
    editableData.value = { ...newData };
  });
  
  const inputType = (key) => {
    if (key.includes('color')) {
      return 'color';
    }
    return 'text';
  };
  
  // Gère la soumission du formulaire
  const submitForm = () => {
    const updatedData = { ...editableData.value };
    emit('save', updatedData);
  };
  
  // Gère l'annulation de la modification
  const cancel = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .modal {
    display: block; /* Show the modal */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  
  .form-group {
    margin-bottom: 1em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
  }
  
  input[type="text"],
  input[type="color"],
  input[type="number"] {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  