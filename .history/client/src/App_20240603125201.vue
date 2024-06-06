<script setup>
import { ref } from 'vue';
import HelloWorld from "./components/HelloWorld.vue";
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

const isLoggedIn = ref(false);  // Simulez l'état de connexion de l'utilisateur

// Fonction pour gérer la déconnexion
const logout = async () => {
  try {
    const response = await fetch('http://localhost:8000/auth/logout', {
      method: 'POST',
      credentials: 'include' // Nécessaire pour les cookies si vous utilisez des sessions
    });
    if (response.ok) {
      isLoggedIn.value = false;  // Mettez à jour l'état de connexion
      console.log('Déconnexion réussie');
    } else {
      throw new Error('Failed to log out');
    }
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
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
    <!-- Ajouter un bouton de déconnexion si l'utilisateur est connecté -->
    <div v-if="isLoggedIn">
      <button @click="logout">Déconnexion</button>
    </div>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <LoginForm />
  <RegisterForm />
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
