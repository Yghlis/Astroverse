<template>
    <span class="material-symbols-outlined">person</span>
    <h2 v-if="!userLoggedIn && !passwordResetRequested">Connectez-vous</h2>
    <h2 v-else-if="passwordResetRequested">Réinitialisez votre mot de passe</h2>
    <Transition name="slide" mode="out-in">
      <div v-if="!userLoggedIn">
        <div v-if="!loginClicked && !passwordResetRequested" class="log-btn-container">
          <button class="log-btn" @click="loginClicked = true">Login</button>
          <button class="log-btn" @click="openRegisterModal">Register</button>  <!-- Modale ouverte ici -->
        </div>
        <div v-else class="log-btn-container">
          <!-- formulaire de connexion -->
        </div>
      </div>
      <div v-else class="log-btn-container">
        <button class="log-btn" @click="logoutHandler">Logout</button>
        <span>Bienvenue!</span>
      </div>
    </Transition>
    <register-modal v-if="showRegisterModal" @close="closeRegisterModal" />
  </template>
  
  
  <script setup>
import { ref } from "vue";
import RegisterModal from "@/components/RegisterModal"; // Assurez-vous que le chemin est correct

const userLoggedIn = ref(false);
const loginClicked = ref(false);
const passwordResetRequested = ref(false);
const userEmail = ref('');
const userPassword = ref('');
const errorMessage = ref('');
const showRegisterModal = ref(false);  // État pour contrôler la visibilité de la modale

const loginHandler = async () => {
  if (!userEmail.value || !userPassword.value) {
    errorMessage.value = 'Veuillez entrer une adresse e-mail et un mot de passe.';
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
  } else {
    const errorData = await response.json();
    errorMessage.value = errorData.message || 'Erreur de connexion';
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
  const response = await fetch('http://localhost:8000/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail.value })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send password reset email');
  }

  errorMessage.value = 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.';
  passwordResetRequested.value = false;
};

const returnToLogin = () => {
  passwordResetRequested.value = false;
  loginClicked.value = true;
};

const returnToInitial = () => {
  loginClicked.value = false;
  passwordResetRequested.value = false;
};

const openRegisterModal = () => {
  showRegisterModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
};

const checkLoginStatus = () => {
  userLoggedIn.value = !!localStorage.getItem('jwt');
};

checkLoginStatus();
</script>

  
  <style scoped>
  .modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
  }
  
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: calc(100% - 20px);
    padding: 10px;
    margin-top: 8px;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  
  button:hover {
    opacity: 0.8;
  }
  </style>
  