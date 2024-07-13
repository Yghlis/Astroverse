// stores/sidebarStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebarStore = defineStore("sidebarStore", () => {
  const isUserSidebarVisible = ref(false);

  const toggleUserSidebar = () => {
    isUserSidebarVisible.value = !isUserSidebarVisible.value;
  };

  return {
    isUserSidebarVisible,
    toggleUserSidebar,
  };
});
