<template>
  <header>
    <div class="logo">
      <img :src="logo" alt="Logo" class="logo" />
      <h1>Astroverse</h1>
    </div>
    <NavBar />
    <button :class="['login', { active: loginClicked }]" @click="toggleLogin">
      <span class="material-symbols-outlined">{{ logIconChange }}</span>
    </button>
    <SideBar :showSideBar="loginClicked">
      <div class="log-btn-container" v-if="loginClicked">
        <RouterLink to="/login" class="log-btn">Login</RouterLink>
        <RouterLink to="/register" class="log-btn">Register</RouterLink>
      </div>
      <!-- here add le panier -->
    </SideBar>
  </header>
</template>

<script setup>
import NavBar from "./NavBar.vue";
import SideBar from "../ui/SideBar.vue";
import { computed, ref } from "vue";
import logoPath from "../assets/images/logo.png"; // Importer le logo

const logo = ref(logoPath); // Référence au chemin du logo
const loginClicked = ref(false);

const logIconChange = computed(() => {
  return loginClicked.value ? "close" : "account_circle";
});

const toggleLogin = () => {
  loginClicked.value = !loginClicked.value;
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
    &:hover,
    &.active {
      color: white;
      background-color: #f2a45a;
    }
    &:hover {
      transform: scale(1.1);
    }
    .material-symbols-outlined {
      font-size: 30px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
    &.active .material-symbols-outlined {
      transform: rotate(180deg);
    }
  }
  .log-btn-container {
    background-color: white;
    padding: 100px;
    border-radius: 15px;
box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;    .log-btn {
      display: block;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      color: black;
      font-weight: bold;
      transition: all 0.3s ease;
      &:hover {
        color: white;
        background-color: #f2a45a;
      }
    }
  }
}
</style>
