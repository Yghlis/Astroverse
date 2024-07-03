<!-- src/components/NavBar.vue -->
<template>
  <nav>
    <!-- <RouterLink to="/" :class="{ active: $route.path === '/' }"
      ><span class="material-symbols-outlined">home</span>Home</RouterLink
    > -->
    <RouterLink to="/" :class="{ active: $route.path === '/' }"
      >Home</RouterLink
    >
    <RouterLink to="/shop" :class="{ active: $route.path === '/shop' }"
      >Shop</RouterLink
    >
     <RouterLink to="/cart-checkout" :class="{ active: $route.path === '/cart-checkout' }"
      >checkout</RouterLink
    >
    <RouterLink to="/form">About us</RouterLink>
    <RouterLink to="/admin" :class="{ active: $route.path === '/admin' }"
      >Admin</RouterLink
    >
  </nav>
</template>

<script setup>




</script>

<style lang="scss" scoped>
nav {
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
  a {
    color: black;
    font-size: 22px;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover,
    &.active {
      color: white;
      background-color: #f2a45a;
    }
    .material-symbols-outlined {
      font-size: 22px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
    }
  }
}
</style>
