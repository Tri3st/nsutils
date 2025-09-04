<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-yellow-400 text-center text-xs py-2">
    © {{ currentYear }} Martin van Diest
    <a
      href="mailto:martin.van.diest@gmail.com"
      class="underline text-blue-700 hover:text-blue-900"
      >martin.van.diest@gmail.com</a
    >
  </footer>
</template>