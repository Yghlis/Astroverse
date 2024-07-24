import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode"; 
import LandingPage from "../views/LandingPage.vue";
import TheShop from "../views/TheShop.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../components/ForgotPassword.vue";
import ResetPassword from "../components/ResetPassword.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import TheForm from "../ui/TheForm.vue";
import ShopItem from "../views/ShopItem.vue";
import ChangePassword from "../components/ChangePassword.vue"; 
import CartCheckout from "../views/CartCheckout.vue";
import UserProfile from "../views/UserProfile.vue";
import Confirmation from "../components/Confirmation.vue";
import LegalContent from "../components/LegalContent.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/shop", component: TheShop },
  { path: "/register", component: Register, meta: { requiresGuest: true } },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password/:token", component: ResetPassword },
  { path: "/admin", component: AdminDashboard, meta: { requiresAuth: true, roles: ["ROLE_ADMIN", "ROLE_STORE_KEEPER"] } },
  { path: "/form", component: TheForm },
  { path: "/item/:id", component: ShopItem },
  { path: "/change-password/:userId/:token", name: "ChangePassword", component: ChangePassword }, 
  { path: "/cart-checkout", component: CartCheckout },
  { path: "/profile", component: UserProfile, meta: { requiresAuth: false } },	
  { path: '/confirmation', name: 'Confirmation', component: Confirmation },
  { path: '/legal/:section', name: 'LegalContent', component: LegalContent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("jwt");
  let isAuthenticated = false;
  let userRole = null;
  let mustChangePassword = false;
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token); 
      isAuthenticated = true;
      userRole = decoded.role;
      mustChangePassword = decoded.mustChangePassword; 
      userId = decoded.userId;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  } else {
   
  }



  if (mustChangePassword && to.name !== "ChangePassword") {
    next({ name: "ChangePassword", params: { userId, token } });
  } else if (
    to.matched.some((record) => record.meta.requiresGuest) &&
    isAuthenticated
  ) {
    next("/");
  } else if (
    to.matched.some((record) => record.meta.requiresAuth && !isAuthenticated)
  ) {
    next("/");
  } else if (
    to.matched.some(
      (record) => record.meta.role && record.meta.role !== userRole
    )
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
