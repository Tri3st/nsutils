import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import { createPinia } from "pinia";
import { useAuthStore } from '@/stores/auth'
import axios from "axios";

// Setup the axios defaults for CSRF protection
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
authStore.checkAuth();

// Mount the app
app.mount('#app');
