<template>
  <div class="tab-container">
    <p
      v-if="flashMessage"
      class="flash-message"
      :class="{
        active: flashMessage,
        success: flashMessageType === 'success',
        error: flashMessageType === 'error',
      }"
    >
      {{ flashMessage }}
    </p>
    <h1>Tableau de Bord des {{ tableTitle }}</h1>
    <p>
      Bienvenue sur votre tableau de bord, adminName! Vous pouvez gérer les
      {{ tableTitle }} depuis ici.
    </p>
    <div class="table-controls">
      <input v-model="searchQuery" placeholder="Rechercher..." />
      <button class="export" @click="exportCSV">Exporter CSV</button>
      <button class="create" @click="openCreateModal">Créer</button>
      <button
        class="delete"
        @click="confirmDeleteSelected"
        :disabled="!selectedRows.length"
      >
        Supprimer sélection
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              @change="toggleSelectAll"
              :checked="allSelected"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column"
            @click="sortTable(column)"
          >
            {{ column }}
            <span>{{
              sortedColumn === column ? (sortOrder === "asc" ? "▲" : "▼") : ""
            }}</span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedData" :key="row.id">
          <td>
            <input type="checkbox" :value="row.id" v-model="selectedRows" />
          </td>
          <td
            v-for="column in columns"
            :key="column"
            :class="getClass(row[column], column)"
          >
            <span
              v-if="['color1', 'color2', 'colorText'].includes(column)"
              class="color-cell"
              :style="{
                backgroundColor: adjustColor(row[column], 30),
                color: row[column],
              }"
              >{{ renderCell(row, column) }}</span
            >
            <span v-else>
              {{ renderCell(row, column) }}
            </span>
          </td>
          <td>
            <template v-if="currentDataType === 'orders'">
              <button class="view" @click="viewOrder(row)">Voir</button>
              <button class="edit" @click="toggleStatusDropdown(row.id)">Changer le status</button>
              <div v-if="row.id === statusDropdownVisible" class="status-dropdown">
                <select v-model="newStatus" @change="changeOrderStatus(row.id)">
                  <option value="En cours">En cours</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Échouée">Échouée</option>
                  <option value="Retour reçue">Retour reçue</option>
                  <option value="Remboursée">Remboursée</option>
                </select>
              </div>
              <button class="download" @click="downloadInvoice(row)">Télécharger la facture</button>
            </template>
            <template v-else>
              <button class="view" @click="openModal('view', row)">
                Consulter
              </button>
              <button class="edit" @click="openModal('edit', row)">
                Modifier
              </button>
              <button class="delete" @click="confirmDelete(row)">
                Supprimer
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change-page="changePage"
    />
    <ConfirmModal
      v-if="showConfirmModal"
      @confirm="deleteRow"
      @cancel="cancelDelete"
    />
    <ConfirmModal
      v-if="showConfirmDeleteSelectedModal"
      @confirm="deleteSelectedRows"
      @cancel="cancelDeleteSelected"
    />

    <div class="table-controls">
      <button class="create" @click="openCreateModal">Créer</button>
      <button
        class="delete"
        @click="confirmDeleteSelected"
        :disabled="!selectedRows.length"
      >
        Supprimer sélection
      </button>
    </div>

    <Modal
      v-if="showModal"
      @close="closeModal"
      :currentDataType="currentDataType"
      :modalType="modalType"
      :selectedRow="selectedRow"
      :width="'90%'"
      :height="'auto'"
    >
      <template #header>
        <h3>{{ modalType === "edit" ? "Modifier" : "Consulter" }}</h3>
      </template>
    </Modal>

    <ModalCreate
      v-if="showCreateModal"
      @close="closeCreateModal"
      :currentDataType="currentDataType"
      :width="'90%'"
      :height="'auto'"
    >
    </ModalCreate>

    <ModalConsult
      v-if="showConsultModal"
      @close="closeConsultModal"
      :currentDataType="currentDataType"
      :selectedRow="selectedRow"
      :width="'90%'"
      :height="'auto'"
    >
      <template #header>
        <h3>Consulter</h3>
      </template>
    </ModalConsult>
  </div>
</template>



