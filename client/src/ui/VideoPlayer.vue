<template>
    <div class="carousel">
      <div class="carousel-item">
        <img  :src="currentMedia.url" alt="carousel media" />
      </div>
      <button class="call-to-action" v-if="currentMedia.link" @click="goToLink">Voir le produit</button>
      <div class="controls">
        <button @click="goToPrevious">
          <span class="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        <button @click="goToNext">
          <span class="material-symbols-outlined"> arrow_forward_ios</span>
        </button>
      </div>
      <div class="indicators">
        <span
          v-for="(item, index) in props.mediaItems"
          :key="index"
          @click="goToSlide(index)"
          :class="{ active: index === currentIndex }"
          class="dot"
        ></span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";

  
  const props = defineProps({
    mediaItems: {
      type: Array,
      required: true,
    },
  });
  
  const currentIndex = ref(0);
  
  const currentMedia = computed(() => props.mediaItems[currentIndex.value]);
  
  const goToNext = () => {
    currentIndex.value = (currentIndex.value + 1) % props.mediaItems.length;
  };
  
  const goToPrevious = () => {
    currentIndex.value =
      (currentIndex.value - 1 + props.mediaItems.length) %
      props.mediaItems.length;
  };
  
  const goToSlide = (index) => {
    currentIndex.value = index;
  };
  
  const goToLink = () => {
    if (currentMedia.value.link) {
      window.location.href = currentMedia.value.link;
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .carousel {
    position: relative;
    width: 100%;
    height: 700px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .carousel-item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(33, 33, 33);
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      iframe {
        width: 100%;
        height: 100%;
      }
      video {
        width: 100%;
        height: 100%;
      }
    }
  }
  
  .controls {
    position: absolute;
    width: 95%;
    display: flex;
    justify-content: space-between;
    button {
      background-color: transparent;
      border: none;
      border-radius: 100%;
      padding: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: grey;
      &:nth-child(1) {
        transform: rotate(180deg);
        &:hover {
          transform: scale(1.1) rotate(180deg);
        }
      }
      &:hover {
        background-color: #f2a45a;
        color: black;
        transform: scale(1.1);
      }
    }
  }
  
  .call-to-action {
    position: absolute;
    bottom: 20px;
    right: 30px;
    padding: 10px 20px;
    background-color: #f2a45a;
    color: white;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 5px;
    &:hover {
      background-color: #d68b44;
    }
  }
  
  .indicators {
    position: absolute;
    bottom: 30px;
    left: 30px;
    display: flex;
    gap: 5px;
    .dot {
      width: 20px;
      height: 20px;
      background-color: rgb(126, 126, 126);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      &.active {
        background-color: #f2a45a;
      }
      &:hover {
        transform: scale(1.2);
      }
    }
  }
  </style>
  