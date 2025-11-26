import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import { createPinia } from "pinia";
import { useAuthStore } from '@/stores/auth'
import Antd from 'ant-design-vue';
import HighchartsVue from 'highcharts-vue';
import 'ant-design-vue/dist/reset.css';

// Create the app
const app = createApp(App);

// Create the pinia store
const pinia = createPinia();

// Register the router and pinia
app.use(pinia);
app.use(router);
app.use(Antd);
app.use(HighchartsVue);

// Initialize auth before mounting
const authStore = useAuthStore();

// Check auth on app mount
authStore.checkAuth().finally(() => {
    // Mount the app
    app.mount('#app');
});
