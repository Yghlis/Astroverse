import { defineStore } from "pinia";
import { watch } from "vue";

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
      const apiUrl = import.meta.env.VITE_API_URL;
      const filters = this.selectedFilters;
    
      // Construction de l'URL avec les paramètres de filtre
      const params = new URLSearchParams();
    
      if (filters.characters.length > 0) {
        params.set('characters', filters.characters.join(','));
      } else {
        params.delete('characters');
      }
    
      if (filters.universes.length > 0) {
        params.set('universes', filters.universes.join(','));
      } else {
        params.delete('universes');
      }
    
      if (filters.ratings.length > 0) {
        params.set('ratings', filters.ratings.join(','));
      } else {
        params.delete('ratings');
      }
    
      if (filters.priceRange.min !== 0 || filters.priceRange.max !== 0) {
        params.set('priceRange', `${filters.priceRange.min}-${filters.priceRange.max}`);
      } else {
        params.delete('priceRange');
      }
    
      if (filters.promotion) {
        params.set('promotion', 'true');
      } else {
        params.delete('promotion');
      }
    
      const url = `${apiUrl}/products?${params.toString()}`;
    
      console.log(url); // Pour tester l'URL construite
    },

    resetState() {
      this.$reset();
      this.fetchProducts();
      this.fetchFilterOptions();
    },

    $reset() {
      this.products = [];
      this.loading = false;
      this.error = null;
      this.filters = {
        checkboxes: {
          characters: [],
          universes: [],
          ratings: [1, 2, 3, 4, 5],
        },
        ranges: {
          price: { min: 0, max: 0 },
        },
        promotion: false,
      };
      this.selectedFilters = {
        characters: [],
        universes: [],
        ratings: [],
        priceRange: { min: 0, max: 0 },
        promotion: false,
      };
    },
  },
});


// Fonction pour regarder les changements dans selectedFilters
export function setupStoreWatchers(store) {
  watch(
    () => store.selectedFilters,
    (newValue, oldValue) => {
      store.applyFilters();
    },
    { deep: true }
  );
}