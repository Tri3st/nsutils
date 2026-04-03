<template>
  <span class="sort-icon">
    <span :class="{ active: current === field && dir === 'asc' }">▲</span>
    <span :class="{ active: current === field && dir === 'desc' }">▼</span>
  </span>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  field: String,
  current: String,
  dir: String,
})
</script>

<style scoped>
.sort-icon {
  display: inline-flex;
  flex-direction: column;
  font-size: 0.55rem;
  line-height: 1;
  margin-left: 4px;
  opacity: 0.3;
  vertical-align: middle;
}
.sort-icon span.active {
  opacity: 1;
  color: var(--accent);
}
</style>