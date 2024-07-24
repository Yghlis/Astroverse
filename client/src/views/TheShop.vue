<template>
  <div class="container-shop">
    <SearchBar />
    <div class="sub_container">
      <TheLoader v-if="loading" :loading="loading"> </TheLoader>
      <div v-if="error">{{ error }}</div>
      <transition name="fade">
        <TheFiltre
          v-show="!loading && !error"
          :filter-options="filterOptions"
          :selected-filters="selectedFilters"
          :search="search"
        />
      </transition>
      <transition name="fade">
        <product-list v-show="!loading && !error" :products="products" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import TheFiltre from "../components/shop/TheFiltre.vue";
import ProductList from "../components/shop/ProductList.vue";
import SearchBar from "../ui/SearchBar.vue";
import { useShopStore } from "../stores/useShopStore";
import TheLoader from "../ui/TheLoader.vue";



const shopStore = useShopStore();

const products = computed(() => shopStore.products);
const loading = computed(() => shopStore.loading);
const error = computed(() => shopStore.error);
const selectedFilters = computed(() => shopStore.selectedFilters);
const search = computed(() => shopStore.search);

const filterOptions = computed(() => {
  const options = [];
  let idCounter = 1;


  for (const key in shopStore.filters.checkboxes) {
    options.push({
      id: idCounter++,
      optionName: key,
      optionType: "checkbox",
      optionValues: shopStore.filters.checkboxes[key].map((value) => ({
        value: value,
        label: value,
      })),
    });
  }

 
  for (const key in shopStore.filters.ranges) {
    options.push({
      id: idCounter++,
      optionName: key,
      optionType: "range",
      rangeMin: shopStore.filters.ranges[key].min,
      rangeMax: shopStore.filters.ranges[key].max,
    });
  }


  options.push({
    id: idCounter++,
    optionName: "promotion",
    optionType: "checkbox",
    optionValues: [{ value: true, label: "En Promotion" }],
  });

  return options;
});

onMounted(async () => {
  await shopStore.fetchProducts();
  shopStore.updatePriceRange();
  await shopStore.fetchFilterOptions();

});

onBeforeUnmount(() => {
  shopStore.resetState();
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
  padding-top: 50px;
  .sub_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
