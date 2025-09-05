import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import { useAuth } from '@/stores/auth'

const app = createApp(App);

app.use(router);

// Initialize auth before mounting
const { initialize } = useAuth()
initialize().then(() => {
  app.mount('#app');
})
