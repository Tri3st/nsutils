<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { signOut } = useAuth()
const router = useRouter()

onMounted(async () => {
  try {
    await signOut()
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('Error signing out:', error)
    router.push('/login')
  }
})
</script>

<template>
  <div class="text-center py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Successfully logged out</h1>
    <p class="text-gray-600">Redirecting to login page...</p>
  </div>
</template>