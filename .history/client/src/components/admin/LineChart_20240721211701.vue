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
    chartData: {
      type: Array,
      required: true
    },
    chartLabels: {
      type: Array,
      required: true
    },
    chartTitle: {
      type: String,
      required: true
    }
  });
  
  const lineChart = ref(null);
  const chartInstance = ref(null);
  
  const createChart = () => {
    // Vérifiez que le canvas est disponible
    if (!lineChart.value) return;
  
    // Obtenez le contexte de rendu du canvas
    const ctx = lineChart.value.getContext('2d');
    if (!ctx) {
      console.error('Could not get context for lineChart');
      return;
    }
  
    // Détruisez l'instance de graphique existante si elle existe
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
  
    // Créez le nouveau graphique
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: props.chartLabels,
        datasets: [{
          label: props.chartTitle,
          data: props.chartData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }],
      },
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
    });
  };
  
  onMounted(() => {
    // Créez le graphique initialement
    createChart();
  });
  
  watch(() => [props.chartData, props.chartLabels, props.chartTitle], createChart);
  </script>
  
  <style scoped>
  .chart-container {
    width: 70%;
    height: 400px;
    margin: 0 auto;
  }
  </style>
  