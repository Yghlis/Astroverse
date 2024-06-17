import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { default as jwt_decode } from 'jwt-decode';

import './style.css'
import './assets/global.css'

const app = createApp(App)

// Décoder le JWT et stocker le rôle dès que l'app est chargée
const token = localStorage.getItem('jwt');
if (token) {
    const decoded = jwt_decode(token);
    // Vous pouvez choisir de faire quelque chose avec le rôle ici, par exemple :
    localStorage.setItem('role', decoded.role); // Stocker le rôle dans localStorage pour utilisation ultérieure
}

app.use(router).mount('#app');
