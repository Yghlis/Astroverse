<template>
  <div>
    <Transition name="fade">
      <div v-if="responsiveFilterOverlay" class="overlay"></div>
    </Transition>
    <div class="filter">
      <div class="filter-header">
        <h2>Filter</h2>
        <div v-if="NombreDeFilter" class="number-filtre">
          <span>{{ NombreDeFilter }}</span>
        </div>
        <h2 class="mobile-header">
          {{ nombreDeProduit }} produits correspondent
        </h2>
        <button class="mobile-header" @click="openFilter">
          FILTRER
          <div v-if="NombreDeFilter" class="number-filtre">
            <span>{{ NombreDeFilter }}</span>
          </div>
        </button>
      </div>
      <Transition :name="transitionName">
        <div v-show="responsiveFilter" class="filter-body">
          <div class="mobile-header">
            <div class="filter-body-title">
              <span class="material-symbols-outlined"> tune </span>
              <h2>Trier / Filtrer</h2>
            </div>
            <button class="close-btn" @click="openFilter">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <FilterOption
            v-for="option in filterOptions"
            :key="option.id"
            :option-name="option.optionName"
            :option-type="option.optionType"
            :option-values="option.optionValues"
            :range-min="option.rangeMin"
            :range-max="option.rangeMax"
            @update:checkboxes="handleCheckboxUpdate"
            @update:range="handleRangeUpdate"
            :reset-event="resetEvent"
            :rating="option.rating"
          />
          <button class="reset" @click="resetFilters">
            Réinitialiser les filtres
          </button>
        </div>
      </Transition>
    </div>
    {{ selectedFilters }}
  </div>
</template>

<script setup>
import FilterOption from "./FilterOption.vue";
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  watchEffect,
  nextTick,
  computed,
} from "vue";
import { useShopStore } from "../../stores/useShopStore";

const nombreDeProduit = ref(0);
const NombreDeFilter = ref(0);
const responsiveFilter = ref(false);
const responsiveFilterOverlay = ref(false);
const screenWidth = ref(window.innerWidth);
const transitionName = ref("slideUp");
const resetEvent = ref(false);

// Props
const props = defineProps({
  filterOptions: {
    type: Array,
    required: true,
  },
  selectedFilters: {
    type: Object,
    required: true,
  },
});


// Stockage des valeurs initiales de priceRange
const initialPriceRange = reactive({ min: 0, max: 0 });

onMounted(() => {
  initialPriceRange.min = parseFloat(props.selectedFilters.priceRange.min);
  initialPriceRange.max = parseFloat(props.selectedFilters.priceRange.max);
  updateNombreDeFilter(); // Mettre à jour le compteur initial
});

// ################################################################# Filter Logic #################################################################

const updateNombreDeFilter = () => {
  let count = 0;

  count += props.selectedFilters.characters.length;
  count += props.selectedFilters.universes.length;
  count += props.selectedFilters.ratings.length;

  // Vérifie si priceRange a été modifié par rapport à la valeur par défaut { min: 0, max: 0 }
  // ou par rapport aux valeurs initiales
  if (
    props.selectedFilters.priceRange.min !== initialPriceRange.min ||
    props.selectedFilters.priceRange.max !== initialPriceRange.max
  ) {
    count += 1;
  }

  if (props.selectedFilters.promotion) {
    count += 1;
  }

  NombreDeFilter.value = count;
};

// Watchers pour surveiller les modifications des filtres
watch(() => props.selectedFilters.characters, updateNombreDeFilter, {
  deep: true,
});
watch(() => props.selectedFilters.universes, updateNombreDeFilter, {
  deep: true,
});
watch(() => props.selectedFilters.ratings, updateNombreDeFilter, {
  deep: true,
});
watch(() => props.selectedFilters.priceRange, updateNombreDeFilter, {
  deep: true,
});
watch(() => props.selectedFilters.promotion, updateNombreDeFilter);

const handleCheckboxUpdate = ({ optionName, values }) => {
  props.selectedFilters[optionName] = values;
};

