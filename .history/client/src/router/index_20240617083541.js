import { createRouter, createWebHistory } from 'vue-router';
import { jwtDecode } from "jwt-decode";// Importation par défaut correcte
import LandingPage from '../views/LandingPage.vue';
import TheShop from '../views/TheShop.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import ResetPassword from '../components/ResetPassword.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/shop', component: TheShop },
  { path: '/register', component: Register, meta: { requiresGuest: true } },
  { path: '/forgot-password', component: ForgotPassword }, 
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, role: 'ROLE_ADMIN' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decoded = jwt_decode(token); // Assurez-vous que jwt_decode est correctement importé
      isAuthenticated = true;
      userRole = decoded.role;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }

  console.log('JWT:', isAuthenticated);
  console.log('Role:', userRole);

  if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
    next('/');
  } else if (to.matched.some(record => record.meta.requiresAuth && !isAuthenticated)) {
    next('/login');
  } else if (to.matched.some(record => record.meta.role && record.meta.role !== userRole)) {
    next('/');
  } else {
    next();
  }
});

export default router;
