import { defineStore } from 'pinia';
import { api } from '@/api.ts';
import { ref } from 'vue';
import type { ExtractedImage, PaginatedUploadsResponse } from '@/types/fotos.ts';


export const usePhotoStore = defineStore('photoStore', () => {
  // State
  const images = ref<ExtractedImage[]>([]);
  const loading = ref<boolean>(false);
  const saving = ref<boolean>(false);
  const error = ref<string | null>(null);
  const nextPage = ref<string | null>(null);
  const prevPage = ref<string | null>(null);
  const currentPage = ref<number>(1);
  const totalPages = ref<number>(1);
  const pageSize = 12;  // Should match Django REST pagination

  // Actions
  function reset() {
    images.value = [];
    error.value = null;
    loading.value = false;
    saving.value = false;
    nextPage.value = null;
    prevPage.value = null;
    currentPage.value = 1;
    totalPages.value = 1;
  }

  async function uploadFotos(file: File, type: 'xml' | 'zip', zippassw: string | undefined) {
    reset();
    if (!file) return;
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (type === 'zip' && zippassw) {
          // Corrected key to 'zippassw' for consistency
          formData.append('zippassw', zippassw);
      }

      // Removed redundant Content-Type header; axios handles it for FormData
      const response = await api.post<ExtractedImage[]>('/upload-fotos/', formData);
      images.value = response.data;
    } catch (e: unknown) {
        if (e instanceof Error) {
            error.value = e.message;
        } else {
            error.value = 'An unknown error occurred during upload.';
        }
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
      
      // Removed redundant Content-Type header
      const response = await api.post<ExtractedImage>('/upload-foto/', formData);
      images.value.push(response.data);
    } catch (e: unknown) {
        if (e instanceof Error) {
            error.value = e.message;
        } else {
            error.value = 'An unknown error occurred during single photo upload.';
        }
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUploads(url: string | null = '/list_uploaded_fotos/'){
      if (!url) return; // Do not fetch if the URL is null

      loading.value = true;
      error.value = null;
      
      try {
          const response = await api.get<PaginatedUploadsResponse>(url);
          const { results, next, previous, count } = response.data;

          images.value = results;
          nextPage.value = next;
          prevPage.value = previous;
          
          // Calculate total pages
          totalPages.value = Math.ceil(count / pageSize);

          // Extract page number from the URL that was just fetched
          const fetchedUrl = new URL(url, window.location.origin);
          const pageParam = fetchedUrl.searchParams.get('page');
          currentPage.value = pageParam ? parseInt(pageParam, 10) : 1;
          
      } catch (e: unknown) {
          if (e instanceof Error) {
              error.value = e.message;
          } else {
              error.value = 'Failed to fetch uploads.';
          }
          console.error(e);
      } finally {
          loading.value = false;
      }
  }

  return {
    images, 
    loading,
    saving,
    error,
    uploadFotos,
    uploadFoto,
    fetchUploads,
    reset,
      
    // Pagination
    currentPage, 
    totalPages, 
    nextPage,
    prevPage
  }
});
