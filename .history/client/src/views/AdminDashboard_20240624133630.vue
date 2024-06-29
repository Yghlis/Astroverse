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
      <AdminTable :data="tableData" :columns="tableColumns" :currentDataType="currentDataType" @edit="handleEdit" />
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import AdminTable from '../components/admin/AdminTable.vue';
import { ref } from "vue";

const showSideBar = ref(true);
const tableData = ref([]);
const tableColumns = ref([]);
const currentDataType = ref('');

const columnMappings = {
  products: [
    { display: 'Titre', key: 'title' },
    { display: 'Marque', key: 'brand' },
    { display: 'Prix', key: 'price' },
    { display: 'Prix Remisé', key: 'discounted_price' },
    { display: 'Personnage', key: 'character' },
    { display: 'Univers', key: 'universe' },
    { display: 'Référence', key: 'reference' },
  ],
  universes: [
    { display: 'Nom', key: 'name' },
    { display: 'Couleur 1', key: 'color1' },
    { display: 'Couleur 2', key: 'color2' },
    { display: 'Couleur du Texte', key: 'colorText' },
    { display: 'Lien', key: 'link' },
  ],
  characters: [
    { display: 'Nom', key: 'name' },
    { display: 'Univers', key: 'universe' },
  ],
  users: [
    { display: 'Nom d\'Utilisateur', key: 'username' },
    { display: 'Email', key: 'email' },
    { display: 'Rôle', key: 'role' },
  ],
};

const toggleNav = (newState) => {
  showSideBar.value = newState;
};

const fetchData = async (type) => {
  let url = '';

  switch (type) {
    case 'products':
      url = 'http://localhost:8000/products';
      break;
    case 'universes':
      url = 'http://localhost:8000/universes';
      break;
    case 'characters':
      url = 'http://localhost:8000/characters';
      break;
    case 'users':
      url = 'http://localhost:8000/users';
      break;
    default:
      return;
  }

  currentDataType.value = type;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    const data = await response.json();
    tableData.value = data;
    tableColumns.value = columnMappings[type];
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
};

const handleEdit = async (row) => {
  if (currentDataType.value === 'universes') {
    const response = await fetch(`http://localhost:8000/universes/${row.id}`);
    const data = await response.json();
    console.log('Editing Row:', data);
  } else if (currentDataType.value === 'products') {
    const response = await fetch(`http://localhost:8000/products/${row.id}`);
    const data = await response.json();
    console.log('Editing Row:', data);
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
