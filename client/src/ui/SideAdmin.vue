<template>
  <div class="side-bar" ref="sidebar">
    <div class="logo">
      <img
        :class="{ mini: !showSideBar }"
        :src="logoPath"
        alt="Logo"
        class="logo"
      />
      <transition name="fade-translate">
        <h1 v-if="showSideBar">Astroverse</h1>
      </transition>
    </div>
    <div class="divider"></div>
    <div class="control">

        <h3 v-if="showSideBar">Administration</h3>
 
      <button v-if="showSideBar" class="btn close" @click="toggleNav">
        <span class="material-symbols-outlined"> arrow_circle_left </span>
      </button>
      <button v-if="!showSideBar" class="btn open" @click="toggleNav">
        <span class="material-symbols-outlined"> arrow_circle_right </span>
      </button>
    </div>

    <div class="slot-content">
      <slot>
        <p>Contenu par défaut si aucun contenu n'est passé.</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { animate } from "motion";
import logoPath from "../assets/images/logo.png";

const props = defineProps({
  showSideBar: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:hideSideBarAdmin"]);
const sidebar = ref(null);
const isAnimating = ref(false);

const toggleNav = () => {
  if (!isAnimating.value) {
    emit("update:hideSideBarAdmin", !props.showSideBar);
  }
};

watch(
  () => props.showSideBar,
  async (newVal) => {
    await nextTick();
    isAnimating.value = true;
    if (newVal) {
      animate(
        sidebar.value,
        { width: "300px" },
        { duration: 0.5 }
      ).finished.then(() => {
        isAnimating.value = false;
      });
    } else {
      animate(
        sidebar.value,
        { width: "75px" },
        { duration: 0.5 }
      ).finished.then(() => {
        isAnimating.value = false;
      });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.side-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 10;
  padding-top: 20px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 15px;
  transform: translateX(0);
  .logo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    h1 {
      font-size: 32px;
      color: black;
    }
    img {
      width: 100px;
      height: 100px;
      &.mini {
        width: 75px;
        height: 75px;
      }
    }
  }
  .divider {
    width: 90%;
    height: 2px;
    background-color: #b1b1b1;
    margin: 5px 0;
  }
  .control {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    h3 {
      font-size: 24px;
      color: #808080;
      margin: 20px 0;
    }
    .btn {
      cursor: pointer;
      color: black;
      background-color: transparent;
      padding: 5px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      &.open {
        &:hover {
          color: #007bff;
        }
      }
      &.close {
        &:hover {
          color: #ff2c2c;
        }
      }
      .material-symbols-outlined {
        font-size: 35px;
        font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
        transition: transform 0.5s ease;
      }
    }
  }
  .slot-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}

@keyframes blueLightWave {
  0% {
    box-shadow: 0 0 0 0 #007bff;
  }
  100% {
    box-shadow: 0 0 20px 20px rgba(0, 0, 255, 0);
  }
}
.fade-translate-enter-active,
.fade-translate-leave-active {
  transition: opacity 0.5s ease, transform 0.3s ease;
}

.fade-translate-enter,
.fade-translate-leave-to  {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
