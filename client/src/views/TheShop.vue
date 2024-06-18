<template>
  <div class="container-shop">
    <div class="banner"></div>
    <SearchBar :searchText="searchText" @update:search="handleSearch" />
    <!-- <h1>{{ searchText }}</h1> -->
    <div class="sub_container">
      <TheLoader v-if="loading" :loading="loading"> </TheLoader>
      <div v-if="error">{{ error }}</div>
      <TheFiltre
        v-show="!loading && !error"
        :filter-options="filterOptions"
        :selected-filters="selectedFilters"
      />
      <product-list v-show="!loading && !error" :products="products" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TheFiltre from "../components/shop/TheFiltre.vue";
import ProductList from "../components/shop/ProductList.vue";
import SearchBar from "../ui/SearchBar.vue";
import { useShopStore } from "../stores/useShopStore";
import TheLoader from "../ui/TheLoader.vue";

const searchText = ref("");

const handleSearch = (text) => {
  searchText.value = text;
};

//################################################# API CALL #################################################

const shopStore = useShopStore();

const products = computed(() => shopStore.products);
const loading = computed(() => shopStore.loading);
const error = computed(() => shopStore.error);
const selectedFilters = computed(() => shopStore.selectedFilters);

const filterOptions = computed(() => {
  const options = [];
  let idCounter = 1;

  // Handle checkbox filters
  for (const key in shopStore.filters.checkboxes) {
    options.push({
      id: idCounter++,
      optionName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
      optionType: "checkbox",
      optionValues: shopStore.filters.checkboxes[key].map((value) => ({
        value: value,
        label: value,
      })),
    });
  }

  // Handle range filters
  for (const key in shopStore.filters.ranges) {
    options.push({
      id: idCounter++,
      optionName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
      optionType: "range",
      rangeMin: shopStore.filters.ranges[key].min,
      rangeMax: shopStore.filters.ranges[key].max,
    });
  }

  // Handle promotion filter
  options.push({
    id: idCounter++,
    optionName: "Promotion",
    optionType: "checkbox",
    optionValues: [{ value: true, label: "On Promotion" }],
  });

  return options;
});

onMounted(async () => {
  await shopStore.fetchProducts();
  await shopStore.fetchFilterOptions();
});
</script>

<style lang="scss" scoped>
.container-shop {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 100px auto 0 auto;
  gap: 20px;
  .banner {
    width: 100%;
    height: 200px;
    background-color: #f2a45a;
  }
  .sub_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
}
</style>
