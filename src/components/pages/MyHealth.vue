<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import type { WeightData } from '@/types/weight';
import { useWeightStore } from '@/stores/weightStore';

const viewMode = ref<'table' | 'chart'>('table');
const weightData = ref<Array<WeightData>>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const chartType = ref<'line' | 'column' | 'area'>('line');

const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const totalItems = ref<number>(0);

const weightStore = useWeightStore();

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
        dataIndex: 'weightKg',
        key: 'weightKg',
        sorter: true,
    },
    {
        title: 'Bone Mass (%)',
        dataIndex: 'boneMass',
        key: 'boneMass',
    },
    {
        title: 'Muscle Mass (%)',
        dataIndex: 'muscleMass',
        key: 'muscleMass',
    },
    {
        title: 'Body Fat (%)',
        dataIndex: 'bodyFat',
        key: 'bodyFat',
    },
    {
        title: 'Body Water (%)',
        dataIndex: 'bodyWater',
        key: 'bodyWater',
    },
    {
        title: 'BMI',
        dataIndex: 'bmi',
        key: 'bmi',
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user' 
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

// Get data from store and api

// Chart options reactive
const chartOptions = ref<Highcharts.Options>({
    title: { text: 'Weight Measurement Over Time'},
    chart: {
        type: chartType.value,
        zoomType: 'x',
        backgroundColor: 'transparent',
    },
    xAxis: {
        type: 'datetime',
        title: { text: 'Date' }
    },
    yAxis: {
        title: { text: 'Weight (kg)' },
        min: 0,
    },
    tooltip: {
        shared: true,
        xDateFormat: '%A, %b %e, %Y %H:%M',
        valueSuffix: ' kg',
    },
    series: [
        {
            name: 'Weight (kg)',
            data: weightData.value.map((item: WeightData) => [new Date(item.date).getTime(), item.weightKg]),
            type: chartType.value,
            marker: {
                enabled: true,
                radius: 3
            },
            lineWidth: 2,
        },
    ],
    credits: { enabled: false },
    legend: { enabled: true },
});

const seriesData = computed(() => {
    defineProps.weightData
        .map((item: WeightData) => {
            return [new Date(item.date).getTime(), item.weightKg]
            .sort((a: any, b: any) => a[0] - b[0])
    })
});

// Reference for the Highcharts component instance (optional)
const highchartsRef = ref<InstanceType<typeof HighchartsVue> | null>(null);

// Watch for chart type changes to update chart options
watch(chartType, (newType: 'line' | 'column' | 'area') => {
    chartOptions.value.chart!.type = newType;
    if (chartOptions.value.series && chartOptions.value.series[0]) {
        chartOptions.value.series[0].type = newType;
    }
});

// Watch for data changes and update points
watch(seriesData, (newData: Array<[number, number]>) => {
    if(chartOptions.value.series && chartOptions.value.series[0]) {
        chartOptions.value.series[0].data = newData;
    }
});

onMounted(() => {
    // get weight data from store or api
    // populate weightData, totalItems, loading, error accordingly
    weightData.value = weightStore.weightData;
    loading.value = weightStore.loading;
    error.value = weightStore.error;
});

</script>

<template>
<h1>My Health placeholder</h1>

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
    
    <highcharts :options="chartoptions" v-if="viewMode === 'chart'" ref="highchartsRef"/>  
</div>
</template>

<style scoped>

</style>