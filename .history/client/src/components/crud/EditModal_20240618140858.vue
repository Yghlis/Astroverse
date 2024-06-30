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
  
  const props = defineProps({
    data: Object,
    fields: Array
  });
  
  const emit = defineEmits(['save', 'cancel']);
  
  const editableData = ref({});
  
  watch(() => props.data, (newData) => {
    editableData.value = { ...newData };
    console.log('Editable Data:', editableData.value); // Log to debug editable data
  });
  
  const inputType = (key) => {
    if (key.includes('color')) {
      return 'color';
    }
    return 'text';
  };
  
  const submitForm = () => {
    const updatedData = { ...editableData.value };
    emit('save', updatedData);
  };
  
  const cancel = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .modal {
    display: block; 
    position: fixed; 
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); 
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; 
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
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
  