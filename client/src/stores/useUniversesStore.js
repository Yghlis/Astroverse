import { defineStore } from 'pinia';

export const useUniversesStore = defineStore('universe', {
    state: () => ({
        universes: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchUniverses() {
            this.loading = true;
            this.error = null;
            try {
                const apiUrl = import.meta.env.VITE_API_URL;

                const response = await fetch(`${apiUrl}/universes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                this.universes = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
    },
});
