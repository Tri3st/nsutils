<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const navItems = [
  { name: "UploadXML", label: "Upload XML", path: "upload-xml" },
  { name: "ViewUploads", label: "View Uploads", path: "view-uploads" },
  { name: "ConvertRaw", label: "Convert RAW", path: "convert-raw" },
  { name: "UserManager", label: "User Manager", path: "user-manager" },
];

// Helper to build full path
const getFullPath = (subPath: string) => `/nsutilities/${subPath}`;
</script>

<template>
  <div>
    <h2 class="mb-4">NS Utilities</h2>

    <!-- Sub navbar -->
    <nav class="flex space-x-4 border-b border-gray-300 mb-6">
      <button
        v-for="item in navItems"
        :key="item.name"
        class="px-3 py-2 focus:outline-none"
        :class="{
          'border-b-2 border-blue-600 font-semibold': route.name === item.name,
          'text-gray-600 hover:text-blue-600': route.name !== item.name,
        }"
        @click="router.push(getFullPath(item.path))"
      >
        {{ item.label }}
      </button>
    </nav>

    <!-- Nested route renders here -->
    <router-view />
  </div>
</template>

<style scoped>
/* Add any styles you need here */
</style>
