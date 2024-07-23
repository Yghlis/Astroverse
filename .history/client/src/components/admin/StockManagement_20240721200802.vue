<template>
    <div class="stock-management">
      <h3>Gestion de Stock</h3>
  
      <div class="controls">
        <label for="chartSelector">Select Chart:</label>
        <select id="chartSelector" v-model="selectedChart">
          <option value="today">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
  
      <div v-if="selectedChart === 'today'">
        <h4>Stock Evolution Today</h4>
        <line-chart :chartData="dataToday" :chartLabels="labelsToday" chartTitle="Stock Evolution Today" />
      </div>
  
      <div v-if="selectedChart === 'month'">
        <h4>Stock Evolution This Month</h4>
        <line-chart :chartData="dataMonth" :chartLabels="labelsMonth" chartTitle="Stock Evolution This Month" />
      </div>
  
      <div v-if="selectedChart === 'year'">
        <h4>Stock Evolution This Year</h4>
        <line-chart :chartData="dataYear" :chartLabels="labelsYear" chartTitle="Stock Evolution This Year" />
      </div>
    </div>
  </template>
  
  <script setup>
  import LineChart from './LineChart.vue';
  import { ref } from 'vue';
  
  const selectedChart = ref('today');
  
  const dataToday = ref([5, 10, 15, 20, 25, 30, 35]);
  const labelsToday = ref(['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']);
  
  const dataMonth = ref([10, 20, 15, 25, 30, 20, 40, 35, 45, 30, 50, 60, 55, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190]);
  const labelsMonth = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']);
  
  const dataYear = ref([10, 20, 15, 25, 30, 20, 40, 35, 45, 30, 50, 60]);
  const labelsYear = ref(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
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
  