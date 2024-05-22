<!-- src/components/NavBar.vue -->
<template>
  <Transition name="slide">
  <div v-if="showSideBar" class="side-bar">
    <slot>
      <p>Contenu par défaut si aucun contenu n'est passé.</p>
    </slot>
  </div>
</Transition>
</template>
<script setup>
import { ref } from "vue";


// Watch the parent prop to sync with the ref
const props = defineProps({
  showSideBar: {
    type: Boolean,
    default: false,
  }
});



</script>

<style lang="scss" scoped>
.side-bar {
  position: fixed;
  top: 100px;
  right: 0;
  width: 20%;
  height: 100%;
  background-color: #f2a45a;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 1000;
  padding-top: 20px;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
