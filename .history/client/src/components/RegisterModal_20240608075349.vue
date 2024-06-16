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
  
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    methods: {
      open() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      async register() {
        try {
          const response = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: this.first_name,
              last_name: this.last_name,
              email: this.email,
              password: this.password,
              confirmPassword: this.confirmPassword
            }),
          });
          const data = await response.json();
          console.log('Register response:', data);
          this.close(); // Close modal on successful registration
        } catch (error) {
          console.error('Error during registration:', error);
          // Handle errors appropriately
        }
      }
    }
  }
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
  