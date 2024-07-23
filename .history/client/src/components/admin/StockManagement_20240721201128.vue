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
  
      <div class="controls">
        <label for="productSelector">Select Product:</label>
        <select id="productSelector" v-model="selectedProduct">
          <option value="product1">Product 1</option>
          <option value="product2">Product 2</option>
          <option value="product3">Product 3</option>
        </select>
      </div>
  
      <div v-if="selectedChart === 'today'">
        <h4>Stock Evolution Today</h4>
        <line-chart :chartData="getDataForProduct('today')" :chartLabels="labelsToday" chartTitle="Stock Evolution Today" />
      </div>
  
      <div v-if="selectedChart === 'month'">
        <h4>Stock Evolution This Month</h4>
        <line-chart :chartData="getDataForProduct('month')" :chartLabels="labelsMonth" chartTitle="Stock Evolution This Month" />
      </div>
  
      <div v-if="selectedChart === 'year'">
        <h4>Stock Evolution This Year</h4>
        <line-chart :chartData="getDataForProduct('year')" :chartLabels="labelsYear" chartTitle="Stock Evolution This Year" />
      </div>
    </div>
  </template>
  
  <script setup>
  import LineChart from './LineChart.vue';
  import { ref } from 'vue';
  
  const selectedChart = ref('today');
  const selectedProduct = ref('product1');
  
  const data = {
    today: {
      product1: [5, 20, 15, 30, 25, 50, 35],
      product2: [3, 25, 9, 40, 15, 35, 21],
      product3: [2, 18, 6, 22, 10, 28, 14],
    },
    month: {
      product1: [10, 35, 25, 50, 40, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300],
      product2: [5, 28, 15, 40, 25, 50, 65, 70, 85, 90, 105, 110, 125, 130, 145, 150, 165, 170, 185, 190, 205, 210, 225, 230, 245, 250, 265, 270, 285, 290],
      product3: [7, 32, 21, 46, 35, 54, 63, 74, 83, 94, 103, 114, 123, 134, 143, 154, 163, 174, 183, 194, 203, 214, 223, 234, 243, 254, 263, 274, 283, 294],
    },
    year: {
      product1: [15, 30, 25, 50, 40, 60, 70, 85, 90, 100, 120, 140],
      product2: [10, 25, 20, 35, 30, 45, 55, 70, 75, 85, 100, 120],
      product3: [12, 28, 22, 42, 38, 54, 64, 78, 82, 92, 108, 126],
    }
  };
  
  const labelsToday = ref(['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']);
  const labelsMonth = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']);
  const labelsYear = ref(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  
  const getDataForProduct = (timeframe) => {
    return data[timeframe][selectedProduct.value] || [];
  };
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
  