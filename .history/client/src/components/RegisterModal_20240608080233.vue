<template>
    <div class="modal" v-if="visible">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <h2>Register</h2>
        <form @submit.prevent="register">
          <div>
            <label for="first_name">First Name:</label>
            <input id="first_name" type="text" v-model="first_name" required />
          </div>
          <div>
            <label for="last_name">Last Name:</label>
            <input id="last_name" type="text" v-model="last_name" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input id="email" type="email" v-model="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input id="password" type="password" v-model="password" required />
          </div>
          <div>
            <label for="confirmPassword">Confirm Password:</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    methods: {
      open() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      async register() {
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
          this.close(); // Close the modal on successful registration
        } catch (error) {
          console.error('Error during registration:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); 
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
  }
  
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: calc(100% - 20px);
    padding: 10px;
    margin-top: 8px;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  
  button:hover {
    opacity: 0.8;
  }
  </style>
  