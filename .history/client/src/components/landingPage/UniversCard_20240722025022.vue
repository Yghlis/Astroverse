<template>
  <div class="card-wrapper">
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
    <span
      @click="toggleFollow"
      class="material-symbols-outlined follow-icon"
      :class="{ active: isFollowed }"
    >
      notifications_active
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUniversesStore } from '../../stores/UniverseFormStore'; // Assurez-vous d'importer le bon store

const props = defineProps({
  title: String,
  color1: String,
  color2: String,
  colorText: String,
  link: String,
  id: String
});

const universeStore = useUniversesStore();
const isFollowed = computed(() => {
  return universeStore.followedUniverses?.includes(props.id) ?? false;
});

const toggleFollow = async () => {
  if (isFollowed.value) {
    await universeStore.unfollowUniverse(props.id);
  } else {
    await universeStore.followUniverse(props.id);
  }
};
</script>

<style lang="scss" scoped>
.card-wrapper {
  position: relative;
}

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
  cursor: pointer;
  text-decoration: none;  
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

.follow-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: grey;
  &.active {
    color: #ffd700; /* Couleur de l'icône active */
  }
}
</style>
