import { defineStore } from 'pinia';

export const useUniversesStore = defineStore('universe', {
    state: () => ({
        universes: [],
        followedUniverses: [],  // Ajouté pour suivre les univers
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

        async followUniverse(universeId) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/universes/${universeId}/follow`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to follow universe');
                }
                this.followedUniverses.push(universeId);
            } catch (error) {
                this.error = error.message;
            }
        },

        async unfollowUniverse(universeId) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/universes/${universeId}/unfollow`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to unfollow universe');
                }
                this.followedUniverses = this.followedUniverses.filter(id => id !== universeId);
            } catch (error) {
                this.error = error.message;
            }
        },
    },
});
