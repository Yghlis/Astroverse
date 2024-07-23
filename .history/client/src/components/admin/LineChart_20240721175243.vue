<template>
    <div class="chart-container">
      <div class="controls">
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe" @change="updateChart">
          <option value="today">Today</option>
          <option value="currentMonth">Current Month</option>
          <option value="last3Months">Last 3 Months</option>
          <option value="last6Months">Last 6 Months</option>
          <option value="currentYear">Current Year</option>
          <option value="total">Total</option>
        </select>
      </div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  const lineChart = ref(null);
  const chartInstance = ref(null);
  const selectedTimeframe = ref("total");
  
  const getChartData = (timeframe) => {
    // Dummy data for different timeframes
    const data = {
      today: [10, 20, 30, 40, 50, 60, 70],
      currentMonth: [100, 200, 300, 400, 500, 600, 700],
      last3Months: [300, 400, 500, 600, 700, 800, 900],
      last6Months: [500, 600, 700, 800, 900, 1000, 1100],
      currentYear: [700, 800, 900, 1000, 1100, 1200, 1300],
      total: [1000, 1100, 1200, 1300, 1400, 1500, 1600],
    };
  
    return data[timeframe] || data.total;
  };
  
  const createChart = () => {
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Stock Level",
          data: getChartData(selectedTimeframe.value),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  
    const config = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Stock Level Over Time",
          },
        },
      },
    };
  
    const ctx = lineChart.value.getContext("2d");
    chartInstance.value = new Chart(ctx, config);
  };
  
  const updateChart = () => {
    if (chartInstance.value) {
      chartInstance.value.destroy(); // Dispose of the existing chart instance
    }
    createChart(); // Create a new chart instance
  };
  
  onMounted(() => {
    createChart();
  });
  
  watch(selectedTimeframe, updateChart);
  </script>
  
  <style scoped>
  .chart-container {
    width: 70%;
    height: 400px;
    margin: 0 auto;
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
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  