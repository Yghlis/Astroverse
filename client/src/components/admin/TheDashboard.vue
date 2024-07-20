<template>
  <div class="dashboard">
    <h2>Tableau de Bord</h2>
    <transition-group
      name="list"
      tag="div"
      class="widget-area"
      ref="widgetArea"
    >
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card"
        :style="{ backgroundColor: card.backgroundColor }"
        :data-index="index"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent
        @dragenter="onDragEnter($event, index)"
        @dragend="onDragEnd"
      >
        <span class="material-symbols-outlined option"> more_vert </span>
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
    </transition-group>
  </div>
</template>

<script setup>
import { reactive, ref} from "vue";

const cards = reactive([
  {
    id: 1,
    title: "Total Des Utilisateurs",
    backgroundColor: "#e5e1f8",
    icon: "group",
    valueA: 2450,
    valueB: 15,
    type: "up",
  },
  {
    id: 2,
    title: "Croissance des Ventes",
    backgroundColor: "#f9f0e1",
    icon: "trending_up",
    valueA: 1200,
    valueB: 10,
    type: "down",
  },
  {
    id: 3,
    title: "Nouveaux Achats",
    backgroundColor: "#cef3fc",
    icon: "shopping_cart",
    valueA: 890,
    valueB: 5,
    type: "up",
  },
  {
    id: 4,
    title: "Taux de Satisfaction",
    backgroundColor: "#e1f8e5",
    icon: "thumb_up",
    valueA: 1500,
    valueB: 20,
    type: "up",
  },
  {
    id: 5,
    title: "Revenus Totaux",
    backgroundColor: "#f8e5e1",
    icon: "account_balance",
    valueA: 3400,
    valueB: 8,
    type: "down",
  },
  {
    id: 6,
    title: "Temps Moyen",
    backgroundColor: "#e5f4f8",
    icon: "access_time",
    valueA: 400,
    valueB: 12,
    type: "up",
  },
  {
    id: 7,
    title: "Nouveaux Utilisateurs",
    backgroundColor: "#f3e1f8",
    icon: "people",
    valueA: 500,
    valueB: 18,
    type: "up",
  },
]);

const draggedIndex = ref(null);
let canSwap = true;

const onDragStart = (event, index) => {
  draggedIndex.value = index;
};

const onDragEnter = (event, index) => {
  if (index !== draggedIndex.value && canSwap) {
    canSwap = false;
    const temp = cards[draggedIndex.value];
    cards.splice(draggedIndex.value, 1);
    cards.splice(index, 0, temp);
    draggedIndex.value = index;
    setTimeout(() => {
      canSwap = true;
    }, 300);
  }
};

const onDragEnd = () => {
  draggedIndex.value = null;
};
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
    .card {
      user-select: none;
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

      transition: transform 0.3s;
      cursor: grab;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
