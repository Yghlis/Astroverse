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
import { ref, onMounted, watch } from "vue";
import SideAdmin from "../../ui/SideAdmin.vue";
import AdminTable from '../../components/admin/AdminTable.vue';

const showSideBar = ref(true);
const tableData = ref([]);
const tableColumns = ['title', 'brand', 'price', 'discounted_price', 'character', 'universe', 'reference'];

const toggleNav = () => {
  console.log("Toggling navigation, current state:", showSideBar.value);
  showSideBar.value = !showSideBar.value;
};

const fetchProducts = async () => {
  console.log("Fetching products...");
  try {
    const response = await fetch('http://localhost:8000/products');
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    const data = await response.json();
    const products = data.map(product => ({
      title: product.title,
      brand: product.brand,
      price: product.price,
      discounted_price: product.discounted_price || '',
      character: product.character,
      universe: product.universe,
      reference: product.reference
    }));
    console.log("Fetched products:", products);
    tableData.value = products;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
  }
};

// Logs initiaux lors de l'initialisation du composant
onMounted(() => {
  console.log("Initial showSideBar:", showSideBar.value);
  console.log("Initial tableColumns:", tableColumns);
  console.log("Initial tableData:", tableData.value);
});

// Surveillance des changements dans tableData
watch(tableData, (newValue) => {
  console.log("tableData updated:", newValue);
});

// Surveillance des changements dans showSideBar
watch(showSideBar, (newValue) => {
  console.log("showSideBar updated:", newValue);
});
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
