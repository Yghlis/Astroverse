<template>
    <div>
      <div class="table-controls">
        <input v-model="searchQuery" placeholder="Rechercher..." />
        <button @click="exportCSV">Exporter CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" @click="sortTable(column)">
              {{ column }}
              <span>{{ sortedColumn === column ? (sortOrder === 'asc' ? '▲' : '▼') : '' }}</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td v-for="column in columns" :key="column">
              {{ renderCell(row, column) }}
            </td>
            <td>
              <button @click="view(row)">Consulter</button>
              <button @click="edit(row)">Modifier</button>
              <button @click="confirmDelete(row)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" />
      <ConfirmModal v-if="showConfirmModal" @confirm="deleteRow" @cancel="cancelDelete" />
      <EditModal v-if="showEditModal" :data="editData" :fields="editableFields" @save="updateRow" @cancel="cancelEdit" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import Pagination from './Pagination.vue';
  import ConfirmModal from '../ConfirmModal.vue';
  import EditModal from '../crud/EditModal.vue';
  
  const props = defineProps({
    data: Array,
    columns: Array,
    currentDataType: String
  });
  
  const searchQuery = ref('');
  const currentPage = ref(1);
  const rowsPerPage = ref(10);
  const sortedColumn = ref('');
  const sortOrder = ref('asc');
  const showConfirmModal = ref(false);
  const showEditModal = ref(false);
  const rowToDelete = ref(null);
  const editData = ref(null);
  const editableFields = ref([]);
  
  const filteredData = computed(() => {
    return props.data.filter(row =>
      props.columns.some(column => row[column] && row[column].toString().toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  });
  
  const sortedData = computed(() => {
    if (!sortedColumn.value) return filteredData.value;
    return [...filteredData.value].sort((a, b) => {
      if (a[sortedColumn.value] < b[sortedColumn.value]) return sortOrder.value === 'asc' ? -1 : 1;
      if (a[sortedColumn.value] > b[sortedColumn.value]) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  });
  
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value;
    return sortedData.value.slice(start, start + rowsPerPage.value);
  });
  
  const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage.value));
  
  const sortTable = (column) => {
    if (sortedColumn.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortedColumn.value = column;
      sortOrder.value = 'asc';
    }
  };
  
  const changePage = (page) => {
    currentPage.value = page;
  };
  
  const confirmDelete = (row) => {
    rowToDelete.value = row;
    showConfirmModal.value = true;
  };
  
  const deleteRow = async () => {
    const url = `http://localhost:8000/${props.currentDataType}/delete/${rowToDelete.value.id}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      props.data = props.data.filter(row => row.id !== rowToDelete.value.id);
      showConfirmModal.value = false;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };
  
  const cancelDelete = () => {
    showConfirmModal.value = false;
  };
  
  const exportCSV = () => {
    const csvContent = [
      props.columns.join(','),
      ...props.data.map(row => props.columns.map(column => row[column]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.csv';
    link.click();
  };
  
  const renderCell = (row, column) => {
    if (column === 'universe' && row[column] && typeof row[column] === 'object') {
      return row[column].name;
    }
    return row[column];
  };
  
  const view = (row) => {
    window.location.href = `/details/${row.id}`;
  };
  
  const edit = (row) => {
    if (props.currentDataType === 'universes') {
      editData.value = {
        id: row.id,
        name: row.name,
        color1: row.color1,
        color2: row.color2,
        colorText: row.colorText,
        link: row.link
      };
      editableFields.value = ['name', 'color1', 'color2', 'colorText', 'link'];
    } else if (props.currentDataType === 'products') {
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
    showEditModal.value = true;
  };
  
  const updateRow = async (updatedData) => {
    const url = `http://localhost:8000/${props.currentDataType}/update/${updatedData.id}`;
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
      const index = props.data.findIndex(row => row.id === updatedData.id);
      if (index !== -1) {
        props.data[index] = { ...props.data[index], ...updatedData };
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
  
  <style scoped>
  .table-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 0.5em;
    border: 1px solid #ccc;
    text-align: left;
    cursor: pointer;
  }
  
  th span {
    margin-left: 0.5em;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 1em;
  }
  </style>
  