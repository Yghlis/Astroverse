<template>
    <div class="modal" v-if="show">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <h2>Modifier {{ currentDataType }}</h2>
        <form @submit.prevent="submitForm">
          <div v-for="(value, key) in formData" :key="key" class="form-group">
            <label :for="key">{{ key }}</label>
            <input v-model="formData[key]" :id="key" :name="key" type="text" />
          </div>
          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    show: Boolean,
    data: Object,
    currentDataType: String
  });
  
  const emit = defineEmits(['close', 'update']);
  
  const formData = ref({ ...props.data });
  
  watch(() => props.data, (newData) => {
    formData.value = { ...newData };
  });
  
  const close = () => {
    emit('close');
  };
  
  const submitForm = () => {
    emit('update', formData.value);
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
    background-color: rgba(0, 0, 0, 0.4);
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
  
  form button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  
  form button:hover {
    background-color: #45a049;
  }
  </style>
  