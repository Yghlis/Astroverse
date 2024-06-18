<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <button @click="fetchProducts">Produits</button>
      <button>Utilisateurs</button>
      <button>Univers</button>
      <button>Personnages</button>
      <button>Mail</button>
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
import axios from "axios";

const showSideBar = ref(true);

const toggleNav = () => {
  showSideBar.value = !showSideBar.value;
};

const tableData = ref([]);
const tableColumns = ['title', 'brand', 'price', 'discounted_price', 'character', 'universe', 'reference'];

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8000/products'); // Mettez l'URL correcte de votre API
    const products = response.data.map(product => ({
      title: product.title,
      brand: product.brand,
      price: product.price,
      discounted_price: product.discounted_price || '',
      character: product.character,
      universe: product.universe,
      reference: product.reference
    }));
    tableData.value = products;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
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
