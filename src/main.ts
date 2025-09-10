import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import { useAuthStore } from '@/stores/auth'

const app = createApp(App);

app.use(router);

// Initialize auth before mounting
const { initialize } = useAuthStore()
initialize().then(() => {
  app.mount('#app');
})
