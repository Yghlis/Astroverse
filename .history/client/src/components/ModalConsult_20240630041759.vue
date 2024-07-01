<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Détails du Produit
            </slot>
          </div>
          <div class="modal-body">
            <div v-if="product">
              <p><strong>Nom du produit :</strong> {{ product.title }}</p>
              <p><strong>Marque :</strong> {{ product.brand }}</p>
              <p><strong>Prix :</strong> {{ product.price }}</p>
              <p><strong>Prix en promotion :</strong> {{ product.discounted_price }}</p>
              <p><strong>Description :</strong> {{ product.description }}</p>
              <p><strong>Stock :</strong> {{ product.stock }}</p>
              <p><strong>Personnage :</strong> {{ product.character?.name }}</p>
              <p><strong>Univers :</strong> {{ product.universe?.name }}</p>
              <p><strong>Référence :</strong> {{ product.reference }}</p>
              <p><strong>Dimensions :</strong> {{ product.details?.dimensions }}</p>
              <p><strong>Poids :</strong> {{ product.details?.weight }}</p>
              <p><strong>Matériaux :</strong> {{ product.details?.materials }}</p>
              <p><strong>Tags :</strong> {{ product.tags?.join(', ') }}</p>
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
  import { useProductFormStore } from '../stores/productFormStore';
  
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
  
  const productFormStore = useProductFormStore();
  const product = ref(null);
  
  onMounted(async () => {
    if (props.currentDataType === 'products' && props.selectedRow) {
      const response = await fetch(`http://localhost:8000/products/${props.selectedRow.id}`);
      product.value = await response.json();
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
  