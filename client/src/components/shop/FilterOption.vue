<template>
    <div ref="optionAnimation" class="filter-section">
      <div :class="['filter-section-title', { 'active': isOptionVisible }]" @click="toggleOption">
        <p>{{ optionName }}</p>
        <span ref="arrowDown" class="material-symbols-outlined">keyboard_arrow_down</span>
      </div>
      <transition name="fade-slide">
        <div v-show="isOptionVisible" ref="filterContent" class="filter-section-content">
          <div
            v-for="option in optionValues"
            :key="option.value"
            class="filter-option"
          >
            <input
              type="checkbox"
              :id="option.value"
              v-model="selectedCheckboxes"
              :value="option.value"
            />
            <label :for="option.value">{{ option.label }}</label>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick } from "vue";
  import { animate, timeline } from "motion";
  
  const arrowDown = ref(null);
  const optionAnimation = ref(null);
  const filterContent = ref(null);

  
  const props = defineProps({
    optionName: String,
    optionValues: Array,
  });
  
  const selectedCheckboxes = ref([]);
  const isOptionVisible = ref(false);
  
  const toggleOption = async () => {
    isOptionVisible.value = !isOptionVisible.value;
    await nextTick(); // Ensure the DOM is updated before animating
    showFilterOption();
  };



  //Animation

  const showFilterOption = () => {
  const element = optionAnimation.value;
  const content = filterContent.value;
  const arrow = arrowDown.value;

  if (element && content && arrow) {
    const contentHeight = content.scrollHeight;

    const sequence = isOptionVisible.value
      ? [
          [element, { height: `${contentHeight + 50}px` }],
          [arrow, { rotate: "180deg" }, { at: '<' }],
        ]
      : [
          [element, { height: "50px" }],
          [arrow, { rotate: "0deg" }, { at: '<' }],
        ];
    timeline(sequence, { duration: 0.3 });
  }
};
  
  // Optional: Watch for changes in isOptionVisible to animate on visibility change
  watch(isOptionVisible, (newVal) => {
    if (newVal) {
      showFilterOption();
    }
  });


  
  </script>
  
  <style lang="scss" scoped>
  .filter-section {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-bottom: 1px solid #e7e7e7;
    position: relative;
  
    .filter-section-title {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #f2f2f2;
      }
      &.active {
        background-color: #f2f2f2;
      }
      p {
        font-size: 17px;
        font-weight: 700;
        margin: 0;
      }
      .material-symbols-outlined {
        font-size: 30px;
        font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      }
    }
    .filter-section-content {
      position: absolute;
      top: 50px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 5px;
      padding: 10px 10px 20px 10px;
      .filter-option {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        input {
          margin-right: 10px;
        }
        label {
          font-size: 15px;
        }
      }
    }
  }
  
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.3s ease;
  }
  .fade-slide-enter-from {
    transform: translateY(-50px);
    opacity: 0;
  }
  .fade-slide-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
  .fade-slide-leave-from {
    transform: translateY(0);
    opacity: 1;
  }
  .fade-slide-leave-to {
    transform: translateY(-50px);
    opacity: 0;
  }
  </style>
  