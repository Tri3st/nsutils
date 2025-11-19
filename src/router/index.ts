import {
<<<<<<< HEAD
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
=======
    createRouter,
    createWebHistory,
    RouteRecordRaw,
    NavigationGuardNext,
    RouteLocationNormalized
>>>>>>> 79d0848a9c6a956d68be8c207010f78b27d1d5d9
} from "vue-router";
import {useAuthStore} from "@/stores/auth";

// By declaring this module, we can add custom properties to the RouteMeta
declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
    }
}

const routes: Array<RouteRecordRaw> = [
<<<<<<< HEAD
  {
    path: "/",
    name: "Home",
    component: () => import("@/components/pages/HomePage.vue"),
  },
  {
    path: "/nsutilities",
    name: "NSUtilities",
    component: () => import("@/components/pages/NSUtilities.vue"), // new wrapper page component, see step 2
    meta: { requiresAuth: true },
    children: [
      {
        path: "upload-xml", // removed leading slash for nested path
        name: "UploadXML",
        component: () => import("@/components/pages/UploadXML.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "view-uploads",
        name: "ViewUploads",
        component: () => import("@/components/pages/ViewUploads.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "convert-raw",
        name: "ConvertRaw",
        component: () => import("@/components/pages/ConvertRaw.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "user-manager",
        name: "UserManager",
        component: () => import("@/components/pages/UserManager.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("@/components/pages/Logout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/pages/LoginPage.vue"),
  },
=======
    {
        path: "/",
        name: "Home",
        component: () => import("@/components/pages/HomePage.vue")
    },
    {
        path: "/aboutme",
        name: "AboutMe",
        component: () => import("@/components/pages/HomePage.vue")
    },
    {
        path: "/myhealth",
        name: "MyHealth",
        component: () => import("@/components/pages/HomePage.vue")
    },
    {
        path: "/nsutilities",
        name: "NSUtilities",
        children: [
            {
                path: "/upload-xml",
                name: "UploadXML",
                component: () => import("@/components/pages/UploadXML.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: "/view-uploads",
                name: "ViewUploads",
                component: () => import("@/components/pages/ViewUploads.vue"),
                meta: {requiresAuth: true},
            },
            {
                path: "/convert-raw",
                name: "ConvertRaw",
                component: () => import("@/components/pages/ConvertRaw.vue"),
                meta: {requiresAuth: true},
            },
        ],
        meta: {requiresAuth: true},
    },
    {
        path: "/links",
        name: "Links",
        component: () => import("@/components/pages/HomePage.vue")
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
        component: () => import("@/components/pages/LoginPage.vue")
    },
>>>>>>> 79d0848a9c6a956d68be8c207010f78b27d1d5d9
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
<<<<<<< HEAD
      await authStore.checkAuth();
=======
        await authStore.checkAuth();
>>>>>>> 79d0848a9c6a956d68be8c207010f78b27d1d5d9
    }

    const requiresAuth = to.meta.requiresAuth;
    const isAuthenticated = !!authStore.user;

    if (requiresAuth && !isAuthenticated) {
<<<<<<< HEAD
      // If route requires auth and user is not authenticated, redirect to login
      next({ name: "Login" });
    } else if (to.name === "Login" && isAuthenticated) {
      // If user is authenticated and tries to access login page, redirect to home
      next({ name: "Home" });
    } else {
      // Otherwise, allow navigation
      next();
    }
  }
);
=======
        // If route requires auth and user is not authenticated, redirect to login
        next({name: "Login"});
    } else if (to.name === "Login" && isAuthenticated) {
        // If user is authenticated and tries to access login page, redirect to home
        next({name: "Home"});
    } else {
        // Otherwise, allow navigation
        next();
    }
});
>>>>>>> 79d0848a9c6a956d68be8c207010f78b27d1d5d9

export default router;
