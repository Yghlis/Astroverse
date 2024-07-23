<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
  
      <div v-if="chartData && chartData.length && chartLabels && chartLabels.length">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import LineChart from './LineChart.vue';
  
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('Stock Evolution for the Last 3 Months');
  
  const fetchChartData = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token); // Log the token
    try {
      const response = await fetch(`http://localhost:8000/kpi/stock-evolution`, {
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
      if (responseBody) {
        const productData = responseBody['Barbe Noire'];  // Assurez-vous de traiter les données du bon produit
        if (productData && productData.data && productData.labels) {
          chartData.value = productData.data;
          chartLabels.value = productData.labels;
          console.log('Chart Data:', chartData.value);
          console.log('Chart Labels:', chartLabels.value);
          console.log('Chart Title:', chartTitle.value);
        } else {
          console.error('Invalid data format from API');
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  onMounted(() => {
    fetchChartData();
  });
  </script>
  
  <style scoped>
  .stock-management {
    padding: 20px;
  }
  
  h4 {
    margin-top: 40px;
  }
  </style>
  