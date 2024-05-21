<template>
  <header>
    <div class="logo">
      <img :src="logo" alt="Logo" class="logo" />
      <h1>Astroverse</h1>
    </div>
    <NavBar />
    <h2>LOGIN</h2>
  </header>
</template>

<script setup>
import NavBar from "./NavBar.vue";
import { ref } from "vue";
import logoPath from "../assets/images/logo.png"; // Importer le logo

const logo = ref(logoPath); // Référence au chemin du logo
</script>

<style lang="scss" scoped>
header {
  font-family: "Nippo", sans-serif;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  .logo {
    display: flex;
    align-items: center;
    h1 {
      font-size: 2rem;
      color: #f2a45a;
    }
    img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
