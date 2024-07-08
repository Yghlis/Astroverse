import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    product: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProduct(id) {
      this.loading = true;
      const apiUrl = import.meta.env.VITE_API_URL;
      this.error = null;
      try {
        const response = await fetch(`${apiUrl}/products/${id}?source=client`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.product = data;
        console.log(data);
      } catch (error) {
        this.error = "Failed to fetch product";
      } finally {
        this.loading = false;
      }
    },
  },
});
