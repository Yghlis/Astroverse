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
  </div>
</template>

<script>
export default {
data() {
  return {
    email: '',
    password: '',
  }
},
methods: {
  async login() {
    try {
      console.log('Attempting to login with email:', this.email);
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      console.log('Response status:', response.status);
      console.log('Response content type:', response.headers.get('Content-Type'));

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Login response:', data);
    } catch (error) {
      console.error('Error during login:', error);
    }
  },
},
}
</script>
