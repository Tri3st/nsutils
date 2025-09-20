<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore);

const normalButton = "inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold" +
    " hadow-sm hover:bg-blue-700 transition";
const loginButton = "inline-flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-semibold" +
    " shadow-sm hover:bg-green-700 transition";
const logoutButton = "inline-flex items-center justify-center px-4 py-2 rounded-xl bg-red-600 text-white font-semibold" +
    " shadow-sm hover:bg-red-700 transition";
const normalActiveButton = "ring-2 ring-blue-800";
const loginActiveButton = "ring-2 ring-green-800";
const logoutActiveButton = "ring-2 ring-red-800";

</script>

<template>
  <nav class="bg-yellow-400 flex items-center justify-between px-6 py-2 shadow-md">
    <!-- Left: NS Logo -->
    <img src="/nslogo.svg" alt="NS Logo" class="h-8 w-auto" />

    <!-- Center: Navigation Buttons -->
    <div class="flex space-x-4 text-sm">
      <router-link
        to="/"
        :class="normalButton"
        :active-class="normalActiveButton"
        >Home</router-link
      >
      <router-link
        to="/upload-xml"
        :class="normalButton"
        :active-class="normalActiveButton"
        >Upload XML Files</router-link
      >
      <router-link
        to="/view-uploads"
        :class="normalButton"
        :active-class="normalActiveButton"
        >View uploads</router-link
      >
      <router-link
        to="/convert-raw"
        :class="normalButton"
        :active-class="normalActiveButton"
        >Convert RAW to PNG</router-link
      >

      <!-- Right: Auth Section -->
      <div class="flex items-center space-x-3">
        <!-- Show when logged in -->
        <template v-if="isAuthenticated">
          <!-- Username + Crown if ADMIN -->
          <div class="flex items-center space-x-1 text-blue-900 font-semibold">
            <span>{{ user!.username }}</span>
            <img src="/crown.svg" alt="Admin" class="w-5 h-5" v-if="isAdmin" />
          </div>
          <router-link
              to="/logout"
              :class="logoutButton"
              :active-class="logoutActiveButton"
          >Logout</router-link>
        </template>

        <!-- Show when logged out -->
        <template v-else>
          <router-link
              to="/login"
              :class="loginButton"
              :active-class="loginActiveButton"
          >Login</router-link>
        </template>

        <!-- Banner Image -->
        <img src="/new_banner_small.jpg" alt="Banner" class="h-12 w-auto" />
      </div>
    </div>

  </nav>
</template>