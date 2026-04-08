<template>
  <div class="upload-log-panel">
    <div class="log-toolbar">
      <h3>Upload History</h3>
      <button class="btn btn-ghost" :disabled="isLoading" @click="store.fetchUploadLogs(application)">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="isLoading" class="log-loading">Loading…</div>

    <div v-else-if="logs.length === 0" class="empty-state">
      <p>No uploads yet for this application.</p>
    </div>

    <table v-else class="identity-table log-table">
      <thead>
        <tr>
          <th>Source</th>
          <th>File</th>
          <th>Records</th>
          <th>Status</th>
          <th>Uploaded</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="log in logs"
          :key="log.id"
          :class="{ 'row-error': log.status === 'error' }"
        >
          <td>
            <span class="source-badge" :class="`src-${log.source}`">
              {{ SOURCE_LABELS[log.source] }}
            </span>
          </td>
          <td class="cell-username">{{ log.filename }}</td>
          <td>{{ log.row_count }}</td>
          <td>
            <span
              class="status-badge"
              :class="log.status === 'success' ? 'badge-success' : 'badge-error-inline'"
            >
              {{ log.status }}
            </span>
          </td>
          <td class="cell-date">{{ formatDate(log.uploaded_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useIdentityStore } from '../../stores/useIdentityStore'
import type { Application, Source } from '../../types/identityChecker'

const props = defineProps<{
  application: Application
}>()

const store = useIdentityStore()

const logs      = computed(() => store.uploadLogs[props.application])
const isLoading = computed(() => store.logsLoading[props.application])

const SOURCE_LABELS: Record<Source, string> = {
  users:          'Users',
  mail_dist_list: 'Mail Dist.',
  ad_group:       'AD Group',
}

function formatDate(dt: string): string {
  return new Date(dt).toLocaleString('nl-NL', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => store.fetchUploadLogs(props.application))
</script>