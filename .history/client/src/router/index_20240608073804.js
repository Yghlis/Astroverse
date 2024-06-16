import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import HelloWorld from '../components/HelloWorld.vue';
import TheShop from '../views/TheShop.vue';
// import Logout from '../views/Logout.vue';
// import ForgotPassword from '../views/ForgotPassword.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/shop', component: TheShop},
  { path: '/register', component: Register }, 
//   { path: '/forgot-password', component: ForgotPassword },
//   // Ajoutez d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;