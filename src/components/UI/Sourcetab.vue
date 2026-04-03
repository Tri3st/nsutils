<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useIdentityStore } from '@/stores/identityStore.ts'
import SortIcon from '@/components/UI/Sorticon.vue'

const props = defineProps({
  application: { type: String, required: true },
  source:      { type: String, required: true },
  sourceLabel: { type: String, required: true },
})

const store = useIdentityStore()

// ── Derived state from store ─────────────────────────────────────────────────
const identities  = computed(() => store.identities[props.application][props.source])
const meta        = computed(() => store.uploadMeta[props.application][props.source])
const isUploading = computed(() => store.uploading[props.application][props.source])
const isClearing  = computed(() => store.clearing[props.application][props.source])
const progress    = computed(() => store.uploadProgress[props.application][props.source])
const error       = computed(() => store.errors[props.application][props.source])

// ── Local UI state ────────────────────────────────────────────────────────────
const isDragging = ref(false)
const search     = ref('')
const sortField  = ref('username')
const sortDir    = ref('asc')
const page       = ref(1)
const PAGE_SIZE  = 50

// ── File handling ─────────────────────────────────────────────────────────────
function handleFile(event: Event) {
  const file = event.target?.files[0]
  event.target!.value = ''
  if (file) store.uploadFile(props.application, props.source, file)
}

function handleDrop(event: Event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file) return
  if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
    store.errors[props.application][props.source] = 'Only .csv and .xlsx files are supported'
    return
  }
  store.uploadFile(props.application, props.source, file)
}

// ── Table: sort, filter, paginate ─────────────────────────────────────────────
function sort(field: string) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
  page.value = 1
}

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  let rows = identities.value
  if (q) {
    rows = rows.filter(r =>
        (r.username     || '').toLowerCase().includes(q) ||
        (r.email        || '').toLowerCase().includes(q) ||
        (r.display_name || '').toLowerCase().includes(q) ||
        (r.department   || '').toLowerCase().includes(q)
    )
  }
  return [...rows].sort((a, b) => {
    const va = (a[sortField.value] || '').toLowerCase()
    const vb = (b[sortField.value] || '').toLowerCase()
    return sortDir.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paginated  = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

watch(search, () => { page.value = 1 })

// Load on mount if store doesn't have data yet
onMounted(() => {
  if (identities.value.length === 0) {
    store.fetchIdentities(props.application, props.source)
  }
})
</script>

<template>
  <div class="source-tab">
    <!-- Upload area -->
    <div
        class="upload-area"
        :class="{ 'has-data': identities.length > 0, 'drag-over': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
    >
      <div class="upload-header">
        <div class="upload-meta" v-if="meta">
          <span class="badge badge-success">{{ identities.length }} records loaded</span>
          <span class="upload-filename">{{ meta.filename }}</span>
        </div>
        <div class="upload-meta" v-else>
          <span class="badge badge-empty">No data</span>
          <span class="drag-hint">or drag &amp; drop a file here</span>
        </div>

        <div class="upload-actions">
          <label class="btn btn-upload" :class="{ loading: isUploading }">
            <svg v-if="!isUploading" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span v-if="isUploading">Uploading… {{ progress }}%</span>
            <span v-else>Upload {{ sourceLabel }}</span>
            <input type="file" accept=".csv,.xlsx,.xls" @change="handleFile" :disabled="isUploading" />
          </label>

          <button v-if="identities.length > 0" class="btn btn-clear" @click="store.clearIdentities(application, source)" :disabled="isClearing">
            {{ isClearing ? 'Clearing…' : 'Clear' }}
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="isUploading" class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- Error -->
      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <!-- Drag overlay -->
      <div v-if="isDragging" class="drag-overlay">
        <span>Drop to upload</span>
      </div>
    </div>

    <!-- Identity table -->
    <div v-if="identities.length > 0" class="identity-table-wrap">
      <div class="table-toolbar">
        <input v-model="search" type="text" class="search-input" placeholder="Filter by username, email, name…" />
        <span class="record-count">{{ filtered.length }} / {{ identities.length }}</span>
      </div>

      <div class="table-scroll">
        <table class="identity-table">
          <thead>
          <tr>
            <th @click="sort('username')" class="sortable">
              Username <SortIcon field="username" :current="sortField" :dir="sortDir" />
            </th>
            <th @click="sort('display_name')" class="sortable">
              Display Name <SortIcon field="display_name" :current="sortField" :dir="sortDir" />
            </th>
            <th @click="sort('email')" class="sortable">
              Email <SortIcon field="email" :current="sortField" :dir="sortDir" />
            </th>
            <th @click="sort('department')" class="sortable">
              Department <SortIcon field="department" :current="sortField" :dir="sortDir" />
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in paginated" :key="row.id">
            <td class="cell-username">{{ row.username }}</td>
            <td>{{ row.display_name || '—' }}</td>
            <td>{{ row.email || '—' }}</td>
            <td>{{ row.department || '—' }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="page = 1" :disabled="page === 1">«</button>
        <button @click="page--" :disabled="page === 1">‹</button>
        <span>Page {{ page }} / {{ totalPages }}</span>
        <button @click="page++" :disabled="page === totalPages">›</button>
        <button @click="page = totalPages" :disabled="page === totalPages">»</button>
      </div>
    </div>

    <div v-else-if="!isUploading" class="empty-state">
      <p>Upload a <strong>.csv</strong> or <strong>.xlsx</strong> file to load {{ sourceLabel }} data.</p>
      <p class="hint">Expected columns: username, email, display_name, department (flexible naming accepted)</p>
    </div>
  </div>
</template>

