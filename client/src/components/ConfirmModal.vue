<template>
  <div class="modal">
    <div class="modal-content">
      <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
      <button @click="$emit('confirm')">Confirmer</button>
      <button @click="$emit('cancel')">Annuler</button>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease-out;

  p {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 20px;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:first-of-type {
      background-color: #28a745;

      &:hover {
        background-color: #218838;
      }
    }

    &:last-of-type {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

