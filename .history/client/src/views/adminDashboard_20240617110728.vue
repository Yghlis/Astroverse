<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <button>Utilisateurs</button>
      <button>Produits</button>
      <button>Univers</button>
      <button>Personnages</button>
      <button>Utilisateurs</button>
    </SideAdmin>
    <div class="admin-content" :class="{ active: showSideBar }">
      <h1>Tableau de Bord Administratif</h1>
      <p>Bienvenue sur votre tableau de bord, Admin!</p>
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import { ref } from "vue";

const showSideBar = ref(true);

const toggleNav = () => {
  showSideBar.value = !showSideBar.value;
};
</script>

<style lang="scss" scoped>
.admin-container {
  display: flex;
  justify-content: flex-end;
  .admin-content {
    width: 100%;
    background-color: aqua;
    height: 100vh;
    transition: all 0.3s ease;
    &.active {
      width: calc(100% - 250px);
    }
  }

}
</style>
