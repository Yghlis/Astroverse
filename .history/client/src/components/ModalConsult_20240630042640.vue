<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Détails {{ currentDataType === 'products' ? 'du Produit' : currentDataType === 'characters' ? 'du Personnage' : 'de l\'Univers' }}
            </slot>
          </div>
          <div class="modal-body">
            <div v-if="item">
              <!-- Détails du produit -->
              <div v-if="currentDataType === 'products'">
                <p><strong>Nom du produit :</strong> {{ item.title }}</p>
                <p><strong>Marque :</strong> {{ item.brand }}</p>
                <p><strong>Prix :</strong> {{ item.price }}</p>
                <p><strong>Prix en promotion :</strong> {{ item.discounted_price }}</p>
                <p><strong>Description :</strong> {{ item.description }}</p>
                <p><strong>Stock :</strong> {{ item.stock }}</p>
                <p><strong>Personnage :</strong> {{ item.character?.name }}</p>
                <p><strong>Univers :</strong> {{ item.universe?.name }}</p>
                <p><strong>Référence :</strong> {{ item.reference }}</p>
                <p><strong>Dimensions :</strong> {{ item.details?.dimensions }}</p>
                <p><strong>Poids :</strong> {{ item.details?.weight }}</p>
                <p><strong>Matériaux :</strong> {{ item.details?.materials }}</p>
                <p><strong>Tags :</strong> {{ item.tags?.join(', ') }}</p>
                <div>
                  <p><strong>Image Preview :</strong></p>
                  <img :src="item.image_preview" alt="Image Preview" style="max-width: 200px;" v-if="item.image_preview" />
                </div>
                <div>
                  <p><strong>Gallery Images :</strong></p>
                  <div v-for="(image, index) in item.image_gallery" :key="index" style="display: inline-block; margin-right: 10px;">
                    <img :src="image" :alt="'Gallery Image ' + (index + 1)" style="max-width: 100px;" />
                  </div>
                </div>
              </div>
              <!-- Détails du personnage -->
              <div v-if="currentDataType === 'characters'">
                <p><strong>Nom du personnage :</strong> {{ item.name }}</p>
                <p><strong>Univers :</strong> {{ item.universe?.name }}</p>
              </div>
              <!-- Détails de l'univers -->
              <div v-if="currentDataType === 'universes'">
                <p><strong>Nom de l'univers :</strong> {{ item.name }}</p>
                <p><strong>Couleur 1 :</strong> {{ item.color1 }}</p>
                <p><strong>Couleur 2 :</strong> {{ item.color2 }}</p>
                <p><strong>Couleur du Texte :</strong> {{ item.colorText }}</p>
                <p><strong>Lien :</strong> {{ item.link }}</p>
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
  
  onMounted(async () => {
    let url = '';
    if (props.currentDataType === 'products') {
      url = `http://localhost:8000/products/${props.selectedRow.id}`;
    } else if (props.currentDataType === 'characters') {
      url = `http://localhost:8000/characters/${props.selectedRow.id}`;
    } else if (props.currentDataType === 'universes') {
      url = `http://localhost:8000/universes/${props.selectedRow.id}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      item.value = await response.json();
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
  