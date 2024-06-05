<template>
  <div class="highlight">
    <h1>Top Products</h1>
    <div class="products">
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
  </div>
</template>

<script setup>
import shopCard from "../../ui/shopCard.vue";
import { reactive } from "vue";







// ################################################################# API CALL #################################################################

import luffyImage from "../../assets/images/figurines/one-piece-figurine-luffy-gear-5-king-of-artist-banpresto.jpg";

const figurines = reactive([
  {
    id: 1,
    imageSrc: luffyImage,
    title:
      "ONE PIECE - FIGURINE LUFFY - GEAR 5 - KING OF ARTIST - BANPRESTO",
    rating: 5,
    numberOfRatings: 120,
    price: "$35.99",
  },
  {
    id: 2,
    imageSrc:
    luffyImage,
    title: "NARUTO - FIGURINE NARUTO SAGE MODE NARUTO - FIGURINE NARUTO SAGE MODE NARUTO - FIGURINE NARUTO SAGE MODE ",
    rating: 4,
    numberOfRatings: 98,
    price: "$29.99",
  },
  {
    id: 3,
    imageSrc:
    luffyImage,
    title: "DRAGON BALL - FIGURINE GOKU ULTRA INSTINCT",
    rating: 4,
    numberOfRatings: 150,
    price: "$39.99",
  },
]);
</script>

<style lang="scss" scoped>
.highlight {
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 300px; // a enlever
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
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
