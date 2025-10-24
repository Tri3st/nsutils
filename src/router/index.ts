import {createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import HomePage from '@/components/pages/HomePage.vue'
import UploadXML from '@/components/pages/UploadXML.vue'
import ViewUploads from '@/components/pages/ViewUploads.vue'
import ConvertRaw from '@/components/pages/ConvertRaw.vue'
import Logout from '@/components/pages/Logout.vue'
import LoginPage from '@/components/pages/LoginPage.vue'

// By declaring this module, we can add custom properties to the RouteMeta
declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
    }
}

const routes: Array<RouteRecordRaw> = [
    {path: '/', name: 'Home', component: HomePage},
    {path: '/upload-xml', name: 'UploadXML', component: UploadXML, meta: {requiresAuth: true}},
    {path: '/view-uploads', name: 'ViewUploads', component: ViewUploads, meta: {requiresAuth: true}},
    {path: '/convert-raw', name: 'ConvertRaw', component: ConvertRaw, meta: {requiresAuth: true}},
    {path: '/logout', name: 'Logout', component: Logout, meta: {requiresAuth: true}},
    {path: '/login', name: 'Login', component: LoginPage}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Auth guard
router.beforeEach(async (to, _, next: NavigationGuardNext) => {
    const authStore = useAuthStore();
    // Check auth status on every navigation
    if (authStore.user === null) {
        await authStore.checkAuth();
    }

    const requiresAuth = to.meta.requiresAuth;
    const isAuthenticated = !!authStore.user;

    if (requiresAuth && !isAuthenticated) {
        // If route requires auth and user is not authenticated, redirect to login
        next({ name: 'Login' });
    } else if (to.name === 'Login' && isAuthenticated) {
        // If user is authenticated and tries to access login page, redirect to home
        next({ name: 'Home' });
    } else {
        // Otherwise, allow navigation
        next();
    }
})

export default router
