<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePhotoStore, ExtractedImage } from '@/stores/photoStore';

const photoStore = usePhotoStore();

const selectedImage  = ref<ExtractedImage | null>(null);
const selectedIds = ref<number[]>([]);
const uploadType = ref<'xml' | 'zip'>('xml');
const selectedFile = ref<File | null>(null);

const acceptTypes = computed(() => {
  return uploadType.value === 'xml' ? '.xml' : '.zip';
});

async function saveSelectedImages() {
  if (!selectedIds.value.length) return;

  // implement your save logic here or in store if needed
  // For now, just log the IDs
  console.log('Saving selected images with ids: ', selectedIds.value);

  // Send images to API to save.

}

function onFileChanged(event: Event){
  console.log("onFileChanged triggered");
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    console.log("File selected:", target.files[0].name);
    selectedFile.value = target.files[0];
  } else {
    console.log("No file selected or file selection cancelled.");
    selectedFile.value = null;
  }
  console.log("selectedFile.value is now:", selectedFile.value);
}

async function uploadFile() {
  if (!selectedFile.value) return;

  const file = selectedFile.value;
  if (uploadType.value === 'xml') {
    photoStore.uploadFotos(file);
  } else {
    // Assuming you will create this method in your store
    // photoStore.uploadFotosZip(file); 
  }
}

// function viewImage(image: ExtractedImage) {
//  selectedImage.value = image;
// }

</script>

<template>

  <h1>UploadXml</h1>
  
  <div class="p-4">
  
    <div class="flex items-center space-x-4 mb-4">
      <label>
        <input type="radio" value="xml" v-model="uploadType" name="uploadType" />
        XML File
      </label>
      <label>
        <input type="radio" value="zip" v-model="uploadType" name="uploadType" />
        ZIP File
      </label>
    </div>
    
    <input type="file" @change="onFileChanged" :accept="acceptTypes" />
    <button
      v-if="selectedFile"
      @click="uploadFile"
      class="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      :disabled="photoStore.loading"
    >
      Upload
    </button>

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
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    @click.self="selectedImage = null"
  >
    <div class="bg-white rounded p-4 max-w-md max-h-full overflow-auto">
      <img :src="selectedImage.url" alt="Selected" class="max-w-full max-h-[80vh]" />
      <button
        class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
	@click="selectedImage = null"
      >Close</button>
    </div>
  </div>
	
</template>
