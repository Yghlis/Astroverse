<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <button>Utilisateurs</button>
      <button>Produits</button>
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

const showSideBar = ref(true);

const toggleNav = () => {
  showSideBar.value = !showSideBar.value;
};

const tableData = ref([
  { id: 1, colonne1: 'Alice', colonne2: 'Produit A', colonne3: 'Univers 1' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 3, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 4, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 5, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },
  { id: 2, colonne1: 'Bob', colonne2: 'Produit B', colonne3: 'Univers 2' },

  // Ajoutez plus de données ici
]);

const tableColumns = ['colonne1', 'colonne2', 'colonne3'];

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
