<template>
  <div>
    <div class="table-controls">
      <input v-model="searchQuery" placeholder="Rechercher..." />
      <button @click="exportCSV">Exporter CSV</button>
      <button @click="openCreateModal">Créer</button>
      <button @click="confirmDeleteSelected" :disabled="!selectedRows.length">Supprimer sélection</button>
    </div>
    <p v-if="flashMessage" class="flash-message" :class="{ 'active': flashMessage, 'success': flashMessageType === 'success', 'error': flashMessageType === 'error' }">{{ flashMessage }}</p>
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
          </th>
          <th v-for="column in columns" :key="column" @click="sortTable(column)">
            {{ column }}
            <span>{{ sortedColumn === column ? (sortOrder === 'asc' ? '▲' : '▼') : '' }}</span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="row in paginatedData" :key="row.id">
    <td>
      <input type="checkbox" :value="row.id" v-model="selectedRows" />
    </td>
    <td v-for="column in columns" :key="column">
      <div v-if="['color1', 'color2', 'colorText'].includes(column)" class="color-cell">
        <span :style="{ backgroundColor: row[column], display: 'inline-block', width: '20px', height: '20px', marginRight: '10px' }"></span>
        {{ renderCell(row, column) }}
      </div>
      <div v-else>
        {{ renderCell(row, column) }}
      </div>
    </td>
    <td>
      <button @click="openModal('view', row)">Consulter</button>
      <button @click="openModal('edit', row)">Modifier</button>
      <button @click="confirmDelete(row)">Supprimer</button>
    </td>
  </tr>
</tbody>
    </table>
    <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" />
    <ConfirmModal v-if="showConfirmModal" @confirm="deleteRow" @cancel="cancelDelete" />
    <ConfirmModal v-if="showConfirmDeleteSelectedModal" @confirm="deleteSelectedRows" @cancel="cancelDeleteSelected" />

    <div class="table-controls">
      <button @click="openCreateModal">Créer</button>
      <button @click="confirmDeleteSelected" :disabled="!selectedRows.length">Supprimer sélection</button>
    </div>

    <Modal v-if="showModal" @close="closeModal" :currentDataType="currentDataType" :modalType="modalType" :selectedRow="selectedRow" :width="'90%'" :height="'auto'">
  <template #header>
    <h3>{{ modalType === 'edit' ? 'Modifier' : 'Consulter' }}</h3>
  </template>
</Modal>


    <ModalCreate v-if="showCreateModal" @close="closeCreateModal" :currentDataType="currentDataType" :width="'90%'" :height="'auto'">
      <template #header>
        <h3>Créer</h3>
      </template>
    </ModalCreate>

    <ModalConsult v-if="showConsultModal" @close="closeConsultModal" :currentDataType="currentDataType" :selectedRow="selectedRow" :width="'90%'" :height="'auto'">
      <template #header>
        <h3>Consulter</h3>
      </template>
    </ModalConsult>
  </div>
</template>



<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import Pagination from './Pagination.vue';
import ConfirmModal from '../ConfirmModal.vue';
import Modal from '../ModalUpdate.vue';
import ModalCreate from '../ModalCreate.vue';
import ModalConsult from '../ModalConsult.vue';
import { useUniverseFormStore } from '../../stores/universeFormStore';
import { useCharacterFormStore } from '../../stores/characterFormStore';
import { useProductFormStore } from '../../stores/productFormStore';
import useFlashMessageStore from '../../stores/useFlashMessageStore';

const props = defineProps({
  data: Array,
  columns: Array,
  currentDataType: String
});

const emit = defineEmits(['edit', 'view', 'row-deleted']);

const searchQuery = ref('');
const currentPage = ref(1);
const rowsPerPage = ref(10);
const sortedColumn = ref('');
const sortOrder = ref('asc');
const showConfirmModal = ref(false);
const rowToDelete = ref(null);
const showModal = ref(false);
const showCreateModal = ref(false);
const showConsultModal = ref(false);
const modalType = ref('');
const selectedRow = ref(null);
const selectedRows = ref([]);
const universes = ref([]);
const showConfirmDeleteSelectedModal = ref(false);

const universeFormStore = useUniverseFormStore();
const characterFormStore = useCharacterFormStore();
const productFormStore = useProductFormStore();
const { flashMessage, flashMessageType, setFlashMessage } = useFlashMessageStore();

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

