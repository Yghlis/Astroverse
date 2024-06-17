import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/global.css'

const app = createApp(App);

(async () => {
  const token = localStorage.getItem('jwt');
  if (token) {
    const { default: jwt_decode } = await import('jwt-decode');
    const decoded = jwt_decode(token);
    localStorage.setItem('role', decoded.role); // Stocker le rôle dans localStorage pour utilisation ultérieure
  }

  app.use(router).mount('#app');
})();
