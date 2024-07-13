<template>
  <div class="pagination">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
      Précédent
    </button>
    <span>Page {{ currentPage }} sur {{ totalPages }}</span>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      Suivant
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["change-page"]);

const changePage = (page) => {
  if (page > 0 && page <= props.totalPages) {
    emit("change-page", page);
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  font-size: 16px;

  button {
    margin: 0 10px;
    padding: 8px 16px;
    border: 1px solid #007bff;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    &:disabled {
      color: #6c757d;
      background-color: white;
      border-color: #6c757d;
      cursor: not-allowed;
      transform: none;
    }
  }

  span {
    margin: 0 10px;
    color: #343a40;
  }
}
</style>
