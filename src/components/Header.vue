<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const { user, isAuthenticated, isAdmin } = useAuthStore()

const userEmail = computed(() => {
  return user.value?.email?.split('@')[0] || 'user'
})
</script>

<template>
  <nav class="bg-yellow-400 flex items-center justify-between px-6 py-2">
    <!-- Left: NS Logo -->
    <img src="/nslogo.svg" alt="NS Logo" class="h-8 w-auto" />

    <!-- Center: Navigation Buttons -->
    <div class="flex space-x-8 text-sm">
      <router-link
        to="/"
        class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
        active-class="font-bold"
        >Home</router-link
      >
      <router-link
        to="/upload-xml"
        class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
        active-class="font-bold"
        >Upload XML Files</router-link
      >
      <router-link
        to="/view-uploads"
        class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
        active-class="font-bold"
        >View uploads</router-link
      >
      <router-link
        to="/convert-raw"
        class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
        active-class="font-bold"
        >Convert RAW to PNG</router-link
      >
      <img src="crown.svg" alt="Crown" class="w-8 h-8" v-if="isAdmin"/>
      <router-link
        to="/logout"
        class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
        active-class="font-bold"
        v-if="isAuthenticated"
        >Logout {{ userEmail }}</router-link
      >
      <router-link
        to="/login"
        class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
        active-class="font-bold"
        v-else
        >Login</router-link
      >
    </div>

    <!-- Right: Banner Image -->
    <img src="/new_banner_small.jpg" alt="Banner" class="h-12 w-auto" />
  </nav>
</template>