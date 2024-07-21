<template>
    <div class="card" :style="{ backgroundColor: card.backgroundColor }">
      <span class="material-symbols-outlined option"> more_vert </span>
      <span class="material-symbols-outlined"> {{ card.icon }} </span>
      <h3>{{ card.title }}</h3>
      <div class="card-values">
        <p>{{ card.valueA }}</p>
        <div class="valueB" v-if="card.valueB">
          <span class="material-symbols-outlined">
            {{ card.typeArrow == "up" ? "arrow_upward" : "arrow_downward" }}</span>
          <p>{{ card.valueB }}</p>
          <span>%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';import 'gridstack/dist/gridstack.min.css';

  
  const props = defineProps({
    card: {
      type: Object,
      required: true
    }
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
      margin: auto 0 0 0;
    }
    .card-values {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      width: 100%;
      p {
        font-family: "Montserrat", sans-serif;
        margin: 0;
        font-size: 50px;
        font-weight: bold;
      }
      .valueB {
        margin-left: auto;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        border: 1px solid black;
        padding: 5px 10px;
        border-radius: 25px;
        span {
          font-size: 22px;
          font-weight: bold;
        }
        p {
          font-family: "Montserrat", sans-serif;
          margin: 0;
          font-size: 22px;
          font-weight: bold;
        }
      }
    }
  }
  </style>
  