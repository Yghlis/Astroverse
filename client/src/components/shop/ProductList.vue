<template>
  <div class="product">
    <div class="product-list">
      <shopCard
        v-for="item in paginatedProducts"
        :key="item.id"
        :product="item"
      ></shopCard>
    </div>
    <div class="pagination-controls">
      <div class="productsPerPage">
        <label for="productsPerPage">Produits par page:</label>
        <select id="productsPerPage" v-model="productsPerPage">
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <div class="btn">
        <button @click="prevPage" :disabled="currentPage === 1">
          Précédent
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import shopCard from "../../ui/shopCard.vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const currentPage = ref(1);
const productsPerPage = ref(10);
const perPageOptions = [1, 5, 10, 15, 20];

const totalPages = computed(() =>
  Math.ceil(props.products.length / productsPerPage.value)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage.value;
  const end = start + productsPerPage.value;
  return props.products.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

watch(productsPerPage, () => {
  currentPage.value = 1;
});
</script>

<style lang="scss" scoped>
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 280px);
}
.product-list {
  width: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
}

.pagination-controls {
  margin: 30px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 10px;

  .productsPerPage {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  label {
    font-size: 16px;
  }

  select {
    padding: 5px;
    font-size: 16px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #ccc;
    background-color: white;
    transition: background-color 0.3s ease;
    border-radius: 25px;

    &:hover {
      background-color: #f0f0f0;
    }

    &:disabled {
      cursor: not-allowed;
      background-color: #e0e0e0;
    }
  }
}

@media (max-width: 768px) {
  .product {
    width: 100%;
    .product-list {
      justify-content: center;
    }
  }
}
</style>
