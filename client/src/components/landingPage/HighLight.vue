<template>
  <div class="highlight">
    <h2>Top 10 des produits les plus vendus</h2>
    <div class="products">
      <TheCarousel>
        <shopCard
          v-for="item in topProducts"
          :key="item.id"
          :product="item"
        ></shopCard>
      </TheCarousel>
    </div>
  </div>
</template>

<script setup>
import shopCard from "../../ui/shopCard.vue";
import TheCarousel from "../../ui/TheCarousel.vue";



const props = defineProps({
  topProducts: {
    type: Array,
    required: true
  }
});


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
