<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePhotoStore, ExtractedImage } from '@/stores/photoStore.ts';

const photoStore = usePhotoStore();

// Component State
const selectedImage  = ref<ExtractedImage | null>(null);
const selectedIds = ref<number[]>([]);
const uploadType = ref<'xml' | 'zip'>('xml');
const selectedFile = ref<File | null>(null);
const zipPassword = ref('');
const privatized = ref(false);
const inputFileRef = ref<HTMLInputElement | null>(null);

// Computed Properties
const acceptTypes = computed(() => {
  return uploadType.value === 'xml' ? '.xml' : '.zip';
});

// Methods
function togglePrivatized(){
  privatized.value = !privatized.value;
}

function clearAll(){
  selectedIds.value = [];
  photoStore.reset();
  selectedFile.value = null;
  zipPassword.value = '';
  selectedImage.value = null;
  uploadType.value = 'xml';
  if (inputFileRef.value) {
    inputFileRef.value.value = ''; // Resets the file input visually
  }
}

function onFileChanged(event: Event){
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    selectedFile.value = target.files[0];
  } else {
    selectedFile.value = null;
  }
}

async function uploadFile() {
  if (!selectedFile.value) return;

  // The store now handles its own errors, so we don't need to set them here.
  await photoStore.uploadFotos(
      selectedFile.value,
      uploadType.value,
      zipPassword.value // Pass the password directly; store handles if it's needed
  );
}

async function saveSelectedImages() {
  if (!selectedIds.value.length) return;
  // This logic should be in the store, but for now, we'll leave the console.log
  console.log('Saving selected images with ids: ', selectedIds.value);
  // await photoStore.saveImages(selectedIds.value);
}

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

    <div class="mb-4" v-if="uploadType === 'zip'">
      <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Password</label>
      <input
          type="password"
          v-model="zipPassword"
          placeholder="Enter ZIP password"
          class="border rounded px-3 py-2 w-full"
          autocomplete="off"
      />
    </div>
    
    <input type="file" @change="onFileChanged" :accept="acceptTypes" ref="inputFileRef" />
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
      <div v-if="photoStore.saving" class="mt-2 text-blue-600">Saving...</div>
      <div v-for="image in photoStore.images" :key="image.id" class="border rounded p-2">
        <input
          type="checkbox"
          :value="image.id"
          v-model="selectedIds"
          class="mb-2"
        />
        <img :src="image.url" alt="Extracted photo" class="w-full h-auto" />
        <div class="space-y-1 text-center">
          <div class="font-semibold text-gray-900" v-if="!privatized">
            {{ image.medewerker_number }}
          </div>
          <div class="flex justify-center gap-2 text-sm text-gray-500">
            <div>{{ image.image_type }}</div>
            <div>•</div>
            <div>{{ (image.image_size / 1024).toFixed(1) }} KB</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 space-x-2">
        <button
            v-if="photoStore.images.length > 0"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            @click="togglePrivatized"
        >{{ privatized ? "Unprivatize" : "Privatize" }}</button>
        <button
            v-if="photoStore.images.length > 0"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            :disabled="selectedIds.length === 0 || photoStore.saving"
            @click="saveSelectedImages"
        >Save selected ({{ selectedIds.length }})</button>
        <button
            class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            @click="clearAll"
        >Clear</button>
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
