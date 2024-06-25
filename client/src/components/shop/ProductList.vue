<template>
  <div class="product-list">
    <shopCard
      v-for="item in products"
      :key="item.id"
      :image-src="getImageUrl(item.image_preview)"
      :title="item.title"
      :rating="item.rating"
      :number-of-ratings="item.numberOfRatings"
      :price="item.price"
    ></shopCard>
  </div>
</template>

<script setup>
import shopCard from "../../ui/shopCard.vue";

// Props
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const getImageUrl = (relativePath) => {
  return new URL(`${relativePath}`, import.meta.url).href;
};
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
