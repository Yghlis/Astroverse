<template>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HelloWorld from "./components/HelloWorld.vue";
import Header from "./components/Header.vue";

const isLoggedIn = ref(false);
const firstName = ref('');
const lastName = ref('');

// Vérifier si l'utilisateur est connecté lors du chargement du composant
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token');
  firstName.value = localStorage.getItem('firstName');
  lastName.value = localStorage.getItem('lastName');
});

// Fonction pour gérer la déconnexion
const logout = () => {
  localStorage.removeItem('token'); 
  localStorage.removeItem('firstName');  
  localStorage.removeItem('lastName');  
  isLoggedIn.value = false;
  console.log('Déconnexion réussie');
};
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
