<template>
  <div class="app">
    <div v-if="isLoggedIn">
      <p>Bienvenue, {{ firstName }} {{ lastName }}</p>
      <button @click="logout">Déconnexion</button>
      <HelloWorld msg="Vite + Vue" />
    </div>
    <div v-else>
      <LoginForm />
      <RegisterForm />
    </div>
    <Header />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component class="container" :is="Component" />
      </transition>
    </router-view>
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import Header from "./components/Header.vue";
import TheFooter from "./components/TheFooter.vue";

const isLoggedIn = ref(false);
const firstName = ref("");
const lastName = ref("");

// Vérifier si l'utilisateur est connecté lors du chargement du composant
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem("token");
  firstName.value = localStorage.getItem("firstName");
  lastName.value = localStorage.getItem("lastName");
});

// Fonction pour gérer la déconnexion
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  isLoggedIn.value = false;
  console.log("Déconnexion réussie");
};
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .container {
    margin-top: 100px;
    flex: 1;
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
