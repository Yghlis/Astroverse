<template>
  <div class="app">
    <Header />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component
          class="container"
          :class="{ admin: isAdminRoute }"
          :is="Component"
        />
      </transition>
    </router-view>
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Header from "./components/Header.vue";
import TheFooter from "./components/TheFooter.vue";
import { useCartStore } from "./stores/cartStore";
import { useRoute } from "vue-router";

const route = useRoute();
const isAdminRoute = computed(() => route.path === "/admin");

const isLoggedIn = ref(false);
const firstName = ref("");
const lastName = ref("");
const cartStore = useCartStore();


onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem("token");
  firstName.value = localStorage.getItem("firstName");
  lastName.value = localStorage.getItem("lastName");

 
  cartStore.syncCart();


  const interval = setInterval(() => {
    cartStore.syncCart();
  }, 60000); 

 
  onUnmounted(() => {
    clearInterval(interval);
  });
});


const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  isLoggedIn.value = false;
};
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  .container {
    margin-top: 100px;
    flex: 1;
    &.admin {
      margin-top: 0px;
    }
  }
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
