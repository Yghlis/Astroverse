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
          <option value="product1">Product 1</option>
          <option value="product2">Product 2</option>
          <option value="product3">Product 3</option>
        </select>
      </div>
  
      <div v-if="chartData && chartLabels">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  import LineChart from './LineChart.vue';
  
  const selectedChart = ref('today');
  const selectedProduct = ref('product1');
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('');
  
  const fetchChartData = async () => {
    try {
      const response = await axios.get('/kpi/stock-evolution', {
        params: { period: selectedChart.value }
      });
      const data = response.data;
  
      // Update chart data and labels based on selected product and chart
      const productData = data[selectedProduct.value];
      if (productData) {
        chartData.value = productData.data;
        chartLabels.value = productData.labels;
        chartTitle.value = `Stock Evolution ${selectedChart.value.charAt(0).toUpperCase() + selectedChart.value.slice(1)} for ${selectedProduct.value}`;
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  watch([selectedChart, selectedProduct], fetchChartData);
  
  onMounted(fetchChartData);
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
  