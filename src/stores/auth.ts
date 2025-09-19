// src/stores/newauth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

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
      const response = await axios.post<{ userinfo: User }>(
        'http://localhost:8000/api/login/',
        { username, password },
        { withCredentials: true }
      );
      user.value = response.data.userinfo;
    } catch (err) {
      error.value = 'Login failed. Please check your credentials.';
      user.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    try {
      await axios.post(
        'http://localhost:8000/api/logout/',
        {},
        { withCredentials: true }
      );
      user.value = null;
    } catch (err) {
      error.value = 'Logout failed. Please try again.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function checkAuth() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get<{ userinfo: User | null }>(
        'http://localhost:8000/api/userinfo/',
        { withCredentials: true }
      );
      user.value = response.data.userinfo || null;
    } catch (err) {
      error.value = 'Failed to fetch user info.';
      user.value = null;
      throw err;
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