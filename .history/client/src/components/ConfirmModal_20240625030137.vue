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
  // No script setup required as it only emits events
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>
