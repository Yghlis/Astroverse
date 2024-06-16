<template>
  <span class="material-symbols-outlined">person</span>
  <h2 v-if="!userLoggedIn && !passwordResetRequested">Connectez-vous</h2>
  <h2 v-else-if="passwordResetRequested">Réinitialisez votre mot de passe</h2>
  <transition name="fade">
  <p v-if="flashMessage" class="flash-message">{{ flashMessage }}</p>
</transition>

  <Transition name="slide" mode="out-in">
    <div v-if="!userLoggedIn">
      <div v-if="!loginClicked && !passwordResetRequested" class="log-btn-container">
        <button class="log-btn" @click="loginClicked = true">Login</button>
        <RouterLink to="/register" class="log-btn">Register</RouterLink>
      </div>
      <div v-else class="log-btn-container">
        <div v-if="passwordResetRequested">
          <input type="email" class="log-input" placeholder="Votre email" v-model="userEmail">
          <button class="log-btn alt" @click="sendResetEmail">Envoyer un mail</button>
          <button class="log-btn" @click="returnToLogin">Retour</button>
        </div>
        <div v-else>
          <input type="email" class="log-input" placeholder="Email" v-model="userEmail">
          <input type="password" class="log-input" placeholder="Mot de passe" v-model="userPassword">
          <button class="log-btn alt" @click="loginHandler">Me Connecter</button>
          <button type="button" @click="forgotPassword" class="forgot-password">Mot de passe oublié?</button>
          <button class="log-btn" @click="returnToInitial">Retour</button>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
    <div v-else class="log-btn-container">
      <button class="log-btn" @click="logoutHandler">Logout</button>
      <span>Bienvenue!</span>
    </div>
  </Transition>
</template>




<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const userLoggedIn = ref(false);
const loginClicked = ref(false);
const passwordResetRequested = ref(false);
const userEmail = ref('');
const userPassword = ref('');
const errorMessage = ref('');
const flashMessage = ref('');


const loginHandler = async () => {
  loginClicked.value = true;
  if (!userEmail.value || !userPassword.value) {
    flashMessage.value = 'Veuillez entrer une adresse e-mail et un mot de passe.';
    return;
  }

  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail.value, password: userPassword.value })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('jwt', data.token);
    userLoggedIn.value = true;
    flashMessage.value = 'Connexion réussie ! Bienvenue.';
  } else {
    const errorData = await response.json();
    flashMessage.value = errorData.message || 'Erreur de connexion';
  }
};



const logoutHandler = () => {
  localStorage.removeItem('jwt');
  userLoggedIn.value = false;
};

const forgotPassword = () => {
  passwordResetRequested.value = true;
};

const sendResetEmail = async () => {
  if (!emailRegex.test(userEmail.value)) {
    flashMessage.value = 'Format de l\'email invalide.';
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail.value })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send password reset email');
    }

    flashMessage.value = 'Si votre email est enregistré chez nous, un lien de réinitialisation a été envoyé.';
    passwordResetRequested.value = false;
  } catch (error) {
    flashMessage.value = error.message || 'Erreur lors de la demande de réinitialisation du mot de passe.';
  }
};



const returnToLogin = () => {
  loginClicked.value = false;
  passwordResetRequested.value = false;
};

const returnToInitial = () => {
  loginClicked.value = false;
  passwordResetRequested.value = false;
};

const checkLoginStatus = () => {
  userLoggedIn.value = !!localStorage.getItem('jwt');
};

checkLoginStatus();
</script>


<style scoped>
.material-symbols-outlined {
  font-size: 150px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  transition: transform 0.5s ease;
  text-align: center;
  width: 100%;
}
h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0;
}
.flash-message {
  color: green; 
  text-align: center;
  font-size: 1.2rem;
  padding: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.log-btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  width: 100%;
}
.log-btn, .log-input {
  padding: 10px;
  width: 100%;
  text-align: center;
  color: black;
  border: 1px solid black;
  margin: 5px 0;
  border-radius: 25px;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.3s ease;
  background-color: white;
  cursor: pointer;
  font-family: 'Nippo', sans-serif;
}
.log-btn:hover, .log-btn.alt:hover {
  color: white;
  background-color: #f2a45a;
  border: 1px solid #f2a45a;
}
.log-btn.alt {
  margin-top: 20px;
  background-color: #f2a45a;
  color: white;
  border: 1px solid #f2a45a;
}
.error-message {
  color: red;
  text-align: center;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
