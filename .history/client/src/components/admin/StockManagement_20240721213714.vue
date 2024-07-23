<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
  
      <div class="controls">
        <label for="productSelector">Select Product:</label>
        <select id="productSelector" v-model="selectedProduct" @change="fetchChartData">
          <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>
  
      <div class="controls">
        <label for="stockThreshold">Stock Threshold:</label>
        <input id="stockThreshold" v-model="stockThreshold" type="number" min="1" />
      </div>
  
      <div v-if="alertMessage" class="alert">
        <p>{{ alertMessage }}</p>
      </div>
  
      <div v-if="chartData && chartData.length && chartLabels && chartLabels.length">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import LineChart from './LineChart.vue';
  
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('Stock Evolution for the Last 3 Months');
  const selectedProduct = ref(null);
  const products = ref([]);
  const stockThreshold = ref(50); // Default stock threshold
  const alertMessage = ref('');
  
  // Fetch products from API
  const fetchProducts = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token);
    try {
      const response = await fetch('http://localhost:8000/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseBody = await response.json();
      console.log('Products Response:', responseBody);
  
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
  
      products.value = responseBody.map((product) => ({
        id: product.id,
        name: product.title,
      }));
  
      if (products.value.length > 0) {
        selectedProduct.value = products.value[0].id;
        fetchChartData(); // Load chart data for the default product
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  // Fetch chart data from API
  const fetchChartData = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token);
    try {
      const response = await fetch(`http://localhost:8000/kpi/stock-evolution?productId=${selectedProduct.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseBody = await response.json();
      console.log('Chart Data Response:', responseBody);
  
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
  
      if (responseBody && responseBody.data && responseBody.labels) {
        chartData.value = responseBody.data;
        chartLabels.value = responseBody.labels;
        checkStockLevels();
        console.log('Chart Data:', chartData.value);
        console.log('Chart Labels:', chartLabels.value);
        console.log('Chart Title:', chartTitle.value);
      } else {
        console.error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  // Check stock levels and set alert message if stock is below threshold
  const checkStockLevels = () => {
    const currentStock = chartData.value[chartData.value.length - 1]; // Assume the latest data point represents the current stock
    if (currentStock < stockThreshold.value) {
      alertMessage.value = `Alert: The stock for ${products.value.find(p => p.id === selectedProduct.value).name} is below ${stockThreshold.value}. Current stock: ${currentStock}`;
    } else {
      alertMessage.value = '';
    }
  };
  
  onMounted(() => {
    fetchProducts();
  });
  
  watch([selectedProduct, stockThreshold], fetchChartData);
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
  
  select, input {
    margin-left: 10px;
    padding: 5px;
    font-size: 16px;
  }
  
  .alert {
    color: red;
    font-weight: bold;
    text-align: center;
  }
  
  h4 {
    margin-top: 40px;
  }
  </style>
  