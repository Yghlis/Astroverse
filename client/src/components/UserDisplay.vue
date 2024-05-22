<template>
  <span class="material-symbols-outlined"> person </span>
  <h2>Connectez-vous</h2>
  <div class="log-btn-container" v-if="userClicked">
    <RouterLink to="/login" class="log-btn">Login</RouterLink>
    <RouterLink to="/register" class="log-btn">Register</RouterLink>
  </div>
</template>

<script setup>
// Watch the parent prop to sync with the ref
const props = defineProps({
  userClicked: {
    type: Boolean,
    default: false,
  },
});
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
    font-weight: bold;
    transition: all 0.3s ease;
    &:hover {
      color: white;
      background-color: #f2a45a;
      border: 1px solid #f2a45a;
    }
  }
}
</style>
