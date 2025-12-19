<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-neutral-800 mt-24">
    <div class="max-w-6xl mx-auto px-6 py-6 text-xs text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-2">
      <span>© {{ currentYear }} Martin van Diest</span>

      <a
          href="mailto:martin.van.diest@gmail.com"
          class="hover:text-neutral-300 transition"
      >martin.van.diest@gmail.com</a
      >
    </div>
  </footer>
</template>