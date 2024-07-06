<template>
  <span class="material-symbols-outlined">person</span>
  <h2 v-if="!userLoggedIn && !passwordResetRequested">Connectez-vous</h2>
  <h2 v-else-if="passwordResetRequested">Réinitialisez votre mot de passe</h2>

  <!-- Affichage des messages flash avec classe conditionnelle pour l'animation et la couleur -->
  <p v-if="flashMessage" class="flash-message" :class="{ 'active': flashMessage, 'success': flashMessageType === 'success', 'error': flashMessageType === 'error' }">{{ flashMessage }}</p>

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
import { ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import useFlashMessageStore from '@stores/useFlashMessageStore';

const { flashMessage, flashMessageType, setFlashMessage } = useFlashMessageStore();
const userLoggedIn = ref(false);
const loginClicked = ref(false);
const passwordResetRequested = ref(false);
const userEmail = ref('');
const userPassword = ref('');
const errorMessage = ref('');
const router = useRouter();

watch(flashMessage, (newVal, oldVal) => {
  console.log("Flash message updated:", newVal);
});

const loginHandler = async () => {
  loginClicked.value = true;  
  if (!userEmail.value || !userPassword.value) {
    setFlashMessage('Veuillez entrer une adresse e-mail et un mot de passe.', 'error');
    return;
  }
  console.log('Tentative de connexion avec:', userEmail.value, userPassword.value);

  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail.value, password: userPassword.value })
    });

    console.log('Réponse de l\'API:', response);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Données reçues:', data);
      
      localStorage.setItem('jwt', data.token);
      if (data.mustChangePassword) {
        router.push({ name: 'ChangePassword', params: { userId: data.userId, token: data.token } });
      } else {
        userLoggedIn.value = true;
        setFlashMessage('Connexion réussie ! Bienvenue.');
      }
    } else {
      const errorData = await response.json();
      setFlashMessage(errorData.message || 'Erreur de connexion');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    setFlashMessage('Erreur lors de la connexion', 'error');
  }
};


const logoutHandler = () => {
  localStorage.removeItem('jwt');
  userLoggedIn.value = false;
  setFlashMessage('Déconnexion réussie.');
  setTimeout(() => flashMessage.value = '', 3000); // Cache le message après 3 secondes
};

const forgotPassword = () => {
  passwordResetRequested.value = true;
};

const sendResetEmail = async () => {
  if (!userEmail.value) {
    setFlashMessage('Veuillez entrer votre email.');
    return;
  }

  const response = await fetch('http://localhost:8000/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail.value })
  });

  if (response.ok) {
    setFlashMessage('Un email de réinitialisation a été envoyé si votre email est enregistré.');
    passwordResetRequested.value = false;
    setTimeout(() => flashMessage.value = '', 3000); // Cache le message après 3 secondes
  } else {
    const errorData = await response.json();
    setFlashMessage(errorData.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.');
    setTimeout(() => flashMessage.value = '', 3000); // Cache le message après 3 secondes
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
  transform: translateY(100%);
}
</style>
