<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const { isLoading } = useAuthStore();

</script>
<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
    <span>Loading...</span>
  </div>
  <div>
    <h1 class="text-xl font-bold mb-4">Martin's NS Utilities page</h1>
    <hr class="border-gray-400 mb-4" />

    <p class="mb-3 text-sm">
      Here you find some utilities that I made in python and use now and then.
    </p>

    <ul class="list-disc list-inside text-sm space-y-1">
      <li>
        <router-link
          to="/upload-xml"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a-button
            :href="href"
            type="default"
            @click="navigate"
            :class="{ 'ant-btn-hover': isActive }"
          >Go to XML to PNG Upload</a-button>
          </router-link
        >
      </li>
      <li>
        <router-link
          to="/view-uploads"
          custom
          v-slot="{ navigate, href, isActive }"
          >
            <a-button
              :href="href"
              type="default"
              @click="navigate"
              :class="{ 'ant-btn-hover': isActive }"
            >View upload folders</a-button>
          </router-link
        >
      </li>
      <li>
      <router-link
          to="/convert-raw"
          custom
          v-slot="{ navigate, href, isActive }"
      >
        <a-button
            :href="href"
            type="default"
            @click="navigate"
            :class="{ 'ant-btn-hover': isActive }"
        >View upload folders</a-button>
      </router-link
      >
    </li>
      <li>
        This was made with
        <a
          href="https://www.pythonanywhere.com"
          target="_blank"
          rel="noopener"
          class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
          >Vue3 + TypeScript + Vite + TailwindCSS + AntDesignVue</a>
          and hosted on <a
            href="https://www.transip.nl"
            target="_blank"
            rel="noopener"
            class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
          >TransIP</a>
      </li>
    </ul>
  </div>
</template>