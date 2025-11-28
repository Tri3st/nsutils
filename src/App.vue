<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'

import Footer from './components/Footer.vue'

const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="min-h-screen bg-gray-300 text-gray-200 flex flex-col">
    <Header />
    <main class="flex-grow container mx-auto px-6 py-8">
      <RouterView></RouterView>
    </main>
    <Footer />
  </div>
</template>