<template>
  <h2>Mes Favoris</h2>
  <div class="items-container">
    <shopCard
      v-for="item in favoriteProducts"
      :key="item.id"
      :product="item.Product"
    ></shopCard>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useProductStore } from "../stores/useProductStore";
import shopCard from "../ui/shopCard.vue";

const productStore = useProductStore();

const favoriteProducts = computed(() => productStore.favoriteProducts);

onMounted(() => {
  productStore.getFavoriteProducts();
});

const emit = defineEmits(["update:hideFavoriteSideBar"]);

const toggle = () => {
  emit("update:hideFavoriteSideBar", false);
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

.items-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}
</style>
