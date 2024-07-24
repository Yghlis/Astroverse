<template>
  <div class="container-landing">
    <VideoPlayer :mediaItems="mediaItems"></VideoPlayer>
    <HighLight :topProducts="topViewedProducts"></HighLight>
    <UniversDisplay></UniversDisplay>
  </div>
</template>

<script setup>
import VideoPlayer from "../ui/VideoPlayer.vue";
import TheSearch from "../components/landingPage/TheSearch.vue";
import HighLight from "../components/landingPage/HighLight.vue";
import UniversDisplay from "../components/landingPage/UniversDisplay.vue";
import { reactive, onMounted, computed } from "vue";

import { useShopStore } from "../stores/useShopStore";

const shopStore = useShopStore();

const products = computed(() => shopStore.products);

onMounted(async () => {
  await shopStore.fetchProducts();
});


function getRandomElements(array, count) {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


const mediaItems = computed(() => {
  if (!products.value || products.value.length === 0) return [];
  const randomProducts = getRandomElements(products.value, 5);
  return randomProducts.map((product) => {
    return {
      url: product.image_preview,
      isVideo: false,
      isYouTube: false,
      link: `/item/${product.id}`,
    };
  });
});


const topViewedProducts = computed(() => {
  if (!products.value || products.value.length === 0) return [];
  return products.value
    .slice()
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 10);
});
</script>

<style lang="scss" scoped>
.container-landing {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 100px;
}
</style>
