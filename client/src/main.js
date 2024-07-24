import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; 
import { jwtDecode } from "jwt-decode"; 
import './style.css';
import './assets/global.css';
import { usePersistedState } from './composables/usePersistedState';
import { useCartStore } from './stores/cartStore';
import { useShopStore, setupStoreWatchers } from './stores/useShopStore';
import { v4 as uuidv4 } from 'uuid';
import 'gridstack/dist/gridstack.min.css'; 
import 'gridstack/dist/gridstack-extra.min.css'; 
import { initializeAuth } from './utils/auth';
const app = createApp(App);


const pinia = createPinia();


app.use(pinia);


initializeAuth();

const cartStore = useCartStore();
usePersistedState(cartStore, 'cartStore');

const shopStore = useShopStore();
setupStoreWatchers(shopStore);


app.use(router).mount('#app');
