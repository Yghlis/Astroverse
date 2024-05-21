<!-- src/components/NavBar.vue -->
<template>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/login">Go to Login</RouterLink>
    <!-- Ajoutez d'autres liens ici -->
  </nav>
</template>

<script setup>
</script>

<style lang="scss" scoped>
nav {
  background-color: #333;
  padding: 1rem;

  a {
    color: white;
    margin-right: 1rem;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
