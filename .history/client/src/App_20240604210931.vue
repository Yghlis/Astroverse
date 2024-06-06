<script setup>
import { ref, onMounted } from 'vue';
import HelloWorld from "./components/HelloWorld.vue";
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

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
  localStorage.removeItem('token');  // Supprimer le token
  localStorage.removeItem('firstName');  // Supprimer le prénom
  localStorage.removeItem('lastName');  // Supprimer le nom
  isLoggedIn.value = false;
  console.log('Déconnexion réussie');
};
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <div v-if="isLoggedIn">
      <p>Bienvenue, {{ firstName }} {{ lastName }}</p>
      <button @click="logout">Déconnexion</button>
      <HelloWorld msg="Vite + Vue" />
    </div>
    <div v-else>
      <LoginForm />
      <RegisterForm />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
