<template>
  <Header></Header>
  <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component class="container" :is="Component" />
      </transition>
  </router-view>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>

<style lang="scss" scoped>
.container {
  margin-top: 100px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
