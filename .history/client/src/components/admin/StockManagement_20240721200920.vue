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
      product1: [5, 10, 15, 20, 25, 30, 35],
      product2: [3, 6, 9, 12, 15, 18, 21],
      product3: [2, 4, 6, 8, 10, 12, 14],
    },
    month: {
      product1: [10, 20, 15, 25, 30, 20, 40, 35, 45, 30, 50, 60, 55, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
      product2: [5, 15, 10, 20, 25, 15, 35, 30, 40, 25, 45, 55, 50, 60, 65, 70, 75, 80, 85, 90, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185],
      product3: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119, 126, 133, 140, 147, 154, 161, 168, 175, 182, 189, 196, 203, 210],
    },
    year: {
      product1: [10, 20, 15, 25, 30, 20, 40, 35, 45, 30, 50, 60],
      product2: [5, 15, 10, 20, 25, 15, 35, 30, 40, 25, 45, 55],
      product3: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84],
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
  