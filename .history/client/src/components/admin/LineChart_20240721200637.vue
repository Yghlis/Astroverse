<template>
    <div class="chart-container">
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    chartData: Array,
    chartLabels: Array,
    chartTitle: String
  });
  
  const lineChart = ref(null);
  const chartInstance = ref(null);
  
  const createChart = () => {
    if (!lineChart.value) return;
  
    const data = {
      labels: props.chartLabels,
      datasets: [
        {
          label: 'Stock Evolution',
          data: props.chartData,
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
            text: props.chartTitle,
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
  
  onMounted(() => {
    createChart();
  });
  
  watch(() => [props.chartData, props.chartLabels, props.chartTitle], () => {
    createChart();
  });
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px;
    margin: 0 auto;
  }
  
  canvas {
    width: 100% !important;
    height: 400px !important;
  }
  </style>
  