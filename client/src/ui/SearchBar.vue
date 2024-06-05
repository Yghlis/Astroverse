<template>
  <div class="search-bar">
    <transition name="icon-slide" mode="out-in">
      <span
        v-if="icon === 'search'"
        class="material-symbols-outlined"
        key="search-icon"
      >
        search
      </span>
      <span v-else class="material-symbols-outlined" key="close-icon">
        close
      </span>
    </transition>
    <input
      type="text"
      ref="searchInput"
      v-model="searchText"
      @input="emitSearch"
      placeholder="Rechercher une figurine ..."
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { animate } from "motion";

const searchText = ref("");
const icon = ref("search");
const searchInput = ref(null);

//data
const emit = defineEmits(["update:search"]);

const emitSearch = () => {
  emit("update:search", searchText.value);
};

//Animation
const handleFocus = () => {
  animate(searchInput.value, { width: "100%" }, { duration: 0.5 });
  changeIcon();
};

const handleBlur = () => {
  animate(searchInput.value, { width: "300px" }, { duration: 0.5 });
  changeIcon();
};



const changeIcon = () => {
  if (icon.value === "search") {
    icon.value = "close";
  } else {
    icon.value = "search";
  }
};
</script>

<style lang="scss" scoped>
.search-bar {
  width: 60%;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  .material-symbols-outlined {
    position: absolute;
    cursor: pointer;
    left: 10px;
    font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
  }

  input {
    width: 300px;
    padding: 10px 10px 10px 40px;
    font-size: 20px;
    border: 1px solid black;
    border-radius: 10px;
    &:focus {
      border-color: #f2a45a;
      outline: none;
    }
  }
}

.icon-slide-enter-active,
.icon-slide-leave-active {
  position: absolute;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.icon-slide-enter-from,
.icon-slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.icon-slide-enter-to,
.icon-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
