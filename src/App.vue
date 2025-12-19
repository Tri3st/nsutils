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
  <div class="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col">
    <Header />
    <main class="flex-1 max-w-6xl mx-auto w-full px-6">
      <RouterView></RouterView>
    </main>
    <Footer />
  </div>
</template>
