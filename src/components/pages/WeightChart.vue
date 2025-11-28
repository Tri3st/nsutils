<script setup lang="ts">
import {useWeightStore} from "@/stores/weightStore.ts";
import Highcharts from "highcharts-vue";
import {storeToRefs} from "pinia";
import {computed, onMounted} from "vue";

const weightStore = useWeightStore();
const { weightData, error, loading } = storeToRefs(weightStore);

onMounted(() => {
  weightStore.fetchWeightData();
})

const weightSeries = computed(() => {
  return weightData.value.map(item =>
  {
    return [
        new Date(item.date).getTime(),
        Number(item.weight_kg)
    ];
  });
});

const chartOptions = computed(() => ({
  chart: {
    type: "line",
    height: 400,
    backgroundColor: 'transparent'
  },
  title: {
    text: "Weight over time",
    style: {color: "#222", fontSize: "20px", fontWeight: "bold"},
  },
  xAxis: {
    type: "datetime",
    title: {text: "Date"},
  },
  yAxis: {
    title: {text: "Weight (kg)"},
  },
  legend: {
    enabled: true
  },
  series: [
    {
      name: "Weight",
      data: weightSeries.value,
      lineWidth: 3,
      marker: {
        radius: 4,
        sumbol: "circle"
      }
    }
  ]
}))
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Weight Chart</h2>
    <div class="text-center my-6" v-if="loading">Loading...</div>
    <div class="text-red-600" v-if="error">{{ error }}</div>
    <Highcharts
      v-if="!loading && weightData.length"
      :options="chartOptions"
      class="rounded-xl shadow bg-white p-4"
    />
  </div>
</template>

<style scoped>

</style>