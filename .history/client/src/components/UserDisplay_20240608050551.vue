<template>
  <span class="material-symbols-outlined">person</span>
  <h2 v-if="!userLoggedIn">Connectez-vous</h2>
  <Transition name="slide" mode="out-in">
    <div v-if="!loginClicked" class="log-btn-container">
      <button class="log-btn" @click="loginHandler">Login</button>
      <RouterLink to="/" class="log-btn">Register</RouterLink>
    </div>
    <div v-else-if="!userLoggedIn" class="log-btn-container">
      <input type="email" class="log-input" placeholder="Email" v-model="userEmail">
      <input type="password" class="log-input" placeholder="Mot de passe" v-model="userPassword">
      <button class="log-btn alt" @click="loginHandler">Me Connecter</button>
    </div>
    <div v-else class="log-btn-container">
      <button class="log-btn" @click="logoutHandler">Logout</button>
      <span>Bienvenue!</span>
    </div>
  </Transition>
</template>


<script setup>
import { ref } from "vue";

const userLoggedIn = ref(false);
const loginClicked = ref(false);
const userEmail = ref('');
const userPassword = ref('');

const loginHandler = async () => {
  if (!loginClicked.value) {
    loginClicked.value = true;
  } else {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail.value,
        password: userPassword.value
      })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('jwt', data.token);
      userLoggedIn.value = true;
    } else {
      console.error("Authentication failed: Invalid credentials or server error");
      // Traiter l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
    }
  }
};

const logoutHandler = () => {
  localStorage.removeItem('jwt');
  userLoggedIn.value = false;
};

const checkLoginStatus = () => {
  userLoggedIn.value = !!localStorage.getItem('jwt');
};

checkLoginStatus();
</script>


<style lang="scss" scoped>
.material-symbols-outlined {
  font-size: 150px;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  transition: transform 0.5s ease;
  text-align: center;
  width: 100%;
}
h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0;
}
.log-btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  width: 100%;
  .log-btn {
    padding: 10px;
    width: 100%;
    text-align: center;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    margin: 5px 0;
    border-radius: 25px;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.3s ease;
    background-color: white;
    cursor: pointer;
    font-family: "Nippo", sans-serif;
    &:hover {
      color: white;
      background-color: #f2a45a;
      border: 1px solid #f2a45a;
    }
    &.alt {
      margin-top: 20px;
      background-color: #f2a45a;
      color: white;
      border: 1px solid #f2a45a;
      &:hover {
        background-color: white;
        color: black;
      }
    }
  }
  .log-input {
    padding: 10px;
    width: 100%;
    text-align: center;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    margin: 5px 0;
    border-radius: 25px;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.3s ease;
    background-color: white;
    font-family: "Nippo", sans-serif;
  }
}
// Transition de slide
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
