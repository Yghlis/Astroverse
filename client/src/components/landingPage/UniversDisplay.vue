<template>
  <div class="univers">
    <p
      v-if="flashMessage"
      class="flash-message"
      :class="{
        active: flashMessage,
        success: flashMessageType === 'success',
        error: flashMessageType === 'error',
      }"
    >
      {{ flashMessage }}
    </p>
    <h2>Tous nos Univers</h2>
    <div class="univers-card-container">
      <universCard
        v-for="univers in universes"
        :key="univers.id"
        :id="univers.id"
        :title="univers.name"
        :color1="univers.color1"
        :color2="univers.color2"
        :colorText="univers.colorText"
        @followed="setFlashMessage('Univers suivi', 'success')"
        @unfollowed="setFlashMessage('Univers non suivi', 'error')"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import universCard from "./UniversCard.vue";
import { useUniversesStore } from "../../stores/useUniversesStore";
import { storeToRefs } from "pinia";
import useFlashMessageStore from "@composables/useFlashMessageStore";

const { flashMessage, flashMessageType, setFlashMessage } =
  useFlashMessageStore();

const universeStore = useUniversesStore();
const { universes, loading, error } = storeToRefs(universeStore);

const fetchUniverses = () => {
  universeStore.fetchUniverses();
};

onMounted(() => {
  fetchUniverses();
});
</script>

<style lang="scss" scoped>
.univers {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
    margin-top: 0;
  }
  .univers-card-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    @media (max-width: 1024px) {
      justify-content: center;
    }
  }

  .error-message {
    color: red;
    text-align: center;
  }
}
</style>
