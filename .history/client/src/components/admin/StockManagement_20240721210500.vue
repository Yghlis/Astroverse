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
  
      <div v-if="chartData.length && chartLabels.length">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import LineChart from './LineChart.vue';
  import { jwtDecode } from "jwt-decode";
  
  const selectedChart = ref('today');
  const selectedProduct = ref(null);
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('');
  const products = ref([]);
  
  const fetchChartData = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token); // Log the token
    try {
      const response = await fetch(`http://localhost:8000/kpi/stock-evolution?period=${selectedChart.value}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseBody = await response.text();
      console.log('Chart Data Response:', responseBody);
  
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
  
      const data = JSON.parse(responseBody);
      console.log('Chart Data:', data);
  
      const selectedProductName = products.value.find(p => p.id === selectedProduct.value)?.name;
      
      if (selectedProduct.value && data[selectedProductName]) {
        chartData.value = data[selectedProductName].data;
        chartLabels.value = data[selectedProductName].labels;
        chartTitle.value = `Stock Evolution ${selectedChart.value.charAt(0).toUpperCase() + selectedChart.value.slice(1)} for ${selectedProductName}`;
        console.log('Chart Data:', chartData.value);
        console.log('Chart Labels:', chartLabels.value);
        console.log('Chart Title:', chartTitle.value);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  const fetchProducts = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token); // Log the token
    try {
      const response = await fetch('http://localhost:8000/kpi/stock-evolution?period=today', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseBody = await response.text();
      console.log('Products Response:', responseBody);
  
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
  
      const data = JSON.parse(responseBody);
      console.log('Fetched Data:', data);
      products.value = Object.keys(data).map((key, index) => ({ id: key, name: key }));
      console.log('Products:', products.value);
  
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
  