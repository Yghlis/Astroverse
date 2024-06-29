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
      <EditModal v-if="showEditModal" :data="editData" :fields="editableFields" @save="updateRow" @cancel="cancelEdit" :show="showEditModal" />
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import AdminTable from '../components/admin/AdminTable.vue';
import EditModal from '../components/crud/EditModal.vue';
import { ref } from "vue";

const showSideBar = ref(true);
const tableData = ref([]);
const tableColumns = ref([]);
const currentDataType = ref('');
const showEditModal = ref(false);
const editData = ref({});
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
      columns = ['title', 'brand', 'price', 'discounted_price', 'character', 'universe', 'reference'];
      break;
    case 'universes':
      url = 'http://localhost:8000/universes';
      columns = ['name', 'color1', 'color2', 'colorText', 'link'];
      break;
    case 'characters':
      url = 'http://localhost:8000/characters';
      columns = ['name', 'universe'];
      break;
    case 'users':
      url = 'http://localhost:8000/users';
      columns = ['username', 'email', 'role'];
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
    tableColumns.value = columns;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
};

const handleEdit = async (row) => {
  if (currentDataType.value === 'universes') {
    const response = await fetch(`http://localhost:8000/universes/${row.id}`);
    const data = await response.json();
    editData.value = {
      id: data.id,
      name: data.name,
      color1: data.color1,
      color2: data.color2,
      colorText: data.colorText,
      link: data.link
    };
    editableFields.value = ['name', 'color1', 'color2', 'colorText', 'link'];
  } else if (currentDataType.value === 'products') {
    const response = await fetch(`http://localhost:8000/products/${row.id}`);
    const data = await response.json();
    editData.value = {
      id: data.id,
      title: data.title,
      brand: data.brand,
      price: data.price,
      discounted_price: data.discounted_price,
      is_promotion: data.is_promotion,
      description: data.description,
      stock: data.stock,
      number_of_purchases: data.number_of_purchases,
      number_of_favorites: data.number_of_favorites,
      rating: data.rating,
      image_preview: data.image_preview,
      image_gallery: data.image_gallery,
      character: data.character,
      universe: data.universe,
      reference: data.reference,
      details: data.details,
      tags: data.tags,
      availability_status: data.availability_status,
      views_count: data.views_count
    };
    editableFields.value = ['title', 'brand', 'price', 'discounted_price', 'is_promotion', 'description', 'stock', 'number_of_purchases', 'number_of_favorites', 'rating', 'image_preview', 'image_gallery', 'character', 'universe', 'reference', 'details', 'tags', 'availability_status', 'views_count'];
  }
  console.log('Editing Row:', editData.value);
  showEditModal.value = true;
};

const updateRow = async (updatedData) => {
  console.log("Updating Row:", updatedData);
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
