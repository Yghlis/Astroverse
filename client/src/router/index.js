import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
// import Logout from '../views/Logout.vue';
// import ForgotPassword from '../views/ForgotPassword.vue';

const routes = [
  { path: '/login', component: Login },
//   { path: '/logout', component: Logout },
//   { path: '/forgot-password', component: ForgotPassword },
//   // Ajoutez d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;