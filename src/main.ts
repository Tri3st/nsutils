import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import { createPinia } from "pinia";
import { useAuthStore } from '@/stores/auth'

// CReate the app
const app = createApp(App);

// Create the pinia store
const pinia = createPinia();

// Register the router and pinia
app.use(router);
app.use(pinia);

// Initialize auth before mounting
const authStore = useAuthStore();

// Check auth on app mount
authStore.checkAuth().finally(() => {
    // Mount the app
    app.mount('#app');
});


