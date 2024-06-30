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
              <button @click="() => $emit('edit', row)">Modifier</button>
              <button @click="confirmDelete(row)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" />
      <ConfirmModal v-if="showConfirmModal" @confirm="deleteRow" @cancel="cancelDelete" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import Pagination from './Pagination.vue';
  import ConfirmModal from '../ConfirmModal.vue';
  
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
  const rowToDelete = ref(null);
  
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
    const start = (currentPage
  