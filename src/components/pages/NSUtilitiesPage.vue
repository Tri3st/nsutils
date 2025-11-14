<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const { isLoading } = useAuthStore();

</script>
<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
    <span>Loading...</span>
  </div>
  <div>
    <h1 class="text-xl font-bold mb-4">Martin's Home</h1>
    <hr class="border-gray-400 mb-4" />

    <p class="mb-3 text-sm">
      Here you find some utilities that I made in python and use now and then.
    </p>

   <RouterView />

  </div>
</template>