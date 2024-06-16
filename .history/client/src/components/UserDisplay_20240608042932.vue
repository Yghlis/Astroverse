<template>
  <span class="material-symbols-outlined"> person </span>
  <h2>Connectez-vous</h2>
  <Transition name="slide" mode="out-in">
    <div v-if="!loginClicked" class="log-btn-container">
      <button class="log-btn" @click="loginHandler">Login</button>
      <RouterLink to="/" class="log-btn"
        >Register</RouterLink
      >
    </div>
    <div v-else class="log-btn-container">
      <input type="email" class="log-input"placeholder="Email">
      <input type="password" class="log-input" placeholder="Mot de passe">
      <button class="log-btn alt" @click="loginHandler">Me Connecter</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";

const loginClicked = ref(false);

const loginHandler = () => {
  loginClicked.value = !loginClicked.value;
};
</script>

<style lang="scss" scoped>
.material-symbols-outlined {
  font-size: 150px;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  transition: transform 0.5s ease;
  text-align: center;
  width: 100%;
}
h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0;
}
.log-btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  width: 100%;
  .log-btn {
    padding: 10px;
    width: 100%;
    text-align: center;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    margin: 5px 0;
    border-radius: 25px;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.3s ease;
    background-color: white;
    cursor: pointer;
    font-family: "Nippo", sans-serif;
    &:hover {
      color: white;
      background-color: #f2a45a;
      border: 1px solid #f2a45a;
    }
    &.alt {
      margin-top: 20px;
      background-color: #f2a45a;
      color: white;
      border: 1px solid #f2a45a;
      &:hover {
        background-color: white;
        color: black;
      }
    }
  }
  .log-input {
    padding: 10px;
    width: 100%;
    text-align: center;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    margin: 5px 0;
    border-radius: 25px;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.3s ease;
    background-color: white;
    font-family: "Nippo", sans-serif;
  }
}
// Transition de slide
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
