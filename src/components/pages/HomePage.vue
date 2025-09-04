<script setup lang="ts">
</script>
<template>
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
          class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
          >Go to XML to PNG Upload</router-link
        >
      </li>
      <li>
        <router-link
          to="/view-uploads"
          class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
          >View upload folders</router-link
        >
      </li>
      <li>
        This was made with
        <a
          href="https://www.pythonanywhere.com"
          target="_blank"
          rel="noopener"
          class="text-blue-700 underline hover:text-blue-900 underline-offset-2"
          >pythonanywhere.com</a
        >
      </li>
    </ul>
  </div>
</template>