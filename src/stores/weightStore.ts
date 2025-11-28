import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api';
import type { WeightMeasurement, FetchParams } from '@/types/weight';

interface PaginationResponse {
    count: number;
    total_pages: number;
    page: number;
    page_size: number;
    results: WeightMeasurement[];
}

interface Minmaxavg {
    'weight_kg': number;
    'bone_mass': number;
    'body_fat': number;
    'body_water': number;
    'muscle_mass': number;
    'bmi': number;
}

interface MinmaxavgType {
    'minmaxavg': {
        'avg': Minmaxavg;
        'min': Minmaxavg;
        'max': Minmaxavg;
    }
}

export const useWeightStore = defineStore('weightStore', () => {
    
    // State
    const weightData = ref<Array<WeightMeasurement>>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Pagination metadata
    const totalItems = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(12);

    const minmaxavg = ref<MinmaxavgType | null>(null);

    // Actions
    async function fetchWeightData(params: FetchParams = {}) {
      loading.value = true
      error.value = null

      try {
        // Build query string params
        const queryParams = new URLSearchParams()
        if (params.date_gte) queryParams.append('date__gte', params.date_gte)
        if (params.date_lte) queryParams.append('date__lte', params.date_lte)
        if (params.ordering) queryParams.append('ordering', params.ordering)

        if (params.page) queryParams.append('page', params.page.toString())
        if (params.page_size) queryParams.append('page_size', params.page_size.toString())

        const queryString = queryParams.toString()

        const url = `/weight-data/` + (queryString ? `?${queryString}` : '')

        // Make authenticated request (adjust axios config as needed for auth)
        const response = await api.get<PaginationResponse>(url, { withCredentials: true })
        const data = response.data;

        weightData.value = data.results;

        totalItems.value = data.count;
        totalPages.value = data.total_pages;
        currentPage.value = data.page;
        pageSize.value = data.page_size;

      } catch (err: any) {
        error.value = err.response?.data?.detail || err.message || 'Failed to load weight data'
      } finally {
        loading.value = false
      }
    }

    async function fetchMinMaxAvgWeight(){
        error.value = null;
        loading.value = true;
        try {
            const response = await api.get<MinmaxavgType>('/minmaxavg/');
            minmaxavg.value = response.data;
            console.log(response.data)
            console.log(minmaxavg.value);
        } catch (err: any) {
            error.value = err.response?.data?.detail || err?.message || 'Failed to fetch min/max/avg weight';
        } finally {
            loading.value = false;
        }
    }
    
    return {
      weightData,
      loading,
      error,
      fetchWeightData,
      fetchMinMaxAvgWeight,
      totalItems,
      totalPages,
      currentPage,
      pageSize,
    }
});