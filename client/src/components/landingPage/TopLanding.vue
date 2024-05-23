<template>
  <div class="top-landing">
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
.top-landing {
  height: 300px;
  width: 550px;
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
  }
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input {
      width: 100%;
      height: 50px;
      padding-left: 40px;
      border: none;
      border-bottom: 2px solid #f2a45a;
      font-size: 19px;
      

      &:focus {
        outline: none;
        border-bottom: 2px solid #f2a45a;
      }
    }
    .material-symbols-outlined {
      position: absolute;
      left: 5px;
      font-size: 35px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
  }
}
</style>
