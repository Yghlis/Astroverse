<template>
  <nav>
    <button
      @click="toggleMenu"
      class="hamburger"
      :class="{ active: isMenuOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="menu" :class="{ open: isMenuOpen }">
      <RouterLink
        @click="toggleMenu"
        to="/"
        :class="{ active: $route.path === '/' }"
        >Accueil</RouterLink
      >
      <RouterLink
        @click="toggleMenu"
        to="/shop"
        :class="{ active: $route.path === '/shop' }"
        >Boutique</RouterLink
      >
      <RouterLink
        @click="toggleMenu"
        v-if="isAdmin || isStoreKeeper"
        to="/admin"
        :class="{ active: $route.path === '/admin' }"
        >Administration</RouterLink
      >
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

onMounted(() => {
  userStore.checkAdmin();
});

const isMenuOpen = ref(false);

const isAdmin = computed(() => userStore.isAdmin);
const isStoreKeeper = computed(() => userStore.isStoreKeeper);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style lang="scss" scoped>
nav {
  background-color: white;
  font-family: "Montserrat", sans-serif;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    span {
      width: 30px;
      height: 3px;
      background-color: black;
      transition: all 0.3s ease;
    }
    &.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    &.active span:nth-child(2) {
      opacity: 0;
    }
    &.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
  .menu {
    display: flex;
    gap: 20px;
    transition: all 0.3s ease;
    @media (max-width: 1024px) {
      display: block;
      position: absolute;
      top: 100px;
      left: 0;
      height: 0;
      background-color: white;
      overflow: hidden;
      flex-direction: column;
      width: 100%;
      &.open {
        height: 100vh;
      }
    }
    a {
      color: black;
      font-size: 25px;
      font-weight: bold;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      &:hover,
      &.active {
        color: white;
        background-color: black;
      }
      .material-symbols-outlined {
        font-size: 22px;
        font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      }
      @media (max-width: 1024px) {
        font-size: 42px;
        padding: 3rem 0;
      }
    }
  }
}
@media (max-width: 1024px) {
  nav {
    .hamburger {
      display: flex;
    }
  }
}
</style>
