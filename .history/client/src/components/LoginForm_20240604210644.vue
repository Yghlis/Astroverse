<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
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
    }
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

        const data = await response.json(); // Récupérer la réponse JSON une seule fois
        if (!response.ok) {
          this.message = data.message; // Afficher le message d'erreur venant du serveur
          throw new Error(data.message || 'Network response was not ok');
        }

        this.message = 'Login successful'; // Message de réussite
        localStorage.setItem('token', data.token); // Stocker le token dans localStorage
        localStorage.setItem('token', data.token);
localStorage.setItem('firstName', data.firstName); // Prénom de l'utilisateur
localStorage.setItem('lastName', data.lastName); 
        console.log('Login response:', data);
      } catch (error) {
        console.error('Error during login:', error);
        this.message = error.message;
      }
    },
  },
}
</script>
