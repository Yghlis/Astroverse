<template>
  <div class="dashboard">
    <div
      v-for="(card, index) in cards"
      :key="card.id"
      :ref="'card-' + index"
      class="card"
      @mousedown="startDrag(card, index, $event)"
    >
      <div class="card-content">
        {{ card.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { animate } from "motion";

const cards = reactive([
  { id: 1, title: "KPI 1" },
  { id: 2, title: "KPI 2" },
  { id: 3, title: "KPI 3" },
  // Ajoutez plus de cartes si nécessaire
]);

const startDrag = (card, index, event) => {
  const draggedElement = event.target;
  const originalIndex = index;
  let currentIndex = index;

  const onMouseMove = (e) => {
    draggedElement.style.position = "absolute";
    draggedElement.style.zIndex = 1000;
    draggedElement.style.left = e.pageX - draggedElement.offsetWidth / 2 + "px";
    draggedElement.style.top = e.pageY - draggedElement.offsetHeight / 2 + "px";

    const newIndex = getNewIndex(e.clientX, e.clientY);

    if (newIndex !== -1 && newIndex !== currentIndex) {
      moveCard(originalIndex, newIndex);
      currentIndex = newIndex;
    }
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    resetCardStyles();
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const getNewIndex = (x, y) => {
  let newIndex = -1;
  cards.forEach((card, index) => {
    const cardElement = document.querySelector(`.card:nth-child(${index + 1})`);
    const rect = cardElement.getBoundingClientRect();
    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
      newIndex = index;
    }
  });
  return newIndex;
};

const moveCard = (fromIndex, toIndex) => {
  if (fromIndex !== toIndex) {
    const movedCard = cards.splice(fromIndex, 1)[0];
    cards.splice(toIndex, 0, movedCard);
  }
};

const resetCardStyles = () => {
  const cardElements = document.querySelectorAll(".card");
  cardElements.forEach((card) => {
    card.style.position = "";
    card.style.zIndex = "";
    card.style.left = "";
    card.style.top = "";
  });
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  width: 200px;
  height: 150px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    opacity: 0.8;
  }

  .card-content {
    font-size: 1.2rem;
    font-weight: bold;
  }
}
</style>
