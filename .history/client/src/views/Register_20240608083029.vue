<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="first_name">First Name:</label>
          <input type="text" v-model="first_name" required />
        </div>
        <div>
          <label for="last_name">Last Name:</label>
          <input type="text" v-model="last_name" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <div>
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" v-model="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, useRouter } from 'vue-router';// Importe useRouter de vue-router

  export default {
    setup() {
      const router = useRouter(); // Utilise useRouter pour accéder à l'instance du routeur
      const data = reactive({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      const register = async () => {
        try {
          const response = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              password: data.password,
              confirmPassword: data.confirmPassword
            }),
          });
          const responseData = await response.json();
          console.log('Register response:', responseData);
          if (response.ok) {
            // Si l'inscription est réussie, redirige vers la page d'accueil
            router.push('/');
          }
        } catch (error) {
          console.error('Error during registration:', error);
        }
      };

      return { ...toRefs(data), register };
    }
  }
  </script>