const allSelected = computed(() => selectedRows.value.length === paginatedData.value.length && paginatedData.value.length > 0);

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
  const url = `http://localhost:8000/${props.currentDataType}/${rowToDelete.value.id}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
    }
    showConfirmModal.value = false;
    setFlashMessage('Suppression réussie', 'success'); 
    emit('row-deleted', rowToDelete.value.id);
    selectedRows.value = selectedRows.value.filter(id => id !== rowToDelete.value.id);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error.message);
    setFlashMessage('Erreur lors de la suppression', 'error'); 
  }
};

const fetchUniverses = async () => {
  try {
    const response = await fetch('http://localhost:8000/universes', {
      method: 'GET'
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
    }
    const data = await response.json();
    universes.value = data;
  } catch (error) {
    console.error('Erreur lors du chargement des univers:', error.message);
  }
};

onMounted(() => {
  fetchUniverses();
  console.log('Universes after fetching:', universes.value);
});

const cancelDelete = () => {
  showConfirmModal.value = false;
};

const confirmDeleteSelected = () => {
  showConfirmDeleteSelectedModal.value = true;
};

const deleteSelectedRows = async () => {
  try {
    for (const id of selectedRows.value) {
      const url = `http://localhost:8000/${props.currentDataType}/${id}`;
      const response = await fetch(url, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
      }
    }
    showConfirmDeleteSelectedModal.value = false;
    setFlashMessage('Suppression multiple réussie', 'success'); 
    emit('row-deleted', selectedRows.value);
    selectedRows.value = [];
  } catch (error) {
    console.error('Erreur lors de la suppression:', error.message);
    setFlashMessage('Erreur lors de la suppression multiple', 'error'); 
  }
};

const cancelDeleteSelected = () => {
  showConfirmDeleteSelectedModal.value = false;
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = paginatedData.value.map(row => row.id);
  }
};

const exportCSV = () => {
  const csvContent = [
    props.columns.join(','),  // Les en-têtes de colonnes
    ...props.data.map(row => 
      props.columns.map(column => {
        if (column === 'character' && row[column]) {
          return row[column].name || '';
        }
        if (column === 'universe' && row[column]) {
          const universeId = row[column].id || row[column];
          const universe = universes.value.find(u => u.id === universeId);
          const universeName = universe ? universe.name : 'Unknown Universe';
          console.log(`Universe name for row ${row.id}: ${universeName}`);
          return universeName;
        }
        return row[column];
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'export.csv';
  link.click();
};





const renderCell = (row, column) => {
  if (column === 'character' && row[column]) {
    return row[column].name;
  }
  if (column === 'universe' && row[column]) {
    console.log(`Rendering universe for row ${row.id}:`, row[column]);
    const universeId = row[column].id || row[column]; // Ajustement ici
    const universe = universes.value.find(u => u.id === universeId);
    if (universe) {
      return universe.name;
    } else {
      console.warn(`No universe found for row ${row.id} with universe ID ${universeId}`);
      return 'Unknown Universe';
    }
  }
  return row[column];
};


const openModal = (type, row) => {
  modalType.value = type;
  selectedRow.value = row;
  if (type === 'view') {
    showConsultModal.value = true;
  } else if (type === 'edit') {
    if (props.currentDataType === 'universes') {
      universeFormStore.setFormData(row);
    } else if (props.currentDataType === 'characters') {
      characterFormStore.setFormData(row);
    } else if (props.currentDataType === 'products') {
      productFormStore.setFormData(row);
    }
    showModal.value = true;
  }
};


const closeModal = () => {
  showModal.value = false;
};

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const closeConsultModal = () => {
  showConsultModal.value = false;
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
}

th span {
  margin-left: 0.5em;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1em;
}

.flash-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  transition: opacity 0.3s ease;
}
.flash-message.success {
  background-color: #d4edda;
  color: #155724;
}
.flash-message.error {
  background-color: #f8d7da;
  color: #721c24;
}
.flash-message.active {
  opacity: 1;
}
.flash-message:not(.active) {
  opacity: 0;
}
</style>



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
}

th span {
  margin-left: 0.5em;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1em;
}

.flash-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  transition: opacity 0.3s ease;
}
.flash-message.success {
  background-color: #d4edda;
  color: #155724;
}
.flash-message.error {
  background-color: #f8d7da;
  color: #721c24;
}
.flash-message.active {
  opacity: 1;
}
.flash-message:not(.active) {
  opacity: 0;
}
</style>
