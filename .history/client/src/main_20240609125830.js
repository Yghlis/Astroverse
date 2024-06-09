import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';


const app = createApp(App);

app.use(router);
app.use(Toast, {
  position: POSITION.TOP_RIGHT
});

app.mount('#app');
