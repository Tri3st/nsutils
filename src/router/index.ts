import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
    NavigationGuardNext,
    RouteLocationNormalized,
} from "vue-router";
import {useAuthStore} from "@/stores/auth";

// By declaring this module, we can add custom properties to the RouteMeta
declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/components/pages/HomePage.vue"),
    },
    {
        path: "/aboutme",
        name: "About Me",
        component: () => import("@/components/pages/AboutMe.vue"),
    },
    {
        path: "/links",
        name: "Links",
        component: () => import("@/components/pages/LinksPage.vue"),
    },
    {
        path: "/myhealth",
        name: "My Health",
        component: () => import("@/components/pages/MyHealth.vue"),
    },
    {
        path: "/nsutilities",
        name: "NSUtilities",
        component: () => import("@/components/pages/NSUtilities.vue"), // new wrapper page component, see step 2
        meta: {requiresAuth: true},
        children: [
            {
                path: "upload-xml", // removed leading slash for nested path
                name: "UploadXML",
                component: () => import("@/components/pages/NSUtilities/UploadXML.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: "view-uploads",
                name: "ViewUploads",
                component: () => import("@/components/pages/NSUtilities/ViewUploads.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: "convert-raw",
                name: "ConvertRaw",
                component: () => import("@/components/pages/NSUtilities/ConvertRaw.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: "user-manager",
                name: "UserManager",
                component: () => import("@/components/pages/NSUtilities/UserManager.vue"),
                meta: {requiresAuth: true},
            },
        ],
    },
    {
        path: "/logout",
        name: "Logout",
        component: () => import("@/components/pages/Logout.vue"),
        meta: {requiresAuth: true},
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/components/pages/LoginPage.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Auth guard
router.beforeEach(
    async (to: RouteLocationNormalized, _, next: NavigationGuardNext) => {
        // Get the authStore instance
        const authStore = useAuthStore();

        // Check auth status on every navigation
        if (authStore.user === null) {
            await authStore.checkAuth();
        }

        const requiresAuth = to.meta.requiresAuth;
        const isAuthenticated = !!authStore.user;

        if (requiresAuth && !isAuthenticated) {
            // If route requires auth and user is not authenticated, redirect to login
            next({name: "Login"});
        } else if (to.name === "Login" && isAuthenticated) {
            // If user is authenticated and tries to access login page, redirect to home
            next({name: "Home"});
        } else {
            // Otherwise, allow navigation
            next();
        }
    }
);

export default router;
