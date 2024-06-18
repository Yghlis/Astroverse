<template>
  <div class="product-list">
    <TheLoader v-if="loading" :loading="loading"> </TheLoader>
    <div v-if="error">{{ error }}</div>
    <shopCard
      v-show="!loading && !error"
      v-for="item in products"
      :key="item.id"
      :image-src="getImageUrl(item.image_preview)"
      :title="item.title"
      :rating="item.rating"
      :number-of-ratings="item.numberOfRatings"
      :price="item.price"
    ></shopCard>
    <div>
      {{ test }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed} from "vue";
import shopCard from "../../ui/shopCard.vue";
import { onMounted } from "vue";
import { useShopStore } from "../../stores/useShopStore";
import TheLoader from "../../ui/TheLoader.vue"


//########################################################### API Call From Pinia ############################################################

const shopStore = useShopStore();

// Utiliser des références réactives pour les données du store
const products = computed(() => shopStore.products);
const loading = computed(() => shopStore.loading);
const error = computed(() => shopStore.error);
const test = computed(() => shopStore.filters);

const fetchProducts = shopStore.fetchProducts;

const getImageUrl = (relativePath) => {
  return new URL(`${relativePath}`, import.meta.url).href;
};

onMounted(() => {
  fetchProducts();
});


</script>

<style lang="scss" scoped>
.product-list {
  width: calc(100% - 280px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
}

@media (max-width: 768px) {
  .product-list {
    width: 100%;
    justify-content: center;
  }
}
</style>
