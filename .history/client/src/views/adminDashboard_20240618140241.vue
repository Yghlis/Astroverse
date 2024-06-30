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
      <AdminTable 
        :data="tableData" 
        :columns="tableColumns" 
        :currentDataType="currentDataType"
        @edit="edit" 
        @delete="deleteData"
      />
      <EditModal v-if="showEditModal" :data="editData" :fields="editableFields" @save="updateRow" @cancel="cancelEdit" />
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import AdminTable from '../components/admin/AdminTable.vue';
import EditModal from '../components//EditModal.vue';
import { ref } from "vue";

const showSideBar = ref(true);
const tableData = ref([]);
const tableColumns = ref([]);
const currentDataType = ref('');
const showEditModal = ref(false);
const editData = ref(null);
const editableFields = ref([]);

const toggleNav = (newState) => {
  showSideBar.value = newState;
};

const fetchData = async (type) => {
  let url = '';
  let columns = [];

  switch (type) {
    case 'products':
      url = 'http://localhost:8000/products';
      columns = ['id', 'title', 'brand', 'price', 'discounted_price', 'character', 'universe', 'reference'];
      break;
    case 'universes':
      url = 'http://localhost:8000/universes';
      columns = ['id', 'name', 'color1', 'color2', 'colorText', 'link'];
      break;
    case 'characters':
      url = 'http://localhost:8000/characters';
      columns = ['id', 'name', 'universe'];
      break;
    case 'users':
      url = 'http://localhost:8000/users';
      columns = ['id', 'username', 'email', 'role'];
      break;
    default:
      return;
  }

  currentDataType.value = type; // Mettre à jour le type de données actuel

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

const edit = (row) => {
  if (currentDataType.value === 'universes') {
    editData.value = {
      id: row.id,
      name: row.name,
      color1: row.color1,
      color2: row.color2,
      colorText: row.colorText,
      link: row.link
    };
    editableFields.value = ['name', 'color1', 'color2', 'colorText', 'link'];
  } else if (currentDataType.value === 'products') {
    editData.value = {
      id: row.id,
      title: row.title,
      brand: row.brand,
      price: row.price,
      discounted_price: row.discounted_price,
      is_promotion: row.is_promotion,
      description: row.description,
      stock: row.stock,
      number_of_purchases: row.number_of_purchases,
      number_of_favorites: row.number_of_favorites,
      rating: row.rating,
      image_preview: row.image_preview,
      image_gallery: row.image_gallery,
      character: row.character,
      universe: row.universe,
      reference: row.reference,
      details: row.details,
      tags: row.tags,
      availability_status: row.availability_status,
      views_count: row.views_count
    };
    editableFields.value = ['title', 'brand', 'price', 'discounted_price', 'is_promotion', 'description', 'stock', 'number_of_purchases', 'number_of_favorites', 'rating', 'image_preview', 'image_gallery', 'character', 'universe', 'reference', 'details', 'tags', 'availability_status', 'views_count'];
  }
  console.log(editData.value); // Ajouter une console.log pour vérifier l'ID
  showEditModal.value = true;
};

const updateRow = async (updatedData) => {
  const url = `http://localhost:8000/${currentDataType.value}/update/${updatedData.id}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    const index = tableData.value.findIndex(row => row.id === updatedData.id);
    if (index !== -1) {
      tableData.value[index] = { ...tableData.value[index], ...updatedData };
    }
    showEditModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
  }
};

const cancelEdit = () => {
  showEditModal.value = false;
};

const deleteData = async (row) => {
  // Logique pour supprimer les données
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
