<template>
  <div class="filter">
    <div class="filter-header">
      <h2>Filter</h2>
    </div>
    <div class="filter-body">
      <FilterOption
        v-for="option in filterOptions"
        :key="option.id"
        :option-name="option.optionName"
        :option-type="option.optionType"
        :option-values="option.optionValues"
        :range-min="option.rangeMin"
        :range-max="option.rangeMax"
      />
    </div>
  </div>
</template>

<script setup>
import FilterOption from "./FilterOption.vue";
import { reactive } from "vue";

// ################################################################# API CALL #################################################################
const filterOptions = reactive([
  {
    id: 1,
    optionName: "Category",
    optionType: "checkbox",
    optionValues: [
      { value: "manga", label: "Manga" },
      { value: "anime", label: "Anime" },
      { value: "movie", label: "Movie" },
    ],
  },
  {
    id: 2,
    optionName: "Price",
    optionType: "range",
    rangeMin: 0,
    rangeMax: 100,
  },{
    id: 3,
    optionName: "Autres",
    optionType: "range",
    optionValues: [
      { value: "0-20", label: "0-20" },
      { value: "20-50", label: "20-50" },
      { value: "50-100", label: "50-100" },
    ],
  },
]);
</script>

<style lang="scss" scoped>
.filter {
  width: 20%;
  max-width: 250px;
  height: 1000px;
  background-color: white;
  border-radius: 15px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  .filter-header {
    width: 100%;
    height: 50px;
    background-color: black;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    h2 {
      color: white;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .filter-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
