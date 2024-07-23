<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
  
      <div v-if="chartData.length && chartLabels.length">
        <h4>{{ chartTitle }}</h4>
        <line-chart :chartData="chartData" :chartLabels="chartLabels" :chartTitle="chartTitle" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import LineChart from './LineChart.vue';
  import { jwtDecode } from "jwt-decode";
  
  const chartData = ref([]);
  const chartLabels = ref([]);
  const chartTitle = ref('Stock Evolution for the Last 3 Months');
  
  const fetchChartData = async () => {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token); // Log the token
    try {
      const response = await fetch(`http://localhost:8000/kpi/stock-evolution?period=3months`, {
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
  
      // Assuming the response format contains 'labels' and 'data' directly for the last 3 months
      chartData.value = data.data;
      chartLabels.value = data.labels;
      console.log('Chart Data:', chartData.value);
      console.log('Chart Labels:', chartLabels.value);
      console.log('Chart Title:', chartTitle.value);
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
  