<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
      <div v-for="item in stockData" :key="item.id" class="stock-item">
        <p><strong>Nom du produit:</strong> {{ item.product_name }}</p>
        <p><strong>Niveau de stock:</strong> {{ item.stock_level }}</p>
        <p><strong>Emplacement:</strong> {{ item.warehouse_location }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from "vue";
  
  const props = defineProps({
    data: Array,
  });
  
  const stockData = ref([]);
  
  watch(() => props.data, (newData) => {
    stockData.value = newData;
  }, { immediate: true });
  </script>
  
  <style scoped>
  .stock-management {
    padding: 20px;
  }
  .stock-item {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    p {
      margin: 5px 0;
      font-size: 18px;
    }
  }
  </style>
  