import { createApp, ref } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import jwt_decode from 'jwt-decode'; // Utiliser l'importation nommée correcte
import './style.css';
import './assets/global.css';

// Fonction pour vérifier le statut de connexion
const userLoggedIn = ref(false);

const checkLoginStatus = () => {
  const token = localStorage.getItem('jwt');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp > Date.now() / 1000) {
      userLoggedIn.value = true;
    } else {
      localStorage.removeItem('jwt');
      userLoggedIn.value = false;
    }
  }
};

const app = createApp(App);

// Créer une instance de Pinia
const pinia = createPinia();

// Utiliser Pinia dans l'application Vue
app.use(pinia);

// Utiliser le router
app.use(router);

// Appeler checkLoginStatus au moment de la création de l'application
checkLoginStatus();

// Ajouter la variable userLoggedIn dans l'instance de l'application pour être utilisée dans les composants
app.provide('userLoggedIn', userLoggedIn);

// Monter l'application
app.mount('#app');

// Décoder le JWT et stocker le rôle dès que l'app est chargée
const token = localStorage.getItem('jwt');
if (token) {
    const decoded = jwt_decode(token); // Utiliser jwt_decode qui a été importé
    localStorage.setItem('role', decoded.role); // Stocker le rôle dans localStorage pour utilisation ultérieure
}
