<template>
  <nav>
    <RouterLink to="/" :class="{ active: $route.path === '/' }"
      >Accueil</RouterLink
    >
    <RouterLink to="/shop" :class="{ active: $route.path === '/shop' }"
      >Boutique</RouterLink
    >
    <RouterLink
      v-if="isAdmin"
      to="/admin"
      :class="{ active: $route.path === '/admin' }"
      >Administration</RouterLink
    >
  </nav>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

onMounted(() => {
  userStore.checkAdmin();
});

const isAdmin = computed(() => userStore.isAdmin);
</script>

<style lang="scss" scoped>
nav {
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
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
  }
}
</style>
