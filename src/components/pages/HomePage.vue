<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen bg-black text-gray-200">

    <section class="px-8 py-32 text-center">
      <h2 class="text-4xl md:text-6xl font-extrabold mb-4">
        Hi, I'm <span class="text-purple-400">Martin van Diest</span>
      </h2>
      <p class="text-xl text-gray-400 mb-8">
        Professional Software Engineer & IT Enthusiast
      </p>

      <button
          class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition">
        View My Work
      </button>
    </section>

    <!-- About Section -->
    <section id="about" class="px-8 py-24 max-w-4xl mx-auto">
      <h3 class="text-3xl font-bold text-purple-400 mb-6">About Me</h3>
      <p class="text-gray-300 leading-relaxed">
        I’m a passionate software engineer specializing in modern frontend
        technologies, scalable architectures, and clean design. I enjoy
        building efficient solutions and exploring cutting-edge tech.
      </p>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="px-8 py-24 bg-black/70 border-y border-purple-900/30">
      <h3 class="text-3xl font-bold text-purple-400 mb-10 text-center">Skills</h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div class="p-4 border border-purple-700/30 rounded-lg text-center">
          Vue 3
        </div>
        <div class="p-4 border border-purple-700/30 rounded-lg text-center">
          Tailwind CSS
        </div>
        <div class="p-4 border border-purple-700/30 rounded-lg text-center">
          JavaScript / TypeScript
        </div>
        <div class="p-4 border border-purple-700/30 rounded-lg text-center">
          APIs & Backend Logic
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="px-8 py-24 max-w-6xl mx-auto">
      <h3 class="text-3xl font-bold text-purple-400 mb-10">Projects</h3>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-black/60 border border-purple-800/30 p-6 rounded-lg hover:border-purple-500 transition">
          <h4 class="text-xl font-semibold mb-3">Project One</h4>
          <p class="text-gray-400 text-sm mb-4">Short description of the project.</p>
          <button class="text-purple-400 hover:underline">View More →</button>
        </div>

        <div class="bg-black/60 border border-purple-800/30 p-6 rounded-lg hover:border-purple-500 transition">
          <h4 class="text-xl font-semibold mb-3">Project Two</h4>
          <p class="text-gray-400 text-sm mb-4">Short description of the project.</p>
          <button class="text-purple-400 hover:underline">View More →</button>
        </div>

        <div class="bg-black/60 border border-purple-800/30 p-6 rounded-lg hover:border-purple-500 transition">
          <h4 class="text-xl font-semibold mb-3">Project Three</h4>
          <p class="text-gray-400 text-sm mb-4">Short description of the project.</p>
          <button class="text-purple-400 hover:underline">View More →</button>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="px-8 py-24 text-center">
      <h3 class="text-3xl font-bold text-purple-400 mb-6">Get in Touch</h3>
      <p class="text-gray-300 mb-10">
        Want to collaborate or have a project in mind?
      </p>
      <button
          class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white">
        Contact Me
      </button>
    </section>

    <!-- Footer -->
    <footer class="py-10 text-center text-gray-500">
      © 2025 Your Name — Built with Vue 3 & Tailwind
    </footer>

  </div>
</template>

<style scoped>

</style>