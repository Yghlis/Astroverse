<template>
  <div class="highlight">
    <h1>Top Products</h1>
    <div class="products">
      <shopCard></shopCard>
      <shopCard></shopCard>
      <shopCard></shopCard>
    </div>
  </div>
</template>

<script setup>
import shopCard from '../../ui/shopCard.vue';

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
