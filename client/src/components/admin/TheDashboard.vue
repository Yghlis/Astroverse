<template>
  <div class="dashboard">
    <div class="top-page">
      <h2>Tableau de Bord</h2>
      <span class="material-symbols-outlined" @click="toggleModal">
        add_circle
      </span>
    </div>
    <div class="grid-stack">
      <div
        v-for="(card, index) in activeCards"
        :key="card.id"
        class="grid-stack-item"
        gs-auto-position="true"
        :gs-w="card.type === 'carte-3' ? 2 : 1"
        :gs-h="hightOfCard(card.type)"
        :gs-min-w="widthMinOfCard(card.type)"
        :gs-min-h="heightMinOfCard(card.type)"
        :gs-max-w="widthMaxOfCard(card.type)"
        :gs-max-h="heightMaxOfCard(card.type)"
      >
        <div
          class="grid-stack-item-content"
          :style="{ backgroundColor: card.backgroundColor }"
        >
          <component :is="getComponentType(card.type)" :card="card" />
        </div>
      </div>
    </div>
    <modalWidget :showModal="showModal" @update:hideWidgetModal="toggleModal">
      <h2 class="widget-title">Liste des Widgets</h2>
      <div
        class="switch-container"
        v-for="(card, index) in cards"
        :key="card.id"
      >
        <label :for="'switch-' + card.id" class="switch-label">{{
          card.title
        }}</label>
        <label class="switch">
          <input
            type="checkbox"
            :id="'switch-' + card.id"
            v-model="card.active"
            class="switch-input"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </modalWidget>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick, computed, watch } from "vue";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import CardType1 from "../../ui/CardType1.vue";
import CardType2 from "../../ui/CardType2.vue";
import CardType3 from "../../ui/CardType3.vue";
import modalWidget from "../../ui/modalWidget.vue";

const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const cards = reactive([
  {
    id: 1,
    type: "carte-1",
    title: "Total Des Utilisateurs",
    icon: "group",
    valueA: 2450,
    valueB: 15,
    typeArrow: "up",
    active: true,
  },
  {
    id: 2,
    type: "carte-1",
    title: "Croissance des Ventes",
    icon: "trending_up",
    valueA: 1200,
    valueB: 10,
    typeArrow: "down",
    active: true,
  },
  {
    id: 3,
    type: "carte-1",
    title: "Nouveaux Achats",
    icon: "shopping_cart",
    valueA: 890,
    valueB: 5,
    typeArrow: "up",
    active: true,
  },
  {
    id: 4,
    type: "carte-1",
    title: "Taux de Satisfaction",
    icon: "thumb_up",
    valueA: 1500,
    valueB: 20,
    typeArrow: "up",
    active: true,
  },
  {
    id: 5,
    type: "carte-1",
    title: "Revenus Totaux",
    icon: "account_balance",
    valueA: 3400,
    valueB: 8,
    typeArrow: "down",
    active: true,
  },
  {
    id: 6,
    type: "carte-1",
    title: "Temps Moyen",
    icon: "access_time",
    valueA: 400,
    valueB: 12,
    typeArrow: "up",
    active: true,
  },
  {
    id: 7,
    type: "carte-2",
    title: "Les Produits les plus Vendus",
    icon: "shopping_bag",
    items: [
      { name: "Produit 1", quantity: 120 },
      { name: "Produit 2", quantity: 90 },
      { name: "Produit 3", quantity: 80 },
    ],
    active: true,
  },
  {
    id: 8,
    type: "carte-3",
    title: "Total des Ventes",
    icon: "monetization_on",
    sales: {
      day: 120,
      month: 800,
      year: 5000,
      total: 15000,
    },
    active: true,
  },
]);

const activeCards = computed(() => cards.filter((card) => card.active));

const hightOfCard = (type) => {
  if (type === "carte-3" || type === "carte-2") {
    return 2;
  } else {
    return 1;
  }
};

const widthMinOfCard = (type) => {
  if (type === "carte-3") {
    return 2;
  } else {
    return 1;
  }
};

const heightMinOfCard = (type) => {
  if (type === "carte-3" || type === "carte-2") {
    return 2;
  } else {
    return 1;
  }
};

const heightMaxOfCard = (type) => {
  if (type === "carte-3") {
    return 3;
  } else if (type === "carte-2") {
    return 2;
  } else {
    return undefined;
  }
};

const widthMaxOfCard = (type) => {
  if (type === "carte-3") {
    return 2;
  } else {
    return undefined;
  }
};

const colors = [
  "#e5e1f8",
  "#f9f0e1",
  "#cef3fc",
  "#e1f8e5",
  "#f8e5e1",
  "#e5f4f8",
  "#f3e1f8",
  "#f8e1e1",
  "#e1f8f8",
  "#e1e5f8",
];

function assignColorsToCards(cards) {
  const uniqueColors = [...colors];
  const assignedColors = new Set();
  let colorIndex = 0;

  cards.forEach((card) => {
    if (assignedColors.size === uniqueColors.length) {
      assignedColors.clear();
    }

    while (assignedColors.has(uniqueColors[colorIndex])) {
      colorIndex = (colorIndex + 1) % uniqueColors.length;
    }

    card.backgroundColor = uniqueColors[colorIndex];
    assignedColors.add(uniqueColors[colorIndex]);
    colorIndex = (colorIndex + 1) % uniqueColors.length;
  });
}

assignColorsToCards(cards);

let grid;

const initGridStack = () => {
  grid = GridStack.init({
    float: true,
    cellHeight: "250px",
    margin: "10px",
    column: 3,
    disableOneColumnMode: true,
    disableResize: false,
    removable: true,
    resizable: {
      handles: "se",
      minWidth: 500,
      minHeight: 250,
      gridSize: 50,
    },
  });
};

const resetGridStack = async () => {
  if (grid) {
    grid.destroy(false); // Détruire GridStack sans enlever les éléments du DOM
  }
  await nextTick();
  initGridStack(); // Réinitialiser GridStack
};

watch(activeCards, async () => {
  await resetGridStack();
});

onMounted(async () => {
  await nextTick();
  initGridStack();
});

const getComponentType = (type) => {
  switch (type) {
    case "carte-1":
      return CardType1;
    case "carte-2":
      return CardType2;
    case "carte-3":
      return CardType3;
    default:
      return CardType1;
  }
};
</script>

<style lang="scss">
.dashboard {
  padding: 30px 0 0 30px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 20px;

  .top-page {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    h2 {
      color: black;
      font-family: "Montserrat", sans-serif;
      font-size: 36px;
      font-weight: bold;
    }
    .material-symbols-outlined {
      font-size: 44px;
      font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: all 0.3s ease;
      &:hover {
        cursor: pointer;
        transform: rotate(90deg);
      }
    }
  }

  .grid-stack {
    width: 100%;
    height: 100%;
  }

  .grid-stack-item {
    user-select: none;
  }

  .grid-stack-item-content {
    border-radius: 8px;
    cursor: grab;
  }

  .widget-title {
    font-family: "Montserrat", sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    user-select: none;
  }

  .switch-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px 30px;

    .switch-label {
      font-family: "Montserrat", sans-serif;
      font-size: 28px;
      font-weight: 500;
      color: #333;
      user-select: none;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 25px;

      .switch-input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 34px;

        &::before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
      }

      .switch-input:checked + .slider {
        background-color: #4caf50;
      }

      .switch-input:checked + .slider::before {
        transform: translateX(24px);
      }
    }
  }
}
</style>
