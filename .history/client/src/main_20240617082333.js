import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import './assets/global.css';

const app = createApp(App);

// Importation dynamique de jwt-decode
import('jwt-decode').then(jwt_decode => {
  const token = localStorage.getItem('jwt');
  if (token) {
    try {
      const decoded = jwt_decode.default(token);  // Assurez-vous d'accéder à l'export par défaut
      localStorage.setItem('role', decoded.role);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }
}).catch(error => console.error("Failed to load jwt-decode:", error));

app.use(router).mount('#app');
