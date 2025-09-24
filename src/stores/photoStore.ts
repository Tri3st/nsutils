import { defineStore } from 'pinia';
import api from '@/api.ts';
import { ref } from 'vue';

export interface ExtractedImage {
  id: number;
  url: string;
}

export const usePhotoStore = defineStore('photoStore', () => {
  const images = ref<ExtractedImage[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function reset() {
    images.value = [];
    error.value = null;
  }

  async function uploadFotosXml(file: File) {
    reset();
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<ExtractedImage[]>('/upload-fotos-xml/', formData, {
        headers: {
          'Content-Type: multipart/form-data'
	},
      })

      images.value = response.data;
    } catch (e) {
      error.value = 'Failed to upload or process XML file.'
      console.error(e);
    } finally {
      loading.value = false;
    }

  }

  return {
    images, 
    loading,
    error,
    uploadFotosXml,
    reset
  }
})
