<template>
  <div class="dashboard">
    <h2>Tableau de Bord</h2>
    <div class="grid-stack">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="grid-stack-item"
        gs-auto-position="true"
        :gs-w="card.type === 'carte-3' ? 2 : 1"
        :gs-h="hightOfCard(card.type)"
        :gs-min-w="card.type === 'carte-3' ? 2 : 1"
        :gs-min-h="card.type === 'carte-3' ? 2 : 1"
        :gs-max-w="card.type === 'carte-3' ? 2 : undefined"
        :gs-max-h="card.type === 'carte-3' ? 3 : undefined"
      >
        <div
          class="grid-stack-item-content"
          :style="{ backgroundColor: card.backgroundColor }"
        >
          <component :is="getComponentType(card.type)" :card="card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick, computed } from "vue";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import CardType1 from "../../ui/CardType1.vue";
import CardType2 from "../../ui/CardType2.vue";
import CardType3 from "../../ui/CardType3.vue";

const cards = reactive([
  {
    id: 1,
    type: "carte-1",
    title: "Total Des Utilisateurs",
    icon: "group",
    valueA: 2450,
    valueB: 15,
    typeArrow: "up",
  },
  {
    id: 2,
    type: "carte-1",
    title: "Croissance des Ventes",
    icon: "trending_up",
    valueA: 1200,
    valueB: 10,
    typeArrow: "down",
  },
  {
    id: 3,
    type: "carte-1",
    title: "Nouveaux Achats",
    icon: "shopping_cart",
    valueA: 890,
    valueB: 5,
    typeArrow: "up",
  },
  {
    id: 4,
    type: "carte-1",
    title: "Taux de Satisfaction",
    icon: "thumb_up",
    valueA: 1500,
    valueB: 20,
    typeArrow: "up",
  },
  {
    id: 5,
    type: "carte-1",
    title: "Revenus Totaux",
    icon: "account_balance",
    valueA: 3400,
    valueB: 8,
    typeArrow: "down",
  },
  {
    id: 6,
    type: "carte-1",
    title: "Temps Moyen",
    icon: "access_time",
    valueA: 400,
    valueB: 12,
    typeArrow: "up",
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
  },
]);

const hightOfCard = (type) => {
  if (type === "carte-3" || type === "carte-2") {
    return 2;
  } else {
    return 1;
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

onMounted(async () => {
  await nextTick();
  const grid = GridStack.init({
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

  h2 {
    color: black;
    font-family: "Montserrat", sans-serif;
    font-size: 36px;
    font-weight: bold;
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
}
</style>
