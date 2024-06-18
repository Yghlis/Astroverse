import { defineStore } from 'pinia';

export const useShopStore = defineStore('shop', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    filters: {
      checkboxes: {
        characters: [],
        universes: []
      },
      ranges: {
        price: { min: 0, max: 0 },
        rating: { min: 0, max: 0 }
      },
      is_promotion: false
    }
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('http://localhost:8000/products'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.products = data;
        this.updatePriceRange(data);
        this.updateRatingRange(data);
      } catch (error) {
        this.error = 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },

    async fetchFilterOptions() {
      this.loading = true;
      this.error = null;
      try {
        const [charactersResponse, universesResponse] = await Promise.all([
          fetch('http://localhost:8000/characters'),
          fetch('http://localhost:8000/universes')
        ]);

        if (!charactersResponse.ok || !universesResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const charactersData = await charactersResponse.json();
        const universesData = await universesResponse.json();

        this.filters.checkboxes.characters = charactersData.map(character => character.name);
        this.filters.checkboxes.universes = universesData.map(universe => universe.name);

      } catch (error) {
        this.error = 'Failed to fetch filter options';
      } finally {
        this.loading = false;
      }
    },

    updatePriceRange(products) {
      const prices = products.map(product => product.price);
      this.filters.ranges.price.min = Math.min(...prices);
      this.filters.ranges.price.max = Math.max(...prices);
    },

    updateRatingRange(products) {
      const ratings = products.map(product => product.rating);
      this.filters.ranges.rating.min = Math.min(...ratings);
      this.filters.ranges.rating.max = Math.max(...ratings);
    }
  },
});
