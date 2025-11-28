<script setup lang="ts">
// Chart options reactive
import {computed, ref, watch} from "vue";
import {WeightData} from "@/types/weight.ts";
import HighchartsVue from 'highcharts-vue';

const props = defineProps<{
  weightData: Array<WeightData>
}>();
const chartType = ref<'line' | 'column' | 'area'>('line');

const chartOptions = ref<Highcharts.Options>({
  title: { text: 'Weight Measurement Over Time'},
  chart: {
    type: chartType.value,
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
  props.weightData
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
</script>

<template>
  <highcharts :options="chartoptions" v-if="viewMode === 'chart'" ref="highchartsRef"/>
</template>

<style scoped>

</style>