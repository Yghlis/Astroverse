<template>
  <div class="container-landing">
    <h1>Find Something</h1>
    <div class="search-bar">
      <span class="material-symbols-outlined"> search </span>
      <input
        type="text"
        placeholder="Rechercher une figurine, nom du personnage ou univers"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.container-landing {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #f2f2f2;
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    .material-symbols-outlined {
      font-size: 35px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
  }
}
</style>
