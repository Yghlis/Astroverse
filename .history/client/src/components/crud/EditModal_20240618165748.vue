<template>
    <div class="modal" v-if="show">
      <div class="modal-content">
        <span class="close" @click="cancel">&times;</span>
        <h2>Modifier {{ data.name || data.title }}</h2>
        <form @submit.prevent="submitForm">
          <div v-for="key in fields" :key="key" class="form-group">
            <label :for="key">{{ key }}</label>
            <input v-model="editableData[key]" :id="key" type="text" required />
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
    fields: Array,
    show: Boolean
  });
  
  const emit = defineEmits(['save', 'cancel']);
  
  const editableData = ref({});
  
  watch(() => props.data, (newData) => {
    editableData.value = {
      ...newData,
      color1: newData.color1 || '#ffffff',
      color2: newData.color2 || '#ffffff',
      colorText: newData.colorText || '#000000'
    };
    console.log('Editable Data:', editableData.value);
  });
  
  const submitForm = () => {
    const updatedData = {
      ...editableData.value,
      color1: editableData.value.color1 || '#ffffff',
      color2: editableData.value.color2 || '#ffffff',
      colorText: editableData.value.colorText || '#000000'
    };
  
    // Validation des couleurs
    if (!/^#[0-9A-F]{6}$/i.test(updatedData.color1)) {
      alert("La couleur 1 doit être au format #rrggbb");
      return;
    }
    if (!/^#[0-9A-F]{6}$/i.test(updatedData.color2)) {
      alert("La couleur 2 doit être au format #rrggbb");
      return;
    }
    if (!/^#[0-9A-F]{6}$/i.test(updatedData.colorText)) {
      alert("La couleur du texte doit être au format #rrggbb");
      return;
    }
  
    console.log('Submitting Form with Data:', updatedData);
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
  