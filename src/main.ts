import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import { createPinia } from "pinia";
import { useAuthStore } from '@/stores/auth'

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// Initialize auth before mounting
const authStore = useAuthStore();

authStore.checkAuth();

app.mount('#app');
