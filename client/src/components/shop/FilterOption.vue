<template>
  <div ref="optionAnimation" class="filter-section">
    <div
      :class="['filter-section-title', { active: isOptionVisible }]"
      @click="toggleOption"
    >
      <p>{{ optionNameInFrench }}</p>
      <span ref="arrowDown" class="material-symbols-outlined"
        >keyboard_arrow_down</span
      >
    </div>
    <transition name="fade-slide">
      <div
        v-show="isOptionVisible"
        ref="filterContent"
        class="filter-section-content"
      >
        <div v-if="optionType === 'checkbox'" class="checkbox-options">
          <div
            v-for="option in optionValues"
            :key="option.value"
            class="filter-option"
          >
            <input
              type="checkbox"
              :id="option.value + optionName"
              v-model="selectedCheckboxes"
              :value="option.value"
              @change="emitCheckboxChange"
            />
            <label :for="option.value + optionName">{{ option.label }}</label>
          </div>
        </div>
        <div v-else-if="optionType === 'range'" class="range-option">
          <div class="range-controls">
            <label :for="optionName + '-min'"
              >{{ optionNameInFrench }} Min</label
            >
            <input
              type="range"
              :id="optionName + '-min'"
              v-model="selectedMin"
              :min="rangeMin"
              :max="rangeMax"
              @change="emitRangeChange"
            />
            <span>{{ selectedMin }} €</span>
          </div>
          <div class="range-controls">
            <label :for="optionName + '-max'"
              >{{ optionNameInFrench }} Max</label
            >
            <input
              type="range"
              :id="optionName + '-max'"
              v-model="selectedMax"
              :min="rangeMin"
              :max="rangeMax"
              @change="emitRangeChange"
            />
            <span>{{ selectedMax }} €</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, computed } from "vue";
import { timeline } from "motion";

const arrowDown = ref(null);
const optionAnimation = ref(null);
const filterContent = ref(null);

const props = defineProps({
  optionName: String,
  optionType: String,
  optionValues: Array,
  rangeMin: Number,
  rangeMax: Number,
  resetEvent: Boolean,
  selectedValues: [Array, Object, Boolean],
});

const selectedCheckboxes = ref([]);
const selectedMin = ref(props.rangeMin);
const selectedMax = ref(props.rangeMax);
const isOptionVisible = ref(false);

const optionNameInFrench = computed(() => {
  switch (props.optionName) {
    case "price":
      return "Prix";
    case "characters":
      return "Personnages";
    case "universes":
      return "Univers";
    case "ratings":
      return "Évaluations";
    default:
      return props.optionName;
  }
});

const toggleOption = async () => {
  isOptionVisible.value = !isOptionVisible.value;
  await nextTick();
  showFilterOption();
};

const emit = defineEmits(["update:checkboxes", "update:range"]);

const emitCheckboxChange = () => {
  emit("update:checkboxes", {
    optionName: props.optionName,
    values: selectedCheckboxes.value,
  });
};

const emitRangeChange = () => {
  emit("update:range", {
    optionName: props.optionName,
    min: selectedMin.value,
    max: selectedMax.value,
  });
};

watch(
  () => props.resetEvent,
  (newVal) => {
    if (newVal) {
      resetFilters();
    }
  }
);

watch(
  () => props.rangeMin,
  (newVal) => {
    selectedMin.value = newVal;
  }
);

watch(
  () => props.rangeMax,
  (newVal) => {
    selectedMax.value = newVal;
  }
);

watch(
  () => selectedMin.value,
  (newVal) => {
    if (newVal > selectedMax.value) {
      selectedMax.value = newVal;
    }
    if (newVal == props.rangeMin) {
      emitRangeChange();
    }
  }
);

watch(
  () => selectedMax.value,
  (newVal) => {
    if (newVal < selectedMin.value) {
      selectedMin.value = newVal;
    }
    if (newVal == props.rangeMax) {
      emitRangeChange();
    }
  }
);

watch(
  () => props.selectedValues,
  (newVal) => {
    if (props.optionType === "checkbox") {
      selectedCheckboxes.value = newVal || [];
    } else if (props.optionType === "range") {
      selectedMin.value = newVal?.min || props.rangeMin;
      selectedMax.value = newVal?.max || props.rangeMax;
    }
  },
  { immediate: true }
);

const resetFilters = () => {
  selectedCheckboxes.value = [];
  selectedMin.value = props.rangeMin;
  selectedMax.value = props.rangeMax;
};

const showFilterOption = () => {
  const element = optionAnimation.value;
  const content = filterContent.value;
  const arrow = arrowDown.value;

  if (element && content && arrow) {
    const contentHeight = content.scrollHeight;

    const sequence = isOptionVisible.value
      ? [
          [element, { height: `${contentHeight + 50}px` }],
          [arrow, { rotate: "180deg" }, { at: "<" }],
        ]
      : [
          [element, { height: "50px" }],
          [arrow, { rotate: "0deg" }, { at: "<" }],
        ];
    timeline(sequence, { duration: 0.3 });
  }
};
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

    .checkbox-options {
      user-select: none;
      .filter-option {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        input {
          margin-right: 10px;
          cursor: pointer;
          appearance: none;
          height: 15px;
          width: 15px;
          background-color: white;
          border: 1px solid #000;
          border-radius: 3px;
          transition: all 0.2s ease;
          &:checked {
            background-color: black !important;
            position: relative;
            &::after {
              content: "";
              position: absolute;
              left: 5px;
              top: 2px;
              width: 2px;
              height: 7px;
              border: solid white;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
            }
          }
        }
        label {
          font-size: 15px;
          cursor: pointer;
        }
      }
    }

    .range-option {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      .range-controls {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        label {
          font-size: 15px;
          margin-bottom: 5px;
          user-select: none;
        }
        input[type="range"] {
          width: 100%;
          margin-bottom: 5px;
        }
        span {
          align-self: flex-end;
          background-color: black;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
        }
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
