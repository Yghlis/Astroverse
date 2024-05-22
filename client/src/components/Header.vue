<template>
  <header>
    <div class="logo">
      <img :src="logo" alt="Logo" class="logo" />
      <h1>Astroverse</h1>
    </div>
    <NavBar />
    <button class="login" @click="toggleUser">
      <span class="material-symbols-outlined">{{ logIconChange }}</span>
    </button>
    <SideBar :showSideBar="userClicked" @update:hideSideBar="toggleUser">
      <UserDisplay :userClicked="userClicked"></UserDisplay>
      <!-- here add le panier -->
    </SideBar>
  </header>
</template>

<script setup>
import NavBar from "./NavBar.vue";
import SideBar from "../ui/SideBar.vue";
import UserDisplay from "./UserDisplay.vue";
import { computed, ref } from "vue";
import logoPath from "../assets/images/logo.png"; // Importer le logo

const logo = ref(logoPath); // Référence au chemin du logo
const userClicked = ref(false);

const logIconChange = computed(() => {
  return userClicked.value ? "close" : "account_circle";
});

const toggleUser = () => {
  userClicked.value = !userClicked.value;
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  font-family: "Nippo", sans-serif;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100px;
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
  .login {
    position: relative;
    cursor: pointer;
    color: black;
    background-color: white;
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 100%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: white;
      background-color: #f2a45a;
      transform: scale(1.1);
    }
    .material-symbols-outlined {
      font-size: 30px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
  }
}
</style>
