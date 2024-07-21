<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
  
      <div class="controls">
        <label for="chartSelector">Select Chart:</label>
        <select id="chartSelector" v-model="selectedChart" @change="fetchChartData">
          <option value="today">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
  
      <div class="controls">
        <label for="productSelector">Select Product:</label>
        <select id="productSelector" v-model="selectedProduct" @change="fetchChartData">
          <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>
  
      <div v-if="chartData && chartLabels">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import LineChart from './LineChart.vue';
  
  const selectedChart = ref('today');
  const selectedProduct = ref(null);
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('');
  const products = ref([]);
  
  const fetchChartData = async () => {
    try {
      const response = await fetch(`/kpi/stock-evolution?period=${selectedChart.value}`);
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
      const data = await response.json();
  
      if (selectedProduct.value && data[selectedProduct.value]) {
        chartData.value = data[selectedProduct.value].data;
        chartLabels.value = data[selectedProduct.value].labels;
        chartTitle.value = `Stock Evolution ${selectedChart.value.charAt(0).toUpperCase() + selectedChart.value.slice(1)} for ${data[selectedProduct.value].name}`;
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const response = await fetch('/kpi/stock-evolution?period=today');
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
      const data = await response.json();
      products.value = Object.values(data).map((item, index) => ({ id: index, name: item.name }));
  
      if (!selectedProduct.value && products.value.length > 0) {
        selectedProduct.value = products.value[0].id;
      }
  
      await fetchChartData();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  watch([selectedChart, selectedProduct], fetchChartData);
  
  onMounted(() => {
    fetchProducts();
  });
  </script>
  
  <style scoped>
  .stock-management {
    padding: 20px;
  }
  
  .controls {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  select {
    margin-left: 10px;
    padding: 5px;
    font-size: 16px;
  }
  
  h4 {
    margin-top: 40px;
  }
  </style>
  