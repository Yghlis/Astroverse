<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" :style="{ width: width, height: height }">
        <div class="modal-header">
          <slot name="header">
            Détails {{ currentDataType === 'products' ? 'du Produit' : currentDataType === 'characters' ? 'du Personnage' : currentDataType === 'universes' ? 'de l\'Univers' : 'de l\'Utilisateur' }}
          </slot>
        </div>
        <div class="modal-body">
          <div v-if="item">
            <!-- Détails de l'utilisateur -->
            <div v-if="currentDataType === 'users'">
              <p><strong>Prénom :</strong> {{ item.first_name }}</p>
              <p><strong>Nom :</strong> {{ item.last_name }}</p>
              <p><strong>Email :</strong> {{ item.email }}</p>
              <p><strong>Numéro de téléphone :</strong> {{ item.phone_number || 'non renseigné' }}</p>
              <p><strong>Rue :</strong> {{ item.address?.street || 'non renseigné' }}</p>
              <p><strong>Ville :</strong> {{ item.address?.city || 'non renseigné' }}</p>
              <p><strong>Code Postal :</strong> {{ item.address?.postal_code || 'non renseigné' }}</p>
              <p><strong>Pays :</strong> {{ item.address?.country || 'non renseigné' }}</p>
              <p><strong>Rôles :</strong> {{ item.roles?.join(', ') || 'non renseigné' }}</p>
              <p><strong>Mot de passe à changer :</strong> {{ item.mustChangePassword ? 'Oui' : 'Non' }}</p>
              <p><strong>Email vérifié :</strong> {{ item.isEmailVerified ? 'Oui' : 'Non' }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="$emit('close')">Fermer</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  currentDataType: String,
  selectedRow: Object,
  width: {
    type: String,
    default: '50%'
  },
  height: {
    type: String,
    default: 'auto'
  }
});

const item = ref(null);

const getImageUrl = (filename) => {
  return `http://localhost:8000/uploads/${filename.split('/').pop()}`;
};

onMounted(async () => {
  let url = '';
  if (props.currentDataType === 'products') {
    url = `http://localhost:8000/products/${props.selectedRow.id}`;
  } else if (props.currentDataType === 'characters') {
    url = `http://localhost:8000/characters/${props.selectedRow.id}`;
  } else if (props.currentDataType === 'universes') {
    url = `http://localhost:8000/universes/${props.selectedRow.id}`;
  } else if (props.currentDataType === 'users') {
    url = `http://localhost:8000/users/${props.selectedRow.user_id}`;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    item.value = await response.json();
    console.log('User details:', item.value);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
});
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

  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useCharacterFormStore } from '../stores/characterFormStore';
  
  const props = defineProps({
    currentDataType: String,
    selectedRow: Object,
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: 'auto'
    }
  });
  
  const item = ref(null);
  const characterFormStore = useCharacterFormStore();
  const universeName = ref('');
  
  const getImageUrl = (filename) => {
    return `http://localhost:8000/uploads/${filename.split('/').pop()}`;
  };
  
  onMounted(async () => {
    let url = '';
    if (props.currentDataType === 'products') {
      url = `http://localhost:8000/products/${props.selectedRow.id}`;
    } else if (props.currentDataType === 'characters') {
      url = `http://localhost:8000/characters/${props.selectedRow.id}`;
    } else if (props.currentDataType === 'universes') {
      url = `http://localhost:8000/universes/${props.selectedRow.id}`;
    } else if (props.currentDataType === 'users') {
      url = `http://localhost:8000/users/${props.selectedRow.user_id}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      item.value = await response.json();
      console.log('Character details:', item.value);
  
      if (props.currentDataType === 'characters' && item.value.universe) {
        await characterFormStore.fetchUniverseNameById(item.value.universe);
        universeName.value = characterFormStore.universeName;
      }
    } catch (error) {
      console.error('Erreur:', error.message);
    }
  });
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
  