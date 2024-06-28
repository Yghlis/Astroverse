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
            <button @click="openModal('view', row)">Consulter</button>
            <button @click="openModal('edit', row)">Modifier</button>
            <button @click="confirmDelete(row)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" />
    <ConfirmModal v-if="showConfirmModal" @confirm="deleteRow" @cancel="cancelDelete" />

    <!-- Utilisation de 90% de largeur pour rendre la modale responsive -->
    <Modal v-if="showModal" @close="closeModal" :width="'90%'" :height="'auto'">
      <template #header>
        <h3>{{ modalType === 'edit' ? 'Modifier' : 'Consulter' }}</h3>
      </template>
      <template #body>
        <div v-if="currentDataType === 'universes'">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <div>
              <label for="name">Nom</label>
              <input id="name" v-model="formData.name" type="text" />
              <span>{{ errors.name }}</span>
            </div>
            <div>
              <label for="color1">Couleur 1</label>
              <input id="color1" v-model="formData.color1" type="text" />
              <span>{{ errors.color1 }}</span>
            </div>
            <div>
              <label for="color2">Couleur 2</label>
              <input id="color2" v-model="formData.color2" type="text" />
              <span>{{ errors.color2 }}</span>
            </div>
            <div>
              <label for="colorText">Couleur du texte</label>
              <input id="colorText" v-model="formData.colorText" type="text" />
              <span>{{ errors.colorText }}</span>
            </div>
            <div>
              <label for="link">Lien</label>
              <input id="link" v-model="formData.link" type="text" />
              <span>{{ errors.link }}</span>
            </div>
            <button type="submit" :disabled="isSubmitting">Soumettre</button>
          </form>
        </div>
        <!-- Ajoutez d'autres formulaires pour différents types de données -->
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Pagination from './Pagination.vue';
import ConfirmModal from '../ConfirmModal.vue';
import Modal from '../Modal.vue';
import { useUniverseFormStore } from '../stores/universeFormStore';

const props = defineProps({
  data: Array,
  columns: Array,
  currentDataType: String
});

const emit = defineEmits(['edit', 'row-deleted']);

const searchQuery = ref('');
const currentPage = ref(1);
const rowsPerPage = ref(10);
const sortedColumn = ref('');
const sortOrder = ref('asc');
const showConfirmModal = ref(false);
const rowToDelete = ref(null);
const showModal = ref(false);
const modalType = ref('');
const selectedRow = ref(null);

const formStore = useUniverseFormStore();
const { formData, errors, isSubmitting, handleSubmit, setFormData } = formStore;

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
  const url = `http://localhost:8000/${props.currentDataType}/${rowToDelete.value.id}`;
  try {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
    }
    showConfirmModal.value = false;
    emit('row-deleted', rowToDelete.value.id);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error.message);
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

const openModal = (type, row) => {
  modalType.value = type;
  selectedRow.value = row;
  if (props.currentDataType === 'universes') {
    setFormData(row); // Définit les données du formulaire à partir de la ligne sélectionnée
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
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
