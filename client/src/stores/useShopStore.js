import { defineStore } from "pinia";

export const useShopStore = defineStore("shop", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    filters: {
      checkboxes: {
        characters: [],
        universes: [],
        ratings: [1, 2, 3, 4, 5],
      },
      ranges: {
        price: { min: 0, max: 0 },
      },
      promotion: false,
    },
    selectedFilters: {
      characters: [],
      universes: [],
      ratings: [],
      priceRange: { min: 0, max: 0 },
      promotion: false,
    },
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      const apiUrl = import.meta.env.VITE_API_URL;
      this.error = null;
      try {
        const response = await fetch(`${apiUrl}/products`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.products = data;
        this.updatePriceRange(data);
        this.applyFilters();
      } catch (error) {
        this.error = "Failed to fetch products";
      } finally {
        this.loading = false;
      }
    },

    async fetchFilterOptions() {
      this.loading = true;
      const apiUrl = import.meta.env.VITE_API_URL;
      this.error = null;
      try {
        const [charactersResponse, universesResponse] = await Promise.all([
          fetch(`${apiUrl}/characters`),
          fetch(`${apiUrl}/universes`),
        ]);

        if (!charactersResponse.ok || !universesResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const charactersData = await charactersResponse.json();
        const universesData = await universesResponse.json();

        this.filters.checkboxes.characters = charactersData.map(
          (character) => character.name
        );
        this.filters.checkboxes.universes = universesData.map(
          (universe) => universe.name
        );
      } catch (error) {
        this.error = "Failed to fetch filter options";
      } finally {
        this.loading = false;
      }
    },

    updatePriceRange(products) {
      const prices = products.map((product) => product.price);
      this.filters.ranges.price.min = Math.min(...prices);
      this.filters.ranges.price.max = Math.max(...prices);
      this.selectedFilters.priceRange.min = this.filters.ranges.price.min;
      this.selectedFilters.priceRange.max = this.filters.ranges.price.max;
    },

    updateSelectedFilters(selectedFilters) {
      this.selectedFilters = { ...this.selectedFilters, ...selectedFilters };
    },

    applyFilters() {
      // Implémentez la logique de filtrage ici en utilisant this.selectedFilters
    },
  },
});
