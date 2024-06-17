<template>
    <div class="modal">
      <div class="modal-content">
        <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        <button @click="$emit('confirm')">Oui</button>
        <button @click="$emit('cancel')">Non</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {};
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background: white;
    padding: 1em;
    border-radius: 5px;
    text-align: center;
  }
  </style>
  