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



<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from "vue";
import Pagination from "./Pagination.vue";
import ConfirmModal from "../ConfirmModal.vue";
import Modal from "../ModalUpdate.vue";
import ModalCreate from "../ModalCreate.vue";
import ModalConsult from "../ModalConsult.vue";
import { useUniverseFormStore } from "../../stores/universeFormStore";
import { useCharacterFormStore } from "../../stores/characterFormStore";
import { useProductFormStore } from "../../stores/productFormStore";
import useFlashMessageStore from "../../composables/useFlashMessageStore";

const props = defineProps({
  data: Array,
  columns: Array,
  currentDataType: String,
});

const emit = defineEmits(["edit", "view", "row-deleted", "reload:table"]);
const apiUrl = import.meta.env.VITE_API_URL;

const searchQuery = ref("");
const currentPage = ref(1);
const rowsPerPage = ref(10);
const sortedColumn = ref("");
const sortOrder = ref("asc");
const showConfirmModal = ref(false);
const rowToDelete = ref(null);
const showModal = ref(false);
const showCreateModal = ref(false);
const showConsultModal = ref(false);
const modalType = ref("");
const selectedRow = ref(null);
const selectedRows = ref([]);
const universes = ref([]);
const showConfirmDeleteSelectedModal = ref(false);

const statusDropdownVisible = ref(null); // ID of the order for which the dropdown is visible
const newStatus = ref("");

const universeFormStore = useUniverseFormStore();
const characterFormStore = useCharacterFormStore();
const productFormStore = useProductFormStore();
const { flashMessage, flashMessageType, setFlashMessage } =
  useFlashMessageStore();

const filteredData = computed(() => {
  return props.data.filter((row) =>
    props.columns.some(
      (column) =>
        row[column] &&
        row[column]
          .toString()
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    )
  );
});

const tableTitle = computed(() => {
  if (props.currentDataType === "products") {
    return "Produits";
  } else if (props.currentDataType === "users") {
    return "Utilisateurs";
  } else if (props.currentDataType === "universes") {
    return "Univers";
  } else if (props.currentDataType === "characters") {
    return "Personnages";
  } else if (props.currentDataType === "orders") {
    return "Commandes";
  }
});

const sortedData = computed(() => {
  if (!sortedColumn.value) return filteredData.value;
  return [...filteredData.value].sort((a, b) => {
    if (a[sortedColumn.value] < b[sortedColumn.value])
      return sortOrder.value === "asc" ? -1 : 1;
    if (a[sortedColumn.value] > b[sortedColumn.value])
      return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return sortedData.value.slice(start, start + rowsPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / rowsPerPage.value)
);

const allSelected = computed(
  () =>
    selectedRows.value.length === paginatedData.value.length &&
    paginatedData.value.length > 0
);

const sortTable = (column) => {
  if (sortedColumn.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortedColumn.value = column;
    sortOrder.value = "asc";
  }
};

const changePage = (page) => {
  currentPage.value = page;
};

const confirmDelete = (row) => {
  console.log(`Confirm delete for row: ${JSON.stringify(row)}`);
  rowToDelete.value = row;
  showConfirmModal.value = true;
};

const deleteRow = async () => {
  const userId = rowToDelete.value.id || rowToDelete.value.user_id; // Try id first, then user_id
  console.log(`Deleting user with ID: ${userId}`);
  const url = `${apiUrl}/${props.currentDataType}/${userId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      const parsedError = JSON.parse(errorMessage);
      if (
        parsedError.error.includes(
          "Cannot delete universe with associated products"
        )
      ) {
        setFlashMessage(
          "Impossible de supprimer l'univers : des produits sont associés.",
          "error"
        );
      } else if (
        parsedError.error.includes(
          "Cannot delete universe with associated characters"
        )
      ) {
        setFlashMessage(
          "Impossible de supprimer l'univers : des personnages sont associés.",
          "error"
        );
      } else {
        setFlashMessage("Erreur lors de la suppression", "error");
      }
      throw new Error(`Erreur: ${response.status} - ${parsedError.error}`);
    }
    showConfirmModal.value = false;
    setFlashMessage("Suppression réussie", "success");
    emit("row-deleted", userId);
    selectedRows.value = selectedRows.value.filter((id) => id !== userId);
  } catch (error) {
    console.error("Erreur lors de la suppression:", error.message);
  }
};

const fetchUniverses = async () => {
  try {
    const response = await fetch(`${apiUrl}/universes`, {
      method: "GET",
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
    }
    const data = await response.json();
    universes.value = data;
  } catch (error) {
    console.error("Erreur lors du chargement des univers:", error.message);
  }
};

onMounted(() => {
  fetchUniverses();
  console.log("Universes after fetching:", universes.value);
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
      const url = `${apiUrl}/${props.currentDataType}/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        const parsedError = JSON.parse(errorMessage);
        if (
          parsedError.error.includes(
            "Cannot delete universe with associated products"
          )
        ) {
          setFlashMessage(
            "Impossible de supprimer l'univers : des produits sont associés.",
            "error"
          );
        } else if (
          parsedError.error.includes(
            "Cannot delete universe with associated characters"
          )
        ) {
          setFlashMessage(
            "Impossible de supprimer l'univers : des personnages sont associés.",
            "error"
          );
        } else {
          setFlashMessage("Erreur lors de la suppression multiple", "error");
        }
        throw new Error(`Erreur: ${response.status} - ${parsedError.error}`);
      }
    }
    showConfirmDeleteSelectedModal.value = false;
    setFlashMessage("Suppression multiple réussie", "success");
    emit("row-deleted", selectedRows.value);
    selectedRows.value = [];
  } catch (error) {
    console.error("Erreur lors de la suppression:", error.message);
  }
};

