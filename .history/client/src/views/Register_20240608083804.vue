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
import { reactive, toRefs } from 'vue'; // Importation correcte de reactive et toRefs
import { useRouter } from 'vue-router'; // Importation correcte de useRouter

export default {
  setup() {
    const router = useRouter();
    const state = reactive({
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
            first_name: state.first_name,
            last_name: state.last_name,
            email: state.email,
            password: state.password,
            confirmPassword: state.confirmPassword
          }),
        });
        const responseData = await response.json();
        console.log('Register response:', responseData);
        if (response.ok) {
          // Si l'inscription est réussie, redirige vers la page d'accueil
          router.push('/');
        } else {
          // Gère les réponses non réussies ici (afficher un message d'erreur, par exemple)
          console.error('Registration failed:', responseData.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    };

    return { ...toRefs(state), register };
  }
}
</script>

