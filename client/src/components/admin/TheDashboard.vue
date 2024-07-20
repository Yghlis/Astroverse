<template>
  <div class="dashboard">
    <h2>Tableau de Bord</h2>
    <div class="widget-area">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card"
        :style="{ backgroundColor: card.backgroundColor }"
      >
        <span class="material-symbols-outlined"> {{ card.icon }} </span>
        <h3>{{ card.title }}</h3>
        <div class="card-values">
          <p>{{ card.valueA }}</p>
          <div class="valueB">
            <span class="material-symbols-outlined">
              {{ card.type == "up" ? "arrow_upward" : "arrow_downward" }}</span
            >
            <p>{{ card.valueB }}</p>
            <span>%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { animate } from "motion";

const cards = reactive([
  {
    id: 1,
    title: "KPI 1",
    backgroundColor: "#e5e1f8",
    icon: "group",
    title: "Total Des Utilisateurs",
    valueA: 2450,
    valueB: 15,
    type: "up",
  },
  {
    id: 2,
    title: "KPI 2",
    backgroundColor: "#f9f0e1",
    icon: "trending_up",
    title: "Croissance des Ventes",
    valueA: 1200,
    valueB: 10,
    type: "down",
  },
  {
    id: 3,
    title: "KPI 3",
    backgroundColor: "#cef3fc",
    icon: "shopping_cart",
    title: "Nouveaux Achats",
    valueA: 890,
    valueB: 5,
    type: "up",
  },
]);
</script>

<style scoped lang="scss">
.dashboard {
  padding: 30px 0 0 30px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 20px;
  background-color: rgb(63, 63, 63);
  h2 {
    color: black;
    font-family: "Montserrat", sans-serif;
    font-size: 36px;
    font-weight: bold;
  }

  .widget-area {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    height: 100%;
    .card {
      width: 30%;
      max-width: 500px;
      height: 250px;
      border-radius: 8px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding: 35px 20px;
      .material-symbols-outlined {
        font-size: 38px;
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
          font-family: 'Montserrat', sans-serif;
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
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            font-size: 22px;
            font-weight: bold;
          }
        }
      }

      transition: transform 0.3s;
      cursor: grab;
    }
  }
}
</style>
