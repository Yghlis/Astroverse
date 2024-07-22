<template>
  <div
    class="card"
    :style="{ backgroundColor: card.backgroundColor }"
    ref="cardElement"
  >
    <span class="material-symbols-outlined option" @click="test">
      more_vert
    </span>
    <div class="title">
      <span class="material-symbols-outlined"> {{ card.icon }} </span>
      <h3>{{ card.title }}</h3>
      <div class="data">
        <div class="data-item">
          <p class="label">Jour:</p>
          <p class="value">{{ card.sales.day }}</p>
        </div>
        <div class="data-item">
          <p class="label">Mois:</p>
          <p class="value">{{ card.sales.month }}</p>
        </div>
        <div class="data-item">
          <p class="label">Année:</p>
          <p class="value">{{ card.sales.year }}</p>
        </div>
        <div class="data-item">
          <p class="label">Total:</p>
          <p class="value">{{ card.sales.total }}</p>
        </div>
      </div>
    </div>
    <div class="canvas-container" :style="{ height: chartHeight }">
      <canvas ref="salesChart" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const salesChart = ref(null);
const cardElement = ref(null);
let chartInstance = null;

const chartHeight = ref("370px");

const updateChartHeight = () => {
  if (cardElement.value) {
    chartHeight.value = cardElement.value.offsetHeight < 730 ? "370px" : "740px";
  }
};

const observer = new ResizeObserver(() => {
  updateChartHeight();
});

const resizeChart = () => {
  if (chartInstance) {
    const parent = salesChart.value.parentNode;
    parent.style.height = chartHeight.value;
    parent.style.width = "100%"; 
    chartInstance.resize();
  }
};

onMounted(() => {
  updateChartHeight();
  if (cardElement.value) {
    observer.observe(cardElement.value);
  }

  chartInstance = new Chart(salesChart.value, {
    type: "line",
    data: {
      labels: ["Jour", "Mois", "Année"],
      datasets: [
        {
          label: "Ventes",
          data: [
            props.card.sales.day,
            props.card.sales.month,
            props.card.sales.year,
          ],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false, // Disable responsive
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 18,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 18,
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 18,
            },
          },
        },
      },
    },
  });

  resizeChart();
});

onBeforeUnmount(() => {
  if (cardElement.value) {
    observer.unobserve(cardElement.value);
  }
  if (chartInstance) {
    chartInstance.destroy();
  }
});

watch(chartHeight, () => {
  resizeChart();
});
</script>

<style scoped lang="scss">
.card {
  user-select: none;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 5px;
  padding: 10px 20px;
  position: relative;
  .option {
    position: absolute;
    top: 35px;
    right: 20px;
    cursor: pointer;
  }
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .material-symbols-outlined {
      font-size: 44px;
      font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
    }
    h3 {
      font-family: "Montserrat", sans-serif;
      font-size: 24px;
      font-weight: bold;
    }
    .data {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 50px;
      gap: 20px;

      .data-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 5px 20px;

        .label {
          font-family: "Montserrat", sans-serif;
          font-size: 18px;
          font-weight: normal;
          color: #888;
          margin: 0;
        }

        .value {
          font-family: "Montserrat", sans-serif;
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          color: #333;
        }
      }
    }
  }
  .canvas-container {
    width: 100%;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  .totals {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    p {
      font-family: "Montserrat", sans-serif;
      margin: 0;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
