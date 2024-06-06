<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <button type="button" @click="forgotPassword" class="forgot-password">Mot de passe oublié?</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      message: '' // Utilisé pour afficher les messages d'erreur ou de réussite
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await response.json(); // Toujours lire la réponse JSON en premier
        if (!response.ok) {
          throw new Error(data.error || 'Network response was not ok'); // Utilisez 'data.error' si c'est ce que vous envoyez du serveur
        }

        this.message = data.message || 'Login successful'; // Utiliser le message de réussite venant du serveur ou un message par défaut
        localStorage.setItem('token', data.token); // Stocker le token dans localStorage
        localStorage.setItem('firstName', data.firstName); // Prénom de l'utilisateur
        localStorage.setItem('lastName', data.lastName); 
        console.log('Login response:', data);
      } catch (error) {
        console.error('Error during login:', error);
        this.message = error.message; // Afficher le message d'erreur
      }
    },
    async forgotPassword() {
      try {
        const response = await fetch('http://localhost:8000/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email })
        });

        const data = await response.json(); // Lire la réponse JSON
        if (!response.ok) {
          throw new Error(data.message || 'Failed to send password reset email');
        }

        this.message = 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.'; // Informer l'utilisateur
      } catch (error) {
        console.error('Error during password reset request:', error);
        this.message = error.message;
      }
    }
  }
}
</script>

<style scoped>
.forgot-password {
  margin-top: 10px;
  color: blue;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
</style>
