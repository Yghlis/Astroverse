<template>
    <div class="carousel-container" ref="carouselContainer">
      <div class="carousel" ref="carousel">
        <slot></slot>
      </div>
      <button @click="prev" class="control prev">Previous</button>
      <button @click="next" class="control next">Next</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick } from "vue";
  import { animate } from "motion";
  
  const carousel = ref(null);
  const carouselContainer = ref(null);
  const currentIndex = ref(0);
  const items = ref([]);
  const itemWidth = 280; // Largeur de chaque carte
  const containerWidth = ref(0);
  
  onMounted(async () => {
    await nextTick();
    items.value = Array.from(carousel.value.children);
    containerWidth.value = carouselContainer.value.clientWidth;
    updateCarouselWidth();
    updateCarousel();
  });
  
  watch(items, () => {
    updateCarouselWidth();
  });
  
  const next = () => {
    if (currentIndex.value < items.value.length - Math.floor(containerWidth.value / itemWidth)) {
      currentIndex.value++;
    }
    updateCarousel();
  };
  
  const prev = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
    updateCarousel();
  };
  
  const updateCarousel = () => {
    const offset = -currentIndex.value * itemWidth;
    animate(carousel.value, { transform: `translateX(${offset}px)` });
  };
  
  const updateCarouselWidth = () => {
    const totalWidth = items.value.length * itemWidth;
    carousel.value.style.width = `${totalWidth}px`;
  };
  </script>
  
  <style lang="scss" scoped>
  .carousel-container {
    position: relative;
    width: 100%;
    height: 450px;
    overflow: hidden;
    display: flex;
    align-items: center;
    .carousel {
      height: 430px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 30px;
      transition: transform 0.5s ease;
      gap: 30px;
    }
    .control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
          background-color: rgba(0, 0, 0, 0.7);
      }
    }
    .prev {
      left: 10px;
    }
  
    .next {
      right: 10px;
    }
  }
  </style>
  