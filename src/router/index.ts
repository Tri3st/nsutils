import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '@/components/pages/HomePage.vue'
import UploadXML from '@/components/pages/UploadXML.vue'
import ViewUploads from '@/components/pages/ViewUploads.vue'
import ConvertRaw from '@/components/pages/ConvertRaw.vue'
import Logout from '@/components/pages/Logout.vue'
import LoginPage from '@/components/pages/LoginPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/upload-xml', name: 'UploadXML', component: UploadXML },
  { path: '/view-uploads', name: 'ViewUploads', component: ViewUploads },
  { path: '/convert-raw', name: 'ConvertRaw', component: ConvertRaw },
  { path: '/logout', name: 'Logout', component: Logout },
  { path: '/login', name: 'Login', component: LoginPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard
router.beforeEach(async (to: any) => {
  const { isAuthenticated } = useAuthStore()
  
  // Allow access to login page
  if (to.name === 'Login') {
    return true
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return { name: 'Login' }
  }
  
  return true
})

export default router