const cancelDeleteSelected = () => {
  showConfirmDeleteSelectedModal.value = false;
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = paginatedData.value.map((row) => row.id);
  }
};

const exportCSV = () => {
  const csvContent = [
    props.columns.join(","), // Les en-têtes de colonnes
    ...props.data.map((row) =>
      props.columns
        .map((column) => {
          if (column === "character" && row[column]) {
            return row[column].name || "";
          }
          if (column === "universe" && row[column]) {
            const universeId = row[column].id || row[column];
            const universe = universes.value.find((u) => u.id === universeId);
            const universeName = universe ? universe.name : "Unknown Universe";
            console.log(`Universe name for row ${row.id}: ${universeName}`);
            return universeName;
          }
          return row[column];
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "export.csv";
  link.click();
};

const renderCell = (row, column) => {
  if (column === "character" && row[column]) {
    return row[column].name;
  }
  if (column === "universe" && row[column]) {
    console.log(`Rendering universe for row ${row.id}:`, row[column]);
    const universeId = row[column].id || row[column];
    const universe = universes.value.find((u) => u.id === universeId);
    if (universe) {
      return universe.name;
    } else {
      console.warn(
        `No universe found for row ${row.id} with universe ID ${universeId}`
      );
      return "Unknown Universe";
    }
  }
  return row[column];
};

const adjustColor = (hex, percent) => {
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.round(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.round(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.round(b + ((255 - b) * percent) / 100));

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
};

const getClass = (cellValue, column) => {
  console.log(`Getting class for ${column} with value: ${cellValue}`);
  if (column == "price") {
    return "high-price";
  }
  if (column == "discounted_price") {
    return "low-price";
  }
  if (column == "colorText") {
    return "bordered-cell";
  }
  return "";
};

const openModal = (type, row) => {
  modalType.value = type;
  selectedRow.value = row;
  if (type === "view") {
    showConsultModal.value = true;
  } else if (type === "edit") {
    if (props.currentDataType === "universes") {
      universeFormStore.setFormData(row);
    } else if (props.currentDataType === "characters") {
      characterFormStore.setFormData(row);
    } else if (props.currentDataType === "products") {
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

const viewOrder = (row) => {
  // Logic to view order details
  console.log("Viewing order:", row);
};

const toggleStatusDropdown = (orderId) => {
  if (statusDropdownVisible.value === orderId) {
    statusDropdownVisible.value = null;
  } else {
    statusDropdownVisible.value = orderId;
  }
};

const changeOrderStatus = async (orderId) => {
  const url = `${apiUrl}/orders/${orderId}`;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ status: newStatus.value }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
    }
    setFlashMessage("Statut de la commande mis à jour avec succès", "success");
    emit("reload:table");
    statusDropdownVisible.value = null;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error.message);
    setFlashMessage("Erreur lors de la mise à jour du statut", "error");
  }
};

const downloadInvoice = (row) => {
  // Logic to download invoice
  console.log("Downloading invoice for order:", row);
};
</script>
