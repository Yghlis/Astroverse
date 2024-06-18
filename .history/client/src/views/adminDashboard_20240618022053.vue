<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <button @click="fetchData('products')">Produits</button>
      <button @click="fetchData('users')">Utilisateurs</button>
      <button @click="fetchData('universes')">Univers</button>
      <button @click="fetchData('characters')">Personnages</button>
    </SideAdmin>
    <div class="admin-content" :class="{ active: showSideBar }">
      <h1>Tableau de Bord Administratif</h1>
      <p>Bienvenue sur votre tableau de bord, Admin!</p>
      <AdminTable :data="tableData" :columns="tableColumns" />
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import AdminTable from '../components/admin/AdminTable.vue';
import { ref } from "vue";

const showSideBar = ref(true);

const toggleNav = (newState) => {
  showSideBar.value = newState;
};

const tableData = ref([]);
const tableColumns = ref([]);

const fetchData = async (type) => {
  let url = '';
  let columns = [];

  switch (type) {
    case 'products':
      url = 'http://localhost:8000/products';
      columns = ['title', 'brand', 'price', 'discounted_price', 'character', 'universe', 'reference'];
      break;
    /*case 'users':
      url = 'http://localhost:8000/users';
      columns = ['username', 'email', 'role'];
      break;
    case 'universes':
      url = 'http://localhost:8000/universes';
      columns = ['name', 'description'];
      break;
    case 'characters':
      url = 'http://localhost:8000/characters';
      columns = ['name', 'universe', 'abilities'];
      break;*/
    default:
      return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    const data = await response.json();
    tableData.value = data;
    tableColumns.value = columns;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
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
