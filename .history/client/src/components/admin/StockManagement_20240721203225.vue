<script setup>
import { ref, watch, onMounted } from 'vue';
import LineChart from './LineChart.vue';

const selectedChart = ref('today');
const selectedProduct = ref(null);
const chartData = ref([]);
const chartLabels = ref([]);
const chartTitle = ref('');
const products = ref([]);

const fetchChartData = async () => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  try {
    const response = await fetch(`http://localhost:8000/kpi/stock-evolution?period=${selectedChart.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const responseBody = await response.text();
    console.log('Chart Data Response:', responseBody);

    if (!response.ok) {
      throw new Error('Erreur: ' + response.status);
    }

    const data = JSON.parse(responseBody);

    if (selectedProduct.value && data[selectedProduct.value]) {
      chartData.value = data[selectedProduct.value].data;
      chartLabels.value = data[selectedProduct.value].labels;
      chartTitle.value = `Stock Evolution ${selectedChart.value.charAt(0).toUpperCase() + selectedChart.value.slice(1)} for ${data[selectedProduct.value].name}`;
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const fetchProducts = async () => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  try {
    const response = await fetch('http://localhost:8000/kpi/stock-evolution?period=today', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const responseBody = await response.text();
    console.log('Products Response:', responseBody);

    if (!response.ok) {
      throw new Error('Erreur: ' + response.status);
    }

    const data = JSON.parse(responseBody);
    products.value = Object.values(data).map((item, index) => ({ id: index, name: item.title }));

    if (!selectedProduct.value && products.value.length > 0) {
      selectedProduct.value = products.value[0].id;
    }

    await fetchChartData();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

watch([selectedChart, selectedProduct], fetchChartData);

onMounted(() => {
  fetchProducts();
});
</script>
