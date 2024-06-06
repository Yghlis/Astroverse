<template>
    <div>
      <h2>Réinitialisation du mot de passe</h2>
      <form @submit.prevent="submitForgotPassword">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required placeholder="Entrez votre email">
        </div>
        <button type="submit">Envoyer l'email de réinitialisation</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        message: ''
      };
    },
    methods: {
      async submitForgotPassword() {
        try {
          const response = await fetch('http://localhost:8000/auth/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.email })
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to send password reset email');
          }
  
          this.message = 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.';
        } catch (error) {
          console.error('Error during password reset request:', error);
          this.message = error.message;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  button {
    margin-top: 10px;
    color: white;
    background-color: blue;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  