import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import TheShop from '../views/TheShop.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import ResetPassword from '../components/ResetPassword.vue';  // Assure-toi que ce composant existe et est correct

const routes = [
  { path: '/', component: LandingPage },
  { path: '/shop', component: TheShop },
  { path: '/register', component: Register, meta: { requiresGuest: true } },
  { path: '/forgot-password', component: ForgotPassword }, 
  { path: '/reset-password/:token', component: ResetPassword },  // Route pour réinitialiser le mot de passe avec token
  // Ajoutez d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwt'); // Change cela en fonction de comment tu gères l'authentification

  if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
    next('/'); // Redirige l'utilisateur connecté vers la page d'accueil s'il essaie d'accéder à `/register`
  } else {
    next(); // Continue vers la route demandée si aucune condition n'est remplie
  }
});

export default router;
