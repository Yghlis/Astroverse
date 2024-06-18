<template>
  <div class="container-landing">
    <TopLanding></TopLanding>
    <HighLight></HighLight>
    <UniversDisplay></UniversDisplay>
  </div>
</template>

<script setup>
import TopLanding from "../components/landingPage/TopLanding.vue";
import HighLight from "../components/landingPage/HighLight.vue";
import UniversDisplay from "../components/landingPage/UniversDisplay.vue";
</script>

<style lang="scss" scoped>
.container-landing {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
