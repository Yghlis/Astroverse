<template>
  <div class="container-landing">
    <TopLanding></TopLanding>
  </div>
</template>

<script setup>
import TopLanding from "../components/landingPage/TopLanding.vue";
</script>

<style lang="scss" scoped>
.container-landing {
  margin-top: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #f2f2f2;
}
</style>
