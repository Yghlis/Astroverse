<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="first_name">First Name:</label>
          <input type="text" v-model="first_name" required />
          <p v-if="errors.first_name" style="color: red">{{ errors.first_name }}</p>
        </div>
        <div>
          <label for="last_name">Last Name:</label>
          <input type="text" v-model="last_name" required />
          <p v-if="errors.last_name" style="color: red">{{ errors.last_name }}</p>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
          <p v-if="errors.email" style="color: red">{{ errors.email }}</p>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
          <p v-if="errors.password" style="color: red">{{ errors.password }}</p>
        </div>
        <div>
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" v-model="confirmPassword" required />
          <p v-if="errors.confirmPassword" style="color: red">{{ errors.confirmPassword }}</p>
        </div>
        <button type="submit">Register</button>
        <p v-if="errors.other" style="color: red">{{ errors.other }}</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          other: ''
        }
      }
    },
    methods: {
      validateInputs() {
        let isValid = true;
        this.errors = {first_name: '', last_name: '', email: '', password: '', confirmPassword: '', other: ''}; // Reset errors
  
        if (!this.email.includes('@')) {
          this.errors.email = "L'email doit être valide.";
          isValid = false;
        }
        if (this.password !== this.confirmPassword) {
          this.errors.confirmPassword = "Les mots de passe ne correspondent pas.";
          isValid = false;
        }
        if (this.password.length < 12 || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/.test(this.password)) {
          this.errors.password = "Le mot de passe doit contenir au moins 12 caractères, dont un chiffre, une majuscule, une minuscule, et un symbole.";
          isValid = false;
        }
  
        return isValid;
      },
      async register() {
        if (!this.validateInputs()) {
          return; // Stop the registration process if validation fails
        }
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
  
          if (!response.ok) {
            // Handle errors returned from the server
            this.errors.other = data.message || "Une erreur s'est produite lors de l'inscription.";
          } else {
            this.$router.push('/');
          }
        } catch (error) {
          console.error('Error during registration:', error);
          this.errors.other = "Une erreur réseau s'est produite.";
        }
      },
    },
  }
  </script>
  