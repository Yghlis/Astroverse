<template>
    <div class="chart-container">
      <div class="controls">
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe">
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
    // Varied dummy data for different timeframes
    const data = {
      today: [5, 15, 25, 10, 20, 30, 40],
      currentMonth: [20, 40, 10, 60, 80, 50, 90],
      last3Months: [50, 100, 150, 200, 250, 300, 350],
      last6Months: [100, 300, 200, 400, 500, 600, 700],
      currentYear: [200, 500, 300, 600, 400, 700, 800],
      total: [400, 800, 500, 900, 600, 1000, 1100],
    };
  
    return data[timeframe] || data.total;
  };
  
  const createChart = () => {
    if (!lineChart.value) return;
  
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
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
    chartInstance.value = new Chart(ctx, config);
  };
  
  const updateChart = () => {
    if (chartInstance.value) {
      chartInstance.value.data.datasets[0].data = getChartData(selectedTimeframe.value);
      chartInstance.value.update();
    }
  };
  
  onMounted(() => {
    createChart();
  });
  
  watch(selectedTimeframe, createChart);
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
  