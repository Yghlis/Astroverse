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
import { v4 as uuidv4 } from 'uuid';
import { initializeAuth } from './utils/auth';
const app = createApp(App);

// Créer une instance de Pinia
const pinia = createPinia();


// Utiliser Pinia dans l'application Vue
app.use(pinia);

// Initialiser l'authentification
initializeAuth();

const cartStore = useCartStore();
usePersistedState(cartStore, 'cartStore'); // Utiliser usePersistedState pour sauvegarder le panier dans localStorage

const shopStore = useShopStore();
setupStoreWatchers(shopStore); // Appeler la fonction pour regarder les changements du filtre

// Utiliser le router et monter l'application
app.use(router).mount('#app');
