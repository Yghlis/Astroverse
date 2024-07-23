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






<style lang="scss" scoped>
.tab-container {
  padding: 10px;
  h1 {
    margin: 20px 0;
    font-size: 32px;
  }
  p {
    margin-top: 0px;
    margin-bottom: 20px;
    font-size: 26px;
    padding-left: 1px;
  }
  .table-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 5px;
      font-size: 14px;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #007bff;
        outline: none;
      }

      &::placeholder {
        color: #adb5bd;
      }
    }

    button {
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }

      &.export {
        background-color: #28a745;
        color: white;

        &:hover {
          background-color: #218838;
        }
      }

      &.create {
        background-color: #007bff;
        color: white;

        &:hover {
          background-color: #0056b3;
        }
      }

      &.delete {
        background-color: #dc3545;
        color: white;

        &:hover {
          background-color: #c82333;
        }

        &:disabled {
          background-color: #e0aeb2;
          cursor: not-allowed;
        }
      }
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    text-align: left;
    border: 1px solid #e5e8ed;
    border-radius: 5px;
    thead {
      background-color: #f9fafc;
      border-radius: 5px;
      th {
        padding: 13px 15px;
        color: #697387;
        border-bottom: 2px solid #e5e8ed;
        cursor: pointer;
        &:first-child {
          width: 50px;
        }
      }
    }

    tbody {
      tr {
        border-bottom: 2px solid #e5e8ed;
        &:hover {
          background-color: #f1f3f5;
        }
      }

      td {
        padding: 12px 15px;
        &:first-child {
          width: 50px;
        }

        &:nth-child(2) {
          font-weight: bold;
        }

        .color-cell {
          font-weight: bold;
          font-size: 20px;
          position: relative;
          display: inline-block;
          padding: 5px 7px;
          border-radius: 7px;
        }

        &.bordered-cell {
          span {
            border: 1px solid #ced4da;
          }
        }

        &.high-price {
          span {
            color: #38a279;
            background-color: #e2f0ec;
            font-weight: bold;
            font-size: 20px;
            position: relative;
            display: inline-block;
            padding: 5px 0;
            border-radius: 7px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3px;
            max-width: 100px;
            &::after {
              content: "€";
              font-size: 20px;
              color: #38a279;
            }
          }
        }

        &.low-price {
          span {
            color: #cb554c;
            background-color: #fdf2f1;
            font-weight: bold;
            font-size: 20px;
            position: relative;
            display: inline-block;
            padding: 5px 0;
            border-radius: 7px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3px;
            max-width: 100px;
            &::after {
              content: "€";
              font-size: 20px;
              color: #cb554c;
            }
          }
        }
      }
    }

    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      display: inline-block;
      width: 25px;
      height: 25px;
      background-color: white;
      border: 2px solid #ccc;
      border-radius: 7px;
      position: relative;
      cursor: pointer;
      transition: all 0.2s;

      &:checked {
        background-color: #2196f3;
        border-color: #2196f3;

        &::after {
          content: "";
          position: absolute;
          left: 6px;
          top: 2px;
          width: 6px;
          height: 12px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
          display: block;
        }
      }

      &::after {
        content: "";
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 12px;
        border: solid transparent;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
        transition: all 0.2s;
      }
    }

    button {
      padding: 6px 12px;
      margin: 5px 5px 5px 0;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
        color: white;
      }

      &.view {
        background-color: #007bff;
        color: white;

        &:hover {
          background-color: #0056b3;
        }
      }

      &.edit {
        background-color: #ffc107;
        color: black;

        &:hover {
          background-color: #e0a800;
        }
      }

      &.delete {
        background-color: #dc3545;
        color: white;

        &:hover {
          background-color: #c82333;
        }
      }

      &.download {
        background-color: #17a2b8;
        color: white;

        &:hover {
          background-color: #138496;
        }
      }
    }
  }
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
