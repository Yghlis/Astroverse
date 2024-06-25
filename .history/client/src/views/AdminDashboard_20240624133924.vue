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
  products: {
    title: 'Titre',
    brand: 'Marque',
    price: 'Prix',
    discounted_price: 'Prix Remisé',
    character: 'Personnage',
    universe: 'Univers',
    reference: 'Référence',
  },
  universes: {
    name: 'Nom',
    color1: 'Couleur 1',
    color2: 'Couleur 2',
    colorText: 'Couleur du Texte',
    link: 'Lien',
  },
  characters: {
    name: 'Nom',
    universe: 'Univers',
  },
  users: {
    username: 'Nom d\'Utilisateur',
    email: 'Email',
    role: 'Rôle',
  },
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

    height: 100vh;
    transition: all 0.3s ease;

    &.active {
      width: calc(100% - 250px);
    }
  }
}
</style>
