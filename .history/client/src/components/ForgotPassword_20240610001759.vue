<template>
    <div class="reset-password-form">
      <h1>Réinitialiser votre mot de passe</h1>
      <form @submit.prevent="submitNewPassword">
        <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" required>
        <input type="password" v-model="confirmPassword" placeholder="Confirmez le nouveau mot de passe" required>
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
        token: this.$route.params.token  // Récupération du token de l'URL
      };
    },
    methods: {
      submitNewPassword() {
        if (this.newPassword !== this.confirmPassword) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
        // Appel API pour réinitialiser le mot de passe
        fetch(`/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: this.token,
            newPassword: this.newPassword
          })
        })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          if (data.success) {
            this.$router.push('/login'); // Redirection vers la page de connexion
          }
        })
        .catch(error => console.error('Error:', error));
      }
    }
  };
  </script>
  