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

  },
}
</script>
