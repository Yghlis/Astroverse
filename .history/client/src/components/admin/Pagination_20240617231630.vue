<template>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="$emit('change-page', currentPage - 1)">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="$emit('change-page', currentPage + 1)">Suivant</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number,
    },
  };
  </script>
  
  <style scoped>
  button {
    margin: 0 0.5em;
  }
  </style>
  