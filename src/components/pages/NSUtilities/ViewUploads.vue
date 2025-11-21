<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePhotoStore } from "@/stores/photoStore.ts";
import type { ExtractedImage } from "@/stores/photoStore.ts";

const photoStore = usePhotoStore();

const selectedImage = ref<ExtractedImage | null>(null);
const privatized = ref<boolean>(false);

const privatizedClass = "bg-red-500 hover:bg-red-600 text-white";
const unprivatizedClass = "bg-green-500 hover:bg-green-600 text-white";

function downloadImage(image: ExtractedImage) {
  const link = document.createElement("a");
  link.href = image.url;
  link.download = image.original_filename ?? "download.jpg";
  link.click();
}

function togglePrivatized() {
  privatized.value = !privatized.value;
}

onMounted(() => {
  photoStore.fetchUploads();
});
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">Uploaded Photos</h2>

    <a-button 
      @click="togglePrivatized"
      :class="privatized ? privatizedClass : unprivatizedClass"
      type="primary"
    >{{ privatized ? "Unprivatize" : "Privatize" }}</a-button>

    <div v-if="photoStore.loading" class="text-blue-600">Loading images...</div>
    <div v-if="photoStore.error" class="text-red-600">
      {{ photoStore.error }}
    </div>

    <div
      v-if="photoStore.images.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <div
        v-for="image in photoStore.images"
        :key="image.id"
        class="bg-white rounded-lg shadow hover:shadow-md p-2 flex flex-col items-center transition-all"
      >
        <img
          :src="image.url"
          alt="thumb"
          class="w-24 h-24 object-cover rounded cursor-pointer"
          @click="selectedImage = image"
        />
        <div class="mt-2 text-sm text-gray-700 font-semibold" v-if="!privatized">
          {{ image.medewerker_number }}
        </div>
        <div class="text-xs text-gray-500">
          {{ image.image_type }} • {{ (image.image_size / 1024).toFixed(1) }} KB
        </div>
        <button
          @click="downloadImage(image)"
          class="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
        >
          Download
        </button>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center mt-6 space-x-4">
      <button
        @click="
          photoStore.fetchUploads(photoStore.prevPage)
        "
        :disabled="!photoStore.prevPage"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>

      <div class="text-gray-600 text-sm">
        Page <span class="font-semibold">{{ photoStore.currentPage }}</span> of
        <span class="font-semibold">{{ photoStore.totalPages }}</span>
      </div>

      <button
        @click="
          photoStore.fetchUploads(photoStore.nextPage)
        "
        :disabled="!photoStore.nextPage"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- "Go to page" input -->
    <div class="mt-2 text-sm flex justify-center items-center space-x-2">
      <input
        type="number"
        min="1"
        :max="photoStore.totalPages"
        v-model.number="photoStore.currentPage"
        class="w-16 border rounded px-2 py-1 text-center"
      />
      <button
        @click="
          photoStore.fetchUploads(
            `/list_uploaded_fotos/?page=${photoStore.currentPage}`
          )
        "
        class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
      >
        Go
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click.self="selectedImage = null"
    >
      <div class="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
        <button
          @click="selectedImage = null"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <img
          :src="selectedImage.url"
          class="w-full max-h-[80vh] object-contain rounded"
        />
        <div class="mt-3 text-center text-gray-700 text-sm">
          <div class="font-semibold">
            {{ selectedImage.original_filename ?? "Unknown image" }}
          </div>
          <div>
            {{ selectedImage.image_type }} •
            {{ (selectedImage.image_size / 1024).toFixed(1) }} KB
          </div>
          <button
            @click="downloadImage(selectedImage)"
            class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
