<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label for="first_name">First Name:</label>
        <input type="text" id="first_name" v-model="first_name" required />
      </div>
      <div>
        <label for="last_name">Last Name:</label>
        <input type="text" id="last_name" v-model="last_name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" @input="evaluatePassword" required />
        <div :style="{ color: passwordStrength.color }">{{ passwordStrength.message }}</div>
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <button type="submit">Register</button>
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
      passwordStrength: {
        message: '',
        color: ''
      }
    }
  },
  methods: {
    evaluatePassword() {
      const hasLowercase = /[a-z]/.test(this.password);
      const hasUppercase = /[A-Z]/.test(this.password);
      const hasNumber = /[0-9]/.test(this.password);
      const hasSpecialChar = /[\W_]/.test(this.password);
      const isLongEnough = this.password.length >= 12;

      if (isLongEnough && hasLowercase && hasUppercase && hasNumber && hasSpecialChar) {
        this.passwordStrength.message = 'Mot de passe solide';
        this.passwordStrength.color = 'green';
      } else {
        this.passwordStrength.message = 'Mot de passe trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule.';
        this.passwordStrength.color = 'red';
      }
    },
    async register() {
      // Vérifier si le mot de passe est solide
      const hasLowercase = /[a-z]/.test(this.password);
      const hasUppercase = /[A-Z]/.test(this.password);
      const hasNumber = /[0-9]/.test(this.password);
      const hasSpecialChar = /[\W_]/.test(this.password);
      const isLongEnough = this.password.length >= 12;

      if (!(isLongEnough && hasLowercase && hasUppercase && hasNumber && hasSpecialChar)) {
        alert("Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule.");
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
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
        console.log('Register response:', data);
        if (response.ok) {
          this.$router.push('/');
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
      }
    },
  },
}
</script>

<style type="scss" scoped>
div {
  margin-top: 100px;
}
</style>
