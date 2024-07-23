<template>
  <div class="card" :style="{ backgroundColor: card.backgroundColor }">
    <span class="material-symbols-outlined option"> more_vert </span>
    <span class="material-symbols-outlined"> {{ card.icon }} </span>
    <h3>{{ card.title }}</h3>
    <ul>
      <li v-for="(item, index) in card.items" :key="index">
        <span>{{ item.name }}</span>
        <span>{{ index + 1 }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.card {
  user-select: none;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  padding: 35px 20px;
  position: relative;
  .option {
    position: absolute;
    top: 35px;
    right: 20px;
    cursor: pointer;
  }
  .material-symbols-outlined {
    font-size: 44px;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }
  h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 8px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;

    li {
      padding: 30px 20px;
      border-radius: 8px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: #000000;
      span {
        font-family: "Roboto", sans-serif;
        font-size: 24px;
        font-weight: 500;
      }
    }
  }
}
</style>
