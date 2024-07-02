<template>
  <div class="search">
    <h2>Find Something</h2>
    <div class="search-bar">
      <SearchBar></SearchBar>
    </div>
  </div>
</template>

<script setup>
import SearchBar from "../../ui/SearchBar.vue";
</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 50px;
  width: 80%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
    margin-top: 0;
  }
  .search-bar {
    width: 100%;
  }
}
</style>
