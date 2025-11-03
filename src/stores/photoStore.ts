import { defineStore } from 'pinia';
import { api } from '@/api.ts';
import { ref } from 'vue';

export interface ExtractedImage {
  id: number;
  url: string;
  image_size: number;
  image_type: string;
  medewerker_number: string;
}

export const usePhotoStore = defineStore('photoStore', () => {
  const images = ref<ExtractedImage[]>([]);
  const loading = ref<boolean>(false);
  const saving = ref<boolean>(false);
  const error = ref<string | null>(null);

  function reset() {
    images.value = [];
    error.value = null;
    loading.value = false;
    saving.value = false;
  }

  async function uploadFotos(file: File, type: 'xml' | 'zip', zippassw: string | undefined) {
    reset();
    if (!file || !type || type !== 'zip' && type !== 'xml') return;
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (type === 'zip' && zippassw) {
          formData.append('zip-passw', zippassw);
      }

      const response = await api.post<ExtractedImage[]>(`/upload-fotos/`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })

      images.value = response.data;
    } catch (e: any) {
      error.value = 'Failed to upload or process XML/ZIP file.'
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function uploadFoto(dataBlob: Blob, suggestedFileName: string, mimeType: string) {
    error.value = null;
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', dataBlob, suggestedFileName);
      formData.append('image_type', mimeType);
      formData.append('image_size' , dataBlob.size.toString());
      
      const uploadResponse = await api.post<ExtractedImage>(`/upload-foto/`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })

      // Add the newly uploaded image to the store
      images.value.push(uploadResponse.data);
    } catch (e: any) {
      error.value = e?.message || 'Failed to upload image.'
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function saveSelectedImages(ids: number[]){
    if (!ids.length) return;

    saving.value = true;
    error.value = null;

    try {
      await api.post('/save-selected-images/', { ids });

      // Optionally refresh images or clear selection
      // Here just clear images
      images.value = images.value.filter(img => !ids.includes(img.id));
    } catch (e: any) {
      error.value = e?.response?.data?.error || 'Failed to save selected images.';
      console.error(e);
    } finally {
      saving.value = false;
    }
  }

  return {
    images, 
    loading,
    saving,
    error,
    uploadFotos,
    uploadFoto,
    saveSelectedImages,
    reset
  }
})
