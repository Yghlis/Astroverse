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
export default {
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://server:8000/auth/register', {
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
        })
        const data = await response.json()
        console.log('Register response:', data)
      } catch (error) {
        console.error('Error during registration:', error)
      }
    },
  },
}
</script>

  