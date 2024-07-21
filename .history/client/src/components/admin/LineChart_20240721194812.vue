<template>
    <div class="chart-container">
      <div class="controls">
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe" @change="updateChart">
          <option value="today">Aujourd'hui</option>
          <option value="currentMonth">Le mois actuel</option>
          <option value="currentYear">L'année actuelle</option>
          <option value="total">Total</option>
        </select>
      </div>
      <div class="curve-selection">
        <input type="text" v-model="searchQuery" placeholder="Rechercher une courbe" />
        <div class="checkboxes">
          <label v-for="curve in filteredCurves" :key="curve.id">
            <input type="checkbox" :value="curve.id" v-model="selectedCurves" @change="updateChart" />
            {{ curve.label }}
          </label>
        </div>
      </div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed } from "vue";
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  const lineChart = ref(null);
  const chartInstance = ref(null);
  const selectedTimeframe = ref("total");
  const selectedCurves = ref([]);
  const searchQuery = ref("");
  
  const allCurves = ref([
    { id: "curve1", label: "Courbe 1" },
    { id: "curve2", label: "Courbe 2" },
    { id: "curve3", label: "Courbe 3" },
    { id: "curve4", label: "Courbe 4" },
    { id: "curve5", label: "Courbe 5" },
  ]);
  
  const filteredCurves = computed(() => {
    return allCurves.value.filter((curve) =>
      curve.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const getChartData = (timeframe, curveId) => {
    const data = {
      curve1: {
        today: [5, 15, 25, 10, 20, 30, 40],
        currentMonth: [20, 40, 10, 60, 80, 50, 90],
        currentYear: [200, 500, 300, 600, 400, 700, 800],
        total: [400, 800, 500, 900, 600, 1000, 1100],
      },
      curve2: {
        today: [10, 5, 30, 25, 15, 20, 35],
        currentMonth: [30, 60, 90, 20, 40, 10, 50],
        currentYear: [400, 600, 800, 200, 300, 700, 500],
        total: [800, 1000, 1100, 400, 800, 500, 900],
      },
      curve3: {
        today: [2, 10, 5, 8, 12, 6, 3],
        currentMonth: [12, 18, 24, 36, 48, 30, 42],
        currentYear: [120, 240, 360, 480, 600, 720, 840],
        total: [240, 480, 720, 960, 1200, 1440, 1680],
      },
      curve4: {
        today: [8, 12, 16, 4, 20, 10, 14],
        currentMonth: [24, 36, 48, 60, 72, 84, 96],
        currentYear: [300, 600, 450, 900, 750, 1200, 1050],
        total: [400, 800, 1000, 1200, 1400, 1600, 1800],
      },
      curve5: {
        today: [6, 18, 9, 12, 21, 15, 24],
        currentMonth: [18, 27, 36, 45, 54, 63, 72],
        currentYear: [200, 400, 600, 800, 1000, 1200, 1400],
        total: [1000, 1500, 2000, 2500, 3000, 3500, 4000],
      },
    };
  
    return data[curveId][timeframe] || [];
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
      datasets: selectedCurves.value.map((curveId) => ({
        label: allCurves.value.find((curve) => curve.id === curveId)?.label || "Unknown",
        data: getChartData(selectedTimeframe.value, curveId),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      })),
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
  
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
  
    const ctx = lineChart.value.getContext("2d");
    chartInstance.value = new Chart(ctx, config);
  };
  
  const updateChart = () => {
    if (chartInstance.value) {
      chartInstance.value.data.labels = getChartLabels(selectedTimeframe.value);
      chartInstance.value.data.datasets = selectedCurves.value.map((curveId) => ({
        label: allCurves.value.find((curve) => curve.id === curveId)?.label || "Unknown",
        data: getChartData(selectedTimeframe.value, curveId),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }));
      chartInstance.value.update();
    }
  };
  
  onMounted(() => {
    createChart();
  });
  
  watch([selectedTimeframe, selectedCurves], createChart);
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
  
  .curve-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .curve-selection input {
    margin-bottom: 10px;
    padding: 5px;
    font-size: 16px;
  }
  
  .checkboxes {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .checkboxes label {
    margin-bottom: 5px;
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
  