const handleRangeUpdate = ({ optionName, min, max }) => {
  props.selectedFilters.priceRange = { min, max };
};

const resetFilters = () => {
  props.selectedFilters.characters = [];
  props.selectedFilters.universes = [];
  props.selectedFilters.ratings = [];
  props.selectedFilters.priceRange = { min: 0, max: 0 };
  props.selectedFilters.is_promotion = false;

  updateNombreDeFilter();

  resetEvent.value = true;
  setTimeout(() => {
    resetEvent.value = false;
  }, 0);
};

// ################################################################# RESPONSIVE FILTER #################################################################

const openFilter = () => {
  responsiveFilter.value = !responsiveFilter.value;
  responsiveFilterOverlay.value = !responsiveFilterOverlay.value;
};

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

const handleResize = () => {
  transitionName.value = "";
  updateScreenWidth();
  setTimeout(() => {
    transitionName.value = "slideUp";
  }, 50);
};

onMounted(() => {
  if (screenWidth.value >= 768) {
    responsiveFilter.value = true;
  } else if (screenWidth.value < 768) {
    responsiveFilter.value = false;
  }
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

watch(screenWidth, (newWidth) => {
  if (newWidth >= 768) {
    responsiveFilterOverlay.value = false;
    responsiveFilter.value = true;
  } else if (newWidth < 768) {
    responsiveFilterOverlay.value = false;
    responsiveFilter.value = false;
  }
});
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 970;
}
.filter {
  width: 250px;
  background-color: white;
  border-radius: 15px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  .filter-header {
    width: 100%;
    height: 50px;
    background-color: #f2a45a;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    h2 {
      color: white;
      font-size: 20px;
      font-weight: bold;
    }
    .number-filtre {
      display: inline-block;
      margin-left: 5px;
      background-color: black;
      border-radius: 100%;
      height: 20px;
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: white;
        font-size: 15px;
      }
    }
  }
  .filter-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .reset {
      font-weight: bold;
      align-self: center;
      margin: 10px;
      padding: 5px 10px;
      background-color: #f25a5a;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background-color: #ff0000;
      }
    }
  }
  .mobile-header {
    display: none;
  }
}

@media (max-width: 768px) {
  .filter {
    position: fixed;
    z-index: 980;
    width: 0;
    box-shadow: none;
    .filter-header {
      z-index: 990;
      position: fixed;
      bottom: 0px;
      left: 0;
      border-radius: 0;
      background-color: white;
      height: 55px;
      box-shadow: 0 -7px 10px rgba(0, 0, 0, 0.3);
      h2 {
        display: none;
      }
      .number-filtre {
        display: none;
      }
      .mobile-header {
        display: block;
        color: black;
      }
      button.mobile-header {
        height: 27px;
        margin-left: auto;
        background-color: #f2a45a;
        color: white;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          background-color: #e47d1d;
        }
        .number-filtre {
          display: flex;
        }
      }
    }
    .filter-body {
      z-index: 995;
      position: fixed;
      bottom: 55px;
      border-radius: 15px 15px 0 0;
      left: 0;
      height: calc(100% - 200px);
      max-width: 100%;
      width: 100%;
      background-color: white;
      .mobile-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        color: black;
        margin: 20px 0;
        padding: 0 10px;
        .filter-body-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 10px;
          .material-symbols-outlined {
            font-size: 35px;
            font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
            transition: transform 0.5s ease;
          }
        }
        .close-btn {
          cursor: pointer;
          color: black;
          background-color: #eeeeee;
          transition: all 0.3s ease;
          padding: 5px;
          margin-right: 5px;
          border-radius: 100%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            color: white;
            background-color: #ff2c2c;
            transform: scale(1.1) rotate(180deg);
          }
          .material-symbols-outlined {
            font-size: 35px;
            font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
            transition: transform 0.5s ease;
          }
        }
      }
    }
  }
}

// Transition de slide vers le haut
.slideUp-enter-active,
.slideUp-leave-active {
  transition: transform 0.5s ease;
}

.slideUp-enter-from,
.slideUp-leave-to {
  transform: translateY(100%);
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
