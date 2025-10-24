import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import HomePage from '@/components/pages/HomePage.vue'
import UploadXML from '@/components/pages/UploadXML.vue'
import ViewUploads from '@/components/pages/ViewUploads.vue'
import ConvertRaw from '@/components/pages/ConvertRaw.vue'
import Logout from '@/components/pages/Logout.vue'
import LoginPage from '@/components/pages/LoginPage.vue'

const routes = [
    {path: '/', name: 'Home', component: HomePage},
    {path: '/upload-xml', name: 'UploadXML', component: UploadXML, meta: {requiresAuth: true} as RouteMeta},
    {path: '/view-uploads', name: 'ViewUploads', component: ViewUploads, meta: {requiresAuth: true} as RouteMeta},
    {path: '/convert-raw', name: 'ConvertRaw', component: ConvertRaw, meta: {requiresAuth: true} as RouteMeta},
    {path: '/logout', name: 'Logout', component: Logout, meta: {requiresAuth: true} as RouteMeta},
    {path: '/login', name: 'Login', component: LoginPage}
]

// Define route neta type with requiresAuth
interface RouteMeta {
    requiresAuth?: boolean;
}

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Auth guard
router.beforeEach(async (to, _, next: any) => {
    const authStore = useAuthStore();
    if (authStore.user === null) {
        await authStore.checkAuth();
    }

    // Allow access to login page
    if (to.meta.requiresAuth && !authStore.user) {
        next('/login')
    } else if (to.path === 'login' && authStore.user) {
        next('/home')
    } else {
        next();
    }
})

export default router