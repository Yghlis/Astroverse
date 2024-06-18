<template>
  <a
    :href="link"
    target="_blank"
    class="card"
    :style="{
      background: `linear-gradient(45deg, ${color1}, ${color2})`,
      color: colorText
    }"
  >
    <h3>{{ title }}</h3>
  </a>
</template>

<script setup>
const props = defineProps({
  title: String,
  color1: String,
  color2: String,
  colorText: String,
  link: String  // Ajout de la propriété link
});
</script>

<style lang="scss" scoped>
.card {
  width: 400px;
  height: 200px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 20px 0;
  cursor: pointer;
  text-decoration: none;  // Pour enlever le soulignement des liens
  &:hover {
    transform: scale(1.05);
  }
  h3 {
    font-size: 2.5rem;
    font-weight: 500;
    text-align: center;
    font-family: "Nippo", sans-serif;
  }
}
</style>
