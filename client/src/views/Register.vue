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
      const strength = this.getPasswordStrength(this.password);
      if (strength < 4 || this.password.length < 12) {
        this.passwordStrength.message = 'Weak';
        this.passwordStrength.color = 'red';
      } else if (strength === 4 || this.password.length >= 12) {
        this.passwordStrength.message = 'Moderate';
        this.passwordStrength.color = 'orange';
      } else if (strength > 4 && this.password.length >= 16) {
        this.passwordStrength.message = 'Good';
        this.passwordStrength.color = 'green';
      }
    },
    getPasswordStrength(password) {
      let strength = 0;
      if (password.match(/[a-z]/)) strength++; // Un point pour les minuscules
      if (password.match(/[A-Z]/)) strength++; // Un point pour les majuscules
      if (password.match(/[0-9]/)) strength++; // Un point pour les chiffres
      if (password.match(/[\W]/)) strength++; // Un point pour les caractères spéciaux
      return strength;
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
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


<style type="scss" scoped >
div {
  margin-top: 100px;
} 
</style>