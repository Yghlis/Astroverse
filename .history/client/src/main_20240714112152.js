import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Importer Pinia
import { jwtDecode } from "jwt-decode"; // Importation nommée, s'assurer que jwt-decode expose vraiment cette fonction
import './style.css';
import './assets/global.css';
import { usePersistedState } from './composables/usePersistedState';
import { useCartStore } from './stores/cartStore';
import { useShopStore, setupStoreWatchers } from './stores/useShopStore';

const app = createApp(App);

// Créer une instance de Pinia
const pinia = createPinia();

// Décoder le JWT et stocker le rôle dès que l'app est chargée
const token = localStorage.getItem('jwt');
if (token) {
    const decoded = jwtDecode(token); // Utiliser jwtDecode qui a été importé
    localStorage.setItem('role', decoded.role); // Stocker le rôle dans localStorage pour utilisation ultérieure
}

// Récupérer et stocker le sessionId
document.addEventListener('DOMContentLoaded', () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        fetch('/')
            .then(response => {
                sessionId = response.headers.get('session-id');
                if (sessionId) {
                    localStorage.setItem('sessionId', sessionId);
                }
            })
            .catch(error => {
                console.error('Error fetching session ID:', error);
            });
    }
});

// Utiliser Pinia dans l'application Vue
app.use(pinia);

const cartStore = useCartStore();
usePersistedState(cartStore, 'cartStore'); // Utiliser usePersistedState pour sauvegarder le panier dans localStorage

const shopStore = useShopStore();
setupStoreWatchers(shopStore); // Appeler la fonction pour regarder les changements du filtre

// Utiliser le router et monter l'application
app.use(router).mount('#app');
