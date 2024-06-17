<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <button @click="showCategory('utilisateurs')">Utilisateurs</button>
      <button @click="showCategory('produits')">Produits</button>
      <button @click="showCategory('univers')">Univers</button>
      <button @click="showCategory('personnages')">Personnages</button>
      <button @click="showCategory('mail')">Mail</button>
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
const currentCategory = ref('utilisateurs'); // Par défaut 'utilisateurs'

const toggleNav = () => {
  showSideBar.value = !showSideBar.value;
};

// Données brutes pour chaque catégorie
const dataUtilisateurs = [
  { id: 1, nom: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, nom: 'Bob', email: 'bob@example.com', role: 'User' },
  // Ajoutez plus de données ici
];

const dataProduits = [
  { id: 1, nom: 'Produit A', prix: 10, stock: 100 },
  { id: 2, nom: 'Produit B', prix: 20, stock: 200 },
  // Ajoutez plus de données ici
];

const dataUnivers = [
  { id: 1, nom: 'Univers 1', description: 'Description de l\'Univers 1' },
  { id: 2, nom: 'Univers 2', description: 'Description de l\'Univers 2' },
  // Ajoutez plus de données ici
];

const dataPersonnages = [
  { id: 1, nom: 'Personnage 1', univers: 'Univers 1' },
  { id: 2, nom: 'Personnage 2', univers: 'Univers 2' },
  // Ajoutez plus de données ici
];

// Colonnes pour chaque catégorie
const columnsUtilisateurs = ['nom', 'email', 'role'];
const columnsProduits = ['nom', 'prix', 'stock'];
const columnsUnivers = ['nom', 'description'];
const columnsPersonnages = ['nom', 'univers'];

// État des données et colonnes affichées
const tableData = ref(dataUtilisateurs);
const tableColumns = ref(columnsUtilisateurs);

// Méthode pour changer de catégorie
const showCategory = (category) => {
  currentCategory.value = category;
  switch (category) {
    case 'utilisateurs':
      tableData.value = dataUtilisateurs;
      tableColumns.value = columnsUtilisateurs;
      break;
    case 'produits':
      tableData.value = dataProduits;
      tableColumns.value = columnsProduits;
      break;
    case 'univers':
      tableData.value = dataUnivers;
      tableColumns.value = columnsUnivers;
      break;
    case 'personnages':
      tableData.value = dataPersonnages;
      tableColumns.value = columnsPersonnages;
      break;
    case 'mail':
      // Ajoutez la logique pour la catégorie "mail" ici
      break;
    default:
      tableData.value = [];
      tableColumns.value = [];
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
