<template>
    <div class="chart-container">
      <div class="controls">
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe" @change="updateChart">
          <option value="today">Today</option>
          <option value="currentMonth">Current Month</option>
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
    const data = {
      today: [5, 15, 25, 10, 20, 30, 40],
      currentMonth: [20, 40, 10, 60, 80, 50, 90],
      currentYear: [200, 500, 300, 600, 400, 700, 800],
      total: [400, 800, 500, 900, 600, 1000, 1100],
    };
  
    return data[timeframe] || data.total;
  };
  
  const getChartLabels = (timeframe) => {
    const monthsInFrench = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"];
    const labels = {
      today: ["8h", "10h", "12h", "14h", "16h", "18h", "20h"],
      currentMonth: Array.from({ length: 30 }, (_, i) => `Jour ${i + 1}`),
      currentYear: monthsInFrench,
      total: monthsInFrench,
    };
  
    return labels[timeframe] || labels.total;
  };
  
  const createChart = () => {
    if (!lineChart.value) return;
  
    const data = {
      labels: getChartLabels(selectedTimeframe.value),
      datasets: [
        {
          label: "Niveau de Stock",
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
            text: "Niveau de Stock au Fil du Temps",
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
      chartInstance.value.data.labels = getChartLabels(selectedTimeframe.value);
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
  