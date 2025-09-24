<script setup lang="ts">
import { ref } from 'vue';
import { usePhotoStore, ExtractedImage } from '@/stores/photoStore';

const photoStore = usePhotoStore();

const selectedImage  = ref<ExtractedImage | null>(null);
const selectedIds = ref<number[]>([]);

async function saveSelectedImages() {
  if (!selectedIds.value.length) return;

  // implement your save logic here or in store if needed
  // For now, just log the IDs
  console.log('Saving selected images with ids: ', selectedIds.value);

  // Send images to API to save.

}

async function onFileSelected(event: Event){
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return

  const file = target.files[0]
  photoStore.uploadFotosXml(file);
}

// function viewImage(image: ExtractedImage) {
//  selectedImage.value = image;
// }

</script>

<template>

  <h1>UploadXml</h1>
  
  <div class="p-4">
    <input type="file"@change="onFileSelected" accept=".xml" />

    <div v-if="photoStore.loading" class="mt-2 text-blue-600">Uploading and processing ...</div>

    <div v-if="photoStore.error" class="mt-2 text-red-600">{{ photoStore.error }}</div>

    <div class="grid grid-cols-4 gap-4 mt-4" v-if="photoStore.images.length" >
      <div v-for="image in photoStore.images" :key="image.id" class="border rounded p-2">
	<input 
	  type="checkbox"
	  :value="image.id"
	  v-model="selectedIds"
	  class="mb-2"
	/>
        <img :src="image.url" alt="Extracted photo" class="w-full h-auto" />
        <button 
	  class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
	  :disabled="!selectedIds.length || photoStore.saving"
	  @click="saveSelectedImages"
	>Save selected ({{ selectedIds.length }})</button>
	<div v-if="photoStore.saving" class="mt-2 text-blue-600">Saving...</div>
      </div>
    </div>
  </div>


  <!-- Image Modal -->
  <div 
    v-if="selectedImage"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center jistify-center z-50"
    @click.self="selectedImage = null"
  >
    <div class="bh-white rounded p-4 max-w-md max-h-full overflow-auto">
      <img :src="selectedImage.url" alt="Selected" class="max-w-full max-h-[80vh]" />
      <button
        class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
	@click="selectedImage = null"
      >Close</button>
    </div>
  </div>
	
</template>
