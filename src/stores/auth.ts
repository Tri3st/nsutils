// src/stores/newauth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from "@/api.ts";

export type User = {
    username: string;
    email: string | null;
    role: 'A' | 'U' | 'G' | null; // 'A' for Admin, 'U' for User, 'G' for Guest
    // Add other user fields as needed
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'A');

  async function login(username: string, password: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<{ userinfo: User }>(
        '/login/',
        { username, password }
      );
      user.value = response.data.userinfo;
    } catch (err) {
      error.value = 'Login failed. Please check your credentials.';
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    try {
      await api.post(
        '/logout/',
        {}
      );
      user.value = null;
    } catch (err) {
      error.value = 'Logout failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  async function checkAuth() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<{ userinfo: User | null }>(
        '/userinfo/'
      );
      user.value = response.data.userinfo || null;
    } catch (err) {
      error.value = 'Failed to fetch user info.';
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth
  };
});