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
    search: "",
  }),

  actions: {
    async fetchProducts(search = null, url = null) {
      console.log("fetchProducts called with search:", search);
      this.loading = true;
      let apiUrl = url || import.meta.env.VITE_API_URL + "/products";
      if (search) {
        // apiUrl += `?search=${search}`;             // ENLEVER LE COMMENTAIRE POUR ACTIVER LA RECHERCHE
        console.log(apiUrl + `?search=${search}`);
        this.selectedFilters = {
          characters: [],
          universes: [],
          ratings: [],
          priceRange: { min: 0, max: 0 },
          promotion: false,
        };
      }
      this.error = null;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.products = data;
        this.updatePriceRange(data);
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
        params.set("characters", filters.characters.join(","));
      }

      if (filters.universes.length > 0) {
        params.set("universes", filters.universes.join(","));
      }

      if (filters.ratings.length > 0) {
        params.set("ratings", filters.ratings.join(","));
      }

      if (filters.priceRange.min !== 0 || filters.priceRange.max !== 0) {
        params.set(
          "priceRange",
          `${filters.priceRange.min}-${filters.priceRange.max}`
        );
      }

      if (filters.promotion) {
        params.set("promotion", "true");
      }

      const url = `${apiUrl}/products?${params.toString()}`;

      console.log(url); // Pour tester l'URL construite

      // Appel à fetchProducts avec l'URL filtrée
      //this.fetchProducts(null,url);  // ENLEVER LE COMMENTAIRE POUR ACTIVER LA RECHERCHE
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
    setSearch(search) {
      this.search = search;
    },
  },
});

// Fonction pour regarder les changements dans selectedFilters
export function setupStoreWatchers(store) {
  watch(
    () => store.selectedFilters,
    (newValue, oldValue) => {
      if (store.search == "") {
        store.applyFilters();
      }
    },
    { deep: true }
  );
}
