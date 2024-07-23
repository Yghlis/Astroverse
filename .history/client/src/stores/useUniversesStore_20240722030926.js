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
            const userId = localStorage.getItem('userId');
            console.log("API call to follow universe:", universeId);
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`http://localhost:8000//universes/${universeId}/follow`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    },
                    body: JSON.stringify({ userId: userId })
                });
                if (!response.ok) {
                    throw new Error('Failed to follow universe');
                }
                this.followedUniverses.push(universeId);
                console.log("Successfully followed universe:", universeId);
            } catch (error) {
                this.error = error.message;
                console.error("Error following universe:", error);
            }
        },

        async unfollowUniverse(universeId) {
            console.log("API call to unfollow universe:", universeId);
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
                console.log("Successfully unfollowed universe:", universeId);
            } catch (error) {
                this.error = error.message;
                console.error("Error unfollowing universe:", error);
            }
        },
    },
});
