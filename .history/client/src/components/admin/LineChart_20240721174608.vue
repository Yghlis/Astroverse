<template>
    <div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  const lineChart = ref(null);
  
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Stock Level",
        data: [65, 59, 80, 81, 56, 55, 40],
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
  
  onMounted(() => {
    const ctx = lineChart.value.getContext("2d");
    new Chart(ctx, config);
  });
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    margin: 20px 0;
  }
  </style>
  