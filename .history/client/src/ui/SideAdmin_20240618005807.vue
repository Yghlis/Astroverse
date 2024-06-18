<template>
  <button v-if="!showSideBar" class="open-btn" @click="toggleNav">
    <span class="material-symbols-outlined"> arrow_circle_right </span>
  </button>
  <Transition name="slide">
    <div v-if="showSideBar" class="side-bar">
      <button class="close-btn" @click="toggleNav">
        <span class="material-symbols-outlined"> arrow_circle_left </span>
      </button>
      <div class="slot-content">
        <slot>
          <p>Contenu par défaut si aucun contenu n'est passé.</p>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  showSideBar: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:hideSideBarAdmin"]);

const toggleNav = () => {
  emit("update:hideSideBarAdmin", !props.showSideBar);
};
</script>

<style lang="scss" scoped>
.open-btn {
  position: fixed;
  top: 120px;
  left: 10px;
  cursor: pointer;
  color: black;
  background-color: white;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 100%;
  border: 1px solid #f2a45a;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  &:hover {
    color: white;
    background-color: #f2a45a;
    transform: scale(1.1);
  }
  .material-symbols-outlined {
    font-size: 30px;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
    transition: transform 0.5s ease;
  }
}
.side-bar {
  position: fixed;
  top: 100px;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 10;
  padding-top: 20px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 15px;
  .close-btn {
    cursor: pointer;
    color: black;
    background-color: white;
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 100%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
    margin-right: 15px;
    &:hover {
      color: white;
      background-color: #ff2c2c;
      transform: scale(1.1);
    }
    .material-symbols-outlined {
      font-size: 30px;
      font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
  }
  .slot-content {
    padding: 20px;
    width: 100%;
  }
}

// Transition de slide
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Transition de fondu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
