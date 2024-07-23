<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
  
      <div class="controls">
        <label for="productSelector">Select Product:</label>
        <select id="productSelector" v-model="selectedProduct" @change="fetchChartData">
          <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>
  
      <div v-if="chartData && chartData.length && chartLabels && chartLabels.length">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
  
      <div class="stock-alert">
        <h4>Vérification du stock des produits</h4>
        <label for="stockThreshold">Rentrer le nombre de stock limite:</label>
        <input type="number" id="stockThreshold" v-model.number="stockThreshold" @change="checkStockAlert" />
  
        <div v-if="lowStockProducts.length">
          <h5>Voici les produits qui possèdent moins de {{ stockThreshold }} en stock :</h5>
          <ul>
            <li v-for="product in lowStockProducts" :key="product.id">{{ product.name }}: {{ product.stock }}</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import LineChart from './LineChart.vue';
  
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('Stock Evolution for the Last 3 Months');
  const selectedProduct = ref(null);
  const products = ref([]);
  const stockThreshold = ref(50); // Default stock alert threshold
  const lowStockProducts = ref([]);
  
  const fetchProducts = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token); // Log the token
    try {
      const response = await fetch(`http://localhost:8000/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseBody = await response.json();
      console.log('Products Response:', responseBody);
  
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
  
      products.value = responseBody.map(product => ({
        id: product.id,
        name: product.title,
        stock: product.stock // Assuming stock is part of the product object
      }));
  
      if (products.value.length > 0) {
        selectedProduct.value = products.value[0].id;
        fetchChartData();  // Charger les données du graphique pour le produit par défaut
      }
  
      checkStockAlert();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const fetchChartData = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token); // Log the token
    try {
      const response = await fetch(`http://localhost:8000/kpi/stock-evolution?productId=${selectedProduct.value}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseBody = await response.json();
      console.log('Chart Data Response:', responseBody);
  
      if (!response.ok) {
        throw new Error('Erreur: ' + response.status);
      }
  
      // Assurez-vous que les données sont correctes avant de les assigner
      if (responseBody && responseBody.data && responseBody.labels) {
        chartData.value = responseBody.data;
        chartLabels.value = responseBody.labels;
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
  
  const checkStockAlert = () => {
    lowStockProducts.value = products.value.filter(product => product.stock < stockThreshold.value);
  };
  
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
  
  .stock-alert {
    margin-top: 40px;
    text-align: center;
  }
  
  input {
    margin-left: 10px;
    padding: 5px;
    font-size: 16px;
  }
  
  h4 {
    margin-top: 40px;
  }
  
  h5 {
    margin-top: 20px;
  }
  </style>
  