<template>
  <div class="highlight">
    <h2>Top Products</h2>
    <div class="products">
      <TheCarousel>
        <shopCard
          v-for="item in figurines"
          :key="item.id"
          :product="item"
        ></shopCard>
      </TheCarousel>
    </div>
  </div>
</template>

<script setup>
import shopCard from "../../ui/shopCard.vue";
import { reactive } from "vue";
import TheCarousel from "../../ui/TheCarousel.vue";

// ################################################################# API CALL #################################################################

const figurines = reactive([
  {
    id: 1,
    image_preview:' luffyImage',
    title: "ONE PIECE - FIGURINE LUFFY - GEAR 5 - KING OF ARTIST - BANPRESTO",
    rating: 5,
    numberOfRatings: 120,
    price: "35.99",
  },
  {
    id: 2,
    image_preview: ' luffyImage',
    title:
      "NARUTO - FIGURINE NARUTO SAGE MODE NARUTO - FIGURINE NARUTO SAGE MODE NARUTO - FIGURINE NARUTO SAGE MODE",
    rating: 4,
    numberOfRatings: 98,
    price: "29.99",
  },
  {
    id: 3,
    image_preview: ' luffyImage',
    title: "DRAGON BALL - FIGURINE GOKU ULTRA INSTINCT",
    rating: 4,
    numberOfRatings: 150,
    price: "39.99",
  },
  {
    id: 4,
    image_preview:' luffyImage',
    title: "My Hero Academia - Figurine Izuku Midoriya The Amazing Hero Plus ",
    rating: 5,
    numberOfRatings: 54,
    price: "37,90",
  },
  {
    id: 5,
    image_preview: ' luffyImage',
    title: "My Hero Academia - Figurine Izuku Midoriya The Amazing Hero Plus ",
    rating: 5,
    numberOfRatings: 54,
    price: "37,90",
  },
  {
    id: 6,
    image_preview: ' luffyImage',
    title: "My Hero Academia - Figurine Izuku Midoriya The Amazing Hero Plus ",
    rating: 5,
    numberOfRatings: 54,
    price: "37,90",
  },
  {
    id: 7,
    image_preview: ' luffyImage',
    title: "My Hero Academia - Figurine Izuku Midoriya The Amazing Hero Plus ",
    rating: 5,
    numberOfRatings: 54,
    price: "37,90",
  },
  {
    id: 8,
    image_preview:' luffyImage',
    title: "My Hero Academia - Figurine Izuku Midoriya The Amazing Hero Plus ",
    rating: 5,
    numberOfRatings: 54,
    price: "37,90",
  },
]);
</script>

<style lang="scss" scoped>
.highlight {
  width: 80%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
    margin-bottom: 0;
  }
  .products {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
