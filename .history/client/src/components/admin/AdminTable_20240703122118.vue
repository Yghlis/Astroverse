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
import { ref, computed, defineProps, defineEmits } from 'vue';
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
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur: ${response.status} - ${errorMessage}`);
      }
    }
    showConfirmDeleteSelectedModal.value = false;
    setFlashMessage('Suppression multiple réussie', 'success'); // Message flash de succès pour suppression multiple
    emit('row-deleted', selectedRows.value);
    selectedRows.value = [];
  } catch (error) {
    console.error('Erreur lors de la suppression:', error.message);
    setFlashMessage('Erreur lors de la suppression multiple', 'error'); // Message flash d'erreur pour suppression multiple
  }
};

<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Créer un {{ currentDataType === 'products' ? 'Produit' : currentDataType === 'universes' ? 'Univers' : currentDataType === 'characters' ? 'Personnage' : 'Utilisateur' }}
            </slot>
          </div>
          <div class="modal-body">
            <p v-if="flashMessage" class="flash-message" :class="{ 'active': flashMessage, 'success': flashMessageType === 'success', 'error': flashMessageType === 'error' }">{{ flashMessage }}</p>
            <form @submit.prevent="onSubmit" enctype="multipart/form-data">
              <!-- Formulaire pour les produits -->
              <div v-if="currentDataType === 'products'">
                <label for="title">Nom du produit</label>
                <input id="title" v-model="formData.title" type="text" />
                <span>{{ errors.title }}</span>
  
                <label for="brand">Marque</label>
                <input id="brand" v-model="formData.brand" type="text" />
                <span>{{ errors.brand }}</span>
  
                <label for="price">Prix</label>
                <input id="price" v-model="formData.price" type="text" />
                <span>{{ errors.price }}</span>
  
                <label for="is_promotion">Promotion</label>
                <input id="is_promotion" v-model="formData.is_promotion" type="checkbox" />
  
                <label for="discounted_price">Prix en promotion</label>
                <input id="discounted_price" v-model="formData.discounted_price" type="text" :disabled="!formData.is_promotion" />
                <span>{{ errors.discounted_price }}</span>
  
                <label for="description">Description</label>
                <input id="description" v-model="formData.description" type="text" />
                <span>{{ errors.description }}</span>
  
                <label for="stock">Stock</label>
                <input id="stock" v-model="formData.stock" type="number" />
                <span>{{ errors.stock }}</span>
  
                <label for="image_preview">Image Preview</label>
                <input id="image_preview" name="image_preview" type="file" @change="handleImagePreviewChange" accept="image/*" />
                <span>{{ errors.image_preview }}</span>
                <div v-if="formData.image_preview_url">
                  <img :src="formData.image_preview_url" alt="Image Preview" style="max-width: 200px;">
                </div>
  
                <label for="image_gallery_0">Image Gallery 1</label>
                <input id="image_gallery_0" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 0)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[0] }}</span>
                <div v-if="formData.image_gallery_urls[0]">
                  <img :src="formData.image_gallery_urls[0]" alt="Image Gallery 1" style="max-width: 200px;">
                </div>
  
                <label for="image_gallery_1">Image Gallery 2</label>
                <input id="image_gallery_1" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 1)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[1] }}</span>
                <div v-if="formData.image_gallery_urls[1]">
                  <img :src="formData.image_gallery_urls[1]" alt="Image Gallery 2" style="max-width: 200px;">
                </div>
  
                <label for="image_gallery_2">Image Gallery 3</label>
                <input id="image_gallery_2" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 2)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[2] }}</span>
                <div v-if="formData.image_gallery_urls[2]">
                  <img :src="formData.image_gallery_urls[2]" alt="Image Gallery 3" style="max-width: 200px;">
                </div>
  
                <label for="image_gallery_3">Image Gallery 4</label>
                <input id="image_gallery_3" name="image_gallery" type="file" @change="event => handleImageGalleryChange(event, 3)" accept="image/*" />
                <span>{{ errors.image_gallery && errors.image_gallery[3] }}</span>
                <div v-if="formData.image_gallery_urls[3]">
                  <img :src="formData.image_gallery_urls[3]" alt="Image Gallery 4" style="max-width: 200px;">
                </div>
  
                <label for="character">Personnage</label>
                <select id="character" v-model="formData.character">
                  <option v-for="character in characters" :key="character.id" :value="character.id">{{ character.name }}</option>
                </select>
                <span>{{ errors.character }}</span>
  
                <label for="universe">Univers</label>
                <select id="universe" v-model="formData.universe">
                  <option v-for="universe in universes" :key="universe.id" :value="universe.id">{{ universe.name }}</option>
                </select>
                <span>{{ errors.universe }}</span>
  
                <label for="reference">Référence</label>
                <input id="reference" v-model="formData.reference" type="text" />
                <span>{{ errors.reference }}</span>
  
                <label for="dimensions">Dimensions</label>
                <input id="dimensions" v-model="detailsData.dimensions" type="text" />
                <span>{{ errors.details?.dimensions }}</span>
  
                <label for="weight">Poids</label>
                <input id="weight" v-model="detailsData.weight" type="text" />
                <span>{{ errors.details?.weight }}</span>
  
                <label for="materials">Matériaux</label>
                <input id="materials" v-model="detailsData.materials" type="text" />
                <span>{{ errors.details?.materials }}</span>
  
                <label for="tags">Tags</label>
                <input id="tags" v-model="tagsInput" type="text" @change="updateTags" />
                <span>{{ errors.tags }}</span>
              </div>
  
              
              <!-- Formulaire pour les univers -->
<div v-if="currentDataType === 'universes'">
  <label for="name">Nom de l'univers</label>
  <input id="name" v-model="formData.name" type="text" />
  <span>{{ errors.name }}</span>

  <label for="color1">Couleur 1</label>
  <input id="color1" v-model="formData.color1" type="color" />
  <span>{{ errors.color1 }}</span>

  <label for="color2">Couleur 2</label>
  <input id="color2" v-model="formData.color2" type="color" />
  <span>{{ errors.color2 }}</span>

  <label for="colorText">Couleur du Texte</label>
  <input id="colorText" v-model="formData.colorText" type="color" />
  <span>{{ errors.colorText }}</span>

  <label for="link">Lien</label>
  <input id="link" v-model="formData.link" type="text" />
  <span>{{ errors.link }}</span>
</div>

  
              <!-- Formulaire pour les personnages -->
              <div v-if="currentDataType === 'characters'">
                <label for="name">Nom du personnage</label>
                <input id="name" v-model="formData.name" type="text" />
                <span>{{ errors.name }}</span>
  
                <label for="universe">Univers</label>
                <select id="universe" v-model="formData.universe">
                  <option v-for="universe in universes" :key="universe.id" :value="universe.id">{{ universe.name }}</option>
                </select>
                <span>{{ errors.universe }}</span>
              </div>
  
              <!-- Formulaire pour les utilisateurs -->
              <div v-if="currentDataType === 'users'">
                <label for="first_name">Prénom</label>
                <input id="first_name" v-model="formData.first_name" type="text" />
                <span>{{ errors.first_name }}</span>
  
                <label for="last_name">Nom</label>
                <input id="last_name" v-model="formData.last_name" type="text" />
                <span>{{ errors.last_name }}</span>
  
                <label for="email">Email</label>
                <input id="email" v-model="formData.email" type="email" />
                <span>{{ errors.email }}</span>
  
                <label for="password_hash">Mot de passe</label>
                <input id="password_hash" v-model="formData.password_hash" type="password" />
                <span>{{ errors.password_hash }}</span>
  
                <label for="phone_number">Numéro de téléphone</label>
                <input id="phone_number" v-model="formData.phone_number" type="text" />
                <span>{{ errors.phone_number }}</span>
  
                <label for="address">Adresse</label>
                <input id="address.street" v-model="formData.address.street" type="text" placeholder="Rue" />
                <input id="address.city" v-model="formData.address.city" type="text" placeholder="Ville" />
                <input id="address.postal_code" v-model="formData.address.postal_code" type="text" placeholder="Code Postal" />
                <input id="address.country" v-model="formData.address.country" type="text" placeholder="Pays" />
                <span>{{ errors.address }}</span>
  
                <label for="roles">Rôles</label>
                <select id="roles" v-model="formData.roles" multiple>
                  <option value="ROLE_ADMIN">Administrateur</option>
                  <option value="ROLE_USER">Utilisateur</option>
                </select>
                <span>{{ errors.roles }}</span>
  
         
              </div>
  
              <button type="submit" :disabled="isSubmitting">Soumettre</button>
            </form>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              Default Footer
              <button class="modal-default-button" @click="$emit('close')">Fermer</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUniverseFormStore } from '../stores/universeFormStore';
  import { useProductFormStore } from '../stores/productFormStore';
  import { useCharacterFormStore } from '../stores/characterFormStore';
  import { useUserFormStore } from '../stores/userFormStore';
  import useFlashMessageStore from '../stores/useFlashMessageStore';

  import { ref, computed, onMounted, reactive } from 'vue';
  
  const universeFormStore = useUniverseFormStore();
  const productFormStore = useProductFormStore();
  const characterFormStore = useCharacterFormStore();
  const userFormStore = useUserFormStore();
  const { flashMessage, flashMessageType } = useFlashMessageStore();

  
  const props = defineProps({
    currentDataType: String,
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: 'auto'
    }
  });
  
  const formData = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.formData;
    if (props.currentDataType === 'products') return productFormStore.formData;
    if (props.currentDataType === 'characters') return characterFormStore.formData;
    if (props.currentDataType === 'users') return userFormStore.formData;
  });
  
  const errors = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.errors;
    if (props.currentDataType === 'products') return productFormStore.errors;
    if (props.currentDataType === 'characters') return characterFormStore.errors;
    if (props.currentDataType === 'users') return userFormStore.errors;
  });
  
  const isSubmitting = computed(() => {
    if (props.currentDataType === 'universes') return universeFormStore.isSubmitting;
    if (props.currentDataType === 'products') return productFormStore.isSubmitting;
    if (props.currentDataType === 'characters') return characterFormStore.isSubmitting;
    if (props.currentDataType === 'users') return userFormStore.isSubmitting;
  });
  
  const universes = computed(() => {
    if (props.currentDataType === 'products' || props.currentDataType === 'characters') {
      return props.currentDataType === 'products' ? productFormStore.universes : characterFormStore.universes;
    }
    return [];
  });
  
  const characters = computed(() => {
    return productFormStore.characters;
  });
  
  const tagsInput = ref('');
  const detailsData = reactive({
    dimensions: '',
    weight: '',
    materials: ''
  });
  
  const updateTags = () => {
    formData.value.tags = tagsInput.value.split(',').map(tag => tag.trim());
  };
  
  const handleImagePreviewChange = (event) => {
    productFormStore.handleImagePreviewChange(event);
  };
  
  const handleImageGalleryChange = (event, index) => {
    productFormStore.handleImageGalleryChange(event, index);
  };
  
  const onSubmit = async () => {
  console.log('Form data before submit:', formData.value); // Debug log

  formData.value.details = {
    dimensions: detailsData.dimensions,
    weight: detailsData.weight,
    materials: detailsData.materials
  };

  let result = null;

  if (props.currentDataType === 'universes') {
    result = await universeFormStore.handleCreate();
  } else if (props.currentDataType === 'products') {
    result = await productFormStore.handleCreate();
  } else if (props.currentDataType === 'characters') {
    result = await characterFormStore.handleCreate();
  } else if (props.currentDataType === 'users') {
    result = await userFormStore.handleCreate();
  }

  if (result) {
    emit('create-success', result);
    emit('close');
  }
};

  
  onMounted(async () => {
    if (props.currentDataType === 'products' || props.currentDataType === 'characters') {
      console.log('Fetching universes and characters on modal mount...');
      if (props.currentDataType === 'products') {
        await productFormStore.fetchUniverses();
        await productFormStore.fetchCharacters();
        console.log('Universes fetched:', productFormStore.universes);
        console.log('Characters fetched:', productFormStore.characters);
      } else if (props.currentDataType === 'characters') {
        await characterFormStore.fetchUniverses();
        console.log('Universes fetched:', characterFormStore.universes);
      }
    }
  });


  const handleCreateSuccess = (newData) => {
  // Ajoutez le nouvel élément créé dans la liste des données existantes
  props.data.push(newData);
  // Rafraîchissez les données filtrées et paginées
  searchQuery.value = ''; // Réinitialiser la recherche pour afficher toutes les données
  currentPage.value = 1; // Réinitialiser à la première page
};

  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10px;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    max-width: 90%;
  }
  
  .modal-header,
  .modal-footer {
    padding-bottom: 10px;
  }
  </style>
  


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
