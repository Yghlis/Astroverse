import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Importer Pinia
import { jwtDecode } from "jwt-decode"; // Importation nommée, s'assurer que jwt-decode expose vraiment cette fonction
import './style.css';
import './assets/global.css';

const app = createApp(App);

// Créer une instance de Pinia
const pinia = createPinia();

// Décoder le JWT et stocker le rôle dès que l'app est chargée
const token = localStorage.getItem('jwt');
if (token) {
    const decoded = jwtDecode(token); // Utiliser jwtDecode qui a été importé
    localStorage.setItem('role', decoded.role); // Stocker le rôle dans localStorage pour utilisation ultérieure
}

// Utiliser Pinia dans l'application Vue
app.use(pinia);

// Utiliser le router et monter l'application
app.use(router).mount('#app');
