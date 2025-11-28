<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import type { WeightData } from '@/types/weight';
import { useWeightStore } from '@/stores/weightStore';
import {storeToRefs} from "pinia";

const viewMode = ref<'table' | 'chart'>('table');

const weightStore = useWeightStore();
const {
  weightData,
  loading,
  error,
  totalItems,
  totalPages,
  currentPage,
  pageSize
} = storeToRefs(weightStore)

// Table columns config
const columns: Array<{ 
    title: string; 
    dataIndex: keyof WeightData; 
    key: string; 
    sorter?: boolean 
}> = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
    },
    {
        title: 'Weight (kg)',
        dataIndex: 'weight_kg',
        key: 'weight_kg',
        sorter: true,
    },
    {
        title: 'Bone Mass (%)',
        dataIndex: 'bone_mass',
        key: 'bone_mass',
    },
    {
        title: 'Muscle Mass (%)',
        dataIndex: 'muscle_mass',
        key: 'muscle_mass',
    },
    {
        title: 'Body Fat (%)',
        dataIndex: 'body_fat',
        key: 'body_fat',
    },
    {
        title: 'Body Water (%)',
        dataIndex: 'body_water',
        key: 'body_water',
    },
    {
        title: 'BMI',
        dataIndex: 'bmi',
        key: 'bmi',
    }
];

// Table pagination config
const tablePagination = ref<{
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
}>({
    current: currentPage.value,
    pageSize: pageSize.value,
    total: totalItems.value,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
});

watch([currentPage, pageSize, totalItems], () => {
  tablePagination.value = {
    ...tablePagination.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    total: totalItems.value
  };
});

async function handleTableChange(pagination: any, filters: any, sorter: any) {
  const ordering =
      sorter.order === 'ascend'
          ? sorter.field
          : sorter.order === 'descend'
              ? `-${sorter.field}`
              : undefined;
  await weightStore.fetchWeightData({
      ordering,
      page: pagination.current,
      page_size: pagination.pageSize,
  });
}

onMounted(() => {
    // get weight data from store or api
    // populate weightData, totalItems, loading, error accordingly
    weightStore.fetchWeightData({ page: 1 });
});

</script>

<template>
<h1>My Health</h1>

<div>
    <a-radio-group v-model:value="viewMode" class="mb-4">
        <a-radio-button value="table">Table View</a-radio-button>
        <a-radio-button value="chart">Chart View</a-radio-button>
    </a-radio-group>
    <div class="text-center my-6" v-if="loading">Loading data...</div>
    <div class="text-red-600" v-if="error">{{ error  }}</div>

    <a-table
        v-if="viewMode === 'table'"
        :columns="columns"
        :data-source="weightData"
        :pagination="tablePagination"
        @change="handleTableChange"
        row-key="date"
        :loading="loading"
        bordered
    />

    <div class="mt-6">
      <a-card title="Statistics" bordered class="bg-white shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap4 text-center">
          <!-- Weight -->
          <div class="p-4 border rounded bg-gray-50">
            <div class="text-gray-500">
              Average Weight
            </div>
            <div class="text-xl font-semibold text-blue-600">
              {{ (weightData.reduce((acc, item) => acc + item.weight_kg, 0) / weightData.length).toFixed(1) }} kg
            </div>
          </div>
          <div class="p-4 border rounded bg-gray-50">
            <div class="text-gray-500">
              Max Weight
            </div>
            <div class="text-xl font-semibold text-green-600">
              {{ weightData.reduce((acc, item) => Math.max(acc, item.weight_kg), 0) }} kg
            </div>
          </div>
          <div class="p-4 border rounded bg-gray-50">
            <div class="text-gray-500">
              Min Weight
            </div>
            <div class="text-xl font-semibold text-red-600">
              {{ weightData.reduce((acc, item) => Math.min(acc, item.weight_kg), Infinity) }} kg
            </div>
          </div>

          <!-- BMI -->
          <div class="p-4 border rounded bg-gray-50">
            <div class="text-gray-500">Average BMI</div>
            <div class="text-xl font-semibold text-blue-600">
              {{ (weightData.reduce((acc, item) => acc + item.bmi, 0) / weightData.length).toFixed(1) }} kg
            </div>
          </div>
          <div class="p-4 border rounded bg-gray-50">
            <div class="text-gray-500">Max BMI</div>
            <div class="text-xl font-semibold text-green-600">
              {{ weightData.reduce((acc, item) => Math.max(acc, item.bmi), 0) }} kg
            </div>
          </div>
          <div class="p-4 border rounded bg-gray-50">
            <div class="text-gray-500">Min BMI</div>
            <div class="text-xl font-semibold text-red-600">
              {{ weightData.reduce((acc, item) => Math.min(acc, item.bmi), Infinity).toFixed(1) }} kg
            </div>
          </div>
        </div>
      </a-card>
    </div>
</div>
</template>

<style scoped>

</style>