<template>
    <div class="chart-container">
      <div class="controls">
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe" @change="updateChart">
          <option value="last3Months">Last 3 Months</option>
          <option value="last6Months">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  const lineChart = ref(null);
  const chartInstance = ref(null);
  const selectedTimeframe = ref('last3Months');
  
  const getChartData = (timeframe) => {
    const data = {
      last3Months: [10, 20, 15, 25, 30, 20, 40],
      last6Months: [10, 20, 15, 25, 30, 20, 40, 35, 45, 30, 50, 60],
      lastYear: [10, 20, 15, 25, 30, 20, 40, 35, 45, 30, 50, 60, 55, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130],
    };
  
    return data[timeframe] || [];
  };
  
  const getChartLabels = (timeframe) => {
    const labels = {
      last3Months: ["April", "May", "June", "July", "August", "September", "October"],
      last6Months: ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"],
      lastYear: ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"],
    };
  
    return labels[timeframe] || [];
  };
  
  const createChart = () => {
    if (!lineChart.value) return;
  
    const data = {
      labels: getChartLabels(selectedTimeframe.value),
      datasets: [
        {
          label: 'Stock Evolution',
          data: getChartData(selectedTimeframe.value),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  
    const config = {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Stock Evolution Over Time',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stock Level',
            },
          },
        },
      },
    };
  
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
  
    const ctx = lineChart.value.getContext('2d');
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
    height: 400px !important;
  }
  </style>
  