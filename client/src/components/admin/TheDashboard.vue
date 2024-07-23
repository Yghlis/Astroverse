<template>
  <div class="dashboard">
    <div class="top-page">
      <h2>Tableau de Bord</h2>
      <span class="material-symbols-outlined" @click="toggleModal">
        add_circle
      </span>
      <div class="reorder"  @click="reorderGrid">
        <p>Réorganiser</p>
        <span class="material-symbols-outlined">
          select_all
        </span>
      </div>
    </div>
    <div class="grid-stack" v-if="reload">
      <div
        v-for="(card, index) in activeCards"
        :key="card.id"
        class="grid-stack-item"
        :data-gs-id="card.id"
        :gs-auto-position="automaticPosition"
        :gs-x="card.x"
        :gs-y="card.y"
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
        v-for="(card, index) in widgetStore.cards"
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
            @change="saveState"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </modalWidget>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { useWidgetStore } from "../../stores/widgetStore";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import CardType1 from "../../ui/CardType1.vue";
import CardType2 from "../../ui/CardType2.vue";
import CardType3 from "../../ui/CardType3.vue";
import modalWidget from "../../ui/modalWidget.vue";

const widgetStore = useWidgetStore();

const showModal = ref(false);
const automaticPosition = ref(false);
const reload = ref(true);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const activeCards = computed(() =>
  widgetStore.cards.filter((card) => card.active)
);

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

let grid;

const initGridStack = () => {
  grid = GridStack.init({
    float: true,
    cellHeight: "250px",
    margin: "10px",
    column: 3,
    disableOneColumnMode: true,
    disableResize: true,
  });

  grid.on("dragstop", (event, element) => {
    const node = element.gridstackNode;
    if (node) {
      const cardId = parseInt(node.el.getAttribute("data-gs-id"));
      const card = widgetStore.cards.find((card) => card.id === cardId);
      if (card) {
        card.x = node.x;
        card.y = node.y;
        widgetStore.setCards([...widgetStore.cards]);
      }
    }
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
  automaticPosition.value = false;
  initGridStack();
  widgetStore.fetchKpi();
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

// Appeler cette fonction pour réorganiser les cartes
const reorderGrid = () => {
  automaticPosition.value = true;
  setTimeout(() => {
    resetGridStack();
    automaticPosition.value = false;
    widgetStore.deleteLocalCards();
  }, 500);
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
    .reorder {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-left: auto;
      margin-right: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        p {
          transform: translateX(-20px);
        }
        .material-symbols-outlined {
          cursor: pointer;
          transform: scale(1.3);
        }
      }

      p {
        font-family: "Montserrat", sans-serif;
        font-size: 24px;
        font-weight: bold;
        transition: all 0.3s ease;
      }

      .material-symbols-outlined {
        font-size: 44px;
        font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
        transition: all 0.3s ease;
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
    width: 100%;
    margin-bottom: 10px;
    padding: 10px 30px;

    .switch-label {
      font-family: "Montserrat", sans-serif;
      font-size: 28px;
      font-weight: 500;
      color: #333;
      user-select: none;
      width: 80%;
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
