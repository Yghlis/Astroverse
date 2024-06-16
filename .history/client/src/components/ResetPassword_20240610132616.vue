<template>
    <div class="reset-password-form" v-if="tokenValid">
      <h1>Réinitialiser votre mot de passe</h1>
      <form @submit.prevent="submitNewPassword">
        <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" required>
        <input type="password" v-model="confirmPassword" placeholder="Confirmez le nouveau mot de passe" required>
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
    </div>
    <div v-else>
      <p>{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  console.log("wouf")
  export default {
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
        token: this.$route.params.token,
        tokenValid: false,
        errorMessage: 'Le token est invalide ou a expiré.'
      };
    },
    mounted() {
      this.verifyToken();
    },
    methods: {
      async verifyToken() {
        try {
          const response = await fetch(`/auth/reset-password/${this.token}`);
          if (!response.ok) {
            throw new Error('Erreur de validation du token.');
          }
          const data = await response.json();
          if (data.message === "Token est valide.") {
            this.tokenValid = true;
          } else {
            this.tokenValid = false;
            this.errorMessage = data.error || 'Le token est invalide ou a expiré.';
          }
        } catch (error) {
          console.error('Error:', error);
          this.tokenValid = false;
          this.errorMessage = 'Erreur de serveur.';
        }
      },
      async submitNewPassword() {
        if (this.newPassword !== this.confirmPassword) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
        try {
          const response = await fetch(`/auth/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: this.token,
              newPassword: this.newPassword
            })
          });
          const data = await response.json();
          alert(data.message);
          if (response.ok) {
            this.$router.push('/login');
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  </script>
  