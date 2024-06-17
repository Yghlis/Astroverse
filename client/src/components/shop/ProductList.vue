<template>
  <div class="product-list">
    <shopCard
      v-for="item in figurines"
      :key="item.id"
      :image-src="item.imageSrc"
      :title="item.title"
      :rating="item.rating"
      :number-of-ratings="item.numberOfRatings"
      :price="item.price"
    ></shopCard>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import shopCard from "../../ui/shopCard.vue";

// ################################################################# API CALL #################################################################

import luffyImage from "../../assets/images/figurines/one-piece-figurine-luffy-gear-5-king-of-artist-banpresto.jpg";
import narutoImage from "../../assets/images/figurines/bandai-btn65560-8-naruto-s-h-figuarts-naruto-uzumaki-kurama-link-mod.jpg";

import gokuImage from "../../assets/images/figurines/04_4b0d2f02-6ae8-44bd-be40-36de2d56317c.jpg";
import izukuImage from "../../assets/images/figurines/my-hero-academia-figurine-izuku-midoriya-the-amazing-hero-plus.webp";
const figurines = reactive([
  {
    id: 1,
    imageSrc: luffyImage,
    title: "ONE PIECE - FIGURINE LUFFY - GEAR 5 - KING OF ARTIST - BANPRESTO",
    rating: 5,
    numberOfRatings: 120,
    price: "35.99",
  },
  {
    id: 2,
    imageSrc: narutoImage,
    title:
      "NARUTO - FIGURINE NARUTO SAGE MODE NARUTO - FIGURINE NARUTO SAGE MODE NARUTO - FIGURINE NARUTO SAGE MODE",
    rating: 4,
    numberOfRatings: 98,
    price: "29.99",
  },
  {
    id: 3,
    imageSrc: gokuImage,
    title: "DRAGON BALL - FIGURINE GOKU ULTRA INSTINCT",
    rating: 4,
    numberOfRatings: 150,
    price: "39.99",
  },
  {
    id: 4,
    imageSrc: izukuImage,
    title: "My Hero Academia - Figurine Izuku Midoriya The Amazing Hero Plus ",
    rating: 5,
    numberOfRatings: 54,
    price: "37,90",
  }
]);
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
