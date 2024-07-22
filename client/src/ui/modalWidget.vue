<template>
    <Transition name="fade">
      <div v-if="showModal" class="overlay"></div>
    </Transition>
    <Transition name="slide">
      <div v-if="showModal" class="side-bar">
        <button class="close-btn" @click="toggle">
          <span class="material-symbols-outlined">close</span>
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
    showModal: {
      type: Boolean,
      default: false,
    },
  });
  

  const emit = defineEmits([
    "update:hideWidgetModal",
  ]);
  

  const toggle = () => {
    emit("update:hideWidgetModal", false);
  };
  </script>
  
  <style lang="scss" scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .side-bar {
    position: fixed;
    top: 0;
    right: 0;
    width: 500px;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 1000;
    padding-top: 20px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
        transform: scale(1.1) rotate(180deg);
      }
      .material-symbols-outlined {
        font-size: 30px;
        font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
        transition: transform 0.5s ease;
      }
    }
    .slot-content {
      padding: 20px;
      width: 100%;
      overflow-y: auto;
    }
  }
  
  // Transition de slide
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s ease;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
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
  