<template>
  <div class="container-shop">
    <div class="banner">
    </div>
    <SearchBar :searchText="searchText" @update:search="handleSearch" />
    <!-- <h1>{{ searchText }}</h1> -->
    <div class="sub_container">
      <TheFiltre />
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup>
import TheFiltre from '../components/shop/TheFiltre.vue';
import { ref } from 'vue';
import SearchBar from '../ui/SearchBar.vue';

const searchText = ref('');

const handleSearch = (text) => {
  searchText.value = text;
};


</script>

<style lang="scss" scoped>

.container-shop {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 auto;
  gap: 20px;
  .banner {
    width: 100%;
    height: 300px;
    background-color: #f2a45a;
  }
  .sub_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .right {
      width: 78%;
      height: 1000px;
      background-color: #f2a45a;
    }
  }
}
</style>
