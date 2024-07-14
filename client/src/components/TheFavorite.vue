<template>
    <h2>Favorite</h2>
  </template>
  
  <script setup>

  const emit = defineEmits(["update:hideFavoriteSideBar"]);
  
  const toggle = () => {
    emit("update:hideFavoriteSideBar", false);
  };
  </script>
  
  <style lang="scss" scoped>
  .material-symbols-outlined {
    font-size: 150px;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
    transition: transform 0.5s ease;
    text-align: center;
    width: 100%;
  }
  
  h2 {
    text-align: center;
    font-size: 2rem;
    margin: 0;
  }
  
  
  </style>
  