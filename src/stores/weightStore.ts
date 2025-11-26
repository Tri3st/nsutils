import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api';
import type { WeightData, WeightMeasurement, WeightState, FetchParams } from '@/types/weight';

export const useWeightStore = defineStore('weightStore', () => {
    
    // State
    const weightData = ref<Array<WeightMeasurement>>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

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

        const queryString = queryParams.toString()

        const url = `/api/weight_data/` + (queryString ? `?${queryString}` : '')

        // Make authenticated request (adjust axios config as needed for auth)
        const response = await api.get<WeightMeasurement[]>(url, { withCredentials: true })

        weightData.value = response.data
      } catch (err: any) {
        error.value = err.response?.data?.detail || err.message || 'Failed to load weight data'
      } finally {
        loading.value = false
      }
    }
    
    return {
      weightData,
      loading,
      error,
      fetchWeightData,
    }
});