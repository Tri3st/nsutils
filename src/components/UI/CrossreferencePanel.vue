<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIdentityStore } from '@/stores/identityStore.ts'

const props = defineProps({
  application: { type: String, required: true },
})

const store = useIdentityStore();

// ── Derived state from store ─────────────────────────────────────────────────
const result    = computed(() => store.crossReference[props.application])
const isLoading = computed(() => store.xrefLoading[props.application])
const xrefError = computed(() => store.xrefErrors[props.application])
const allLoaded = computed(() => store.allSourcesLoaded(props.application))

// ── Local UI state ────────────────────────────────────────────────────────────
const activeCategory = ref('in_all')
const xrefSearch     = ref('')

const categories = [
  { key: 'in_all',            label: 'In all 3' },
  { key: 'only_in_users',     label: 'Only in Users' },
  { key: 'only_in_mail_dist', label: 'Only in Mail Dist.' },
  { key: 'only_in_ad_group',  label: 'Only in AD Group' },
  { key: 'in_users_and_mail', label: 'Users + Mail' },
  { key: 'in_users_and_ad',   label: 'Users + AD' },
  { key: 'in_mail_and_ad',    label: 'Mail + AD' },
]

const activeRows = computed(() => result.value?.[activeCategory.value] || [])

const filteredActiveRows = computed(() => {
  const q = xrefSearch.value.toLowerCase()
  if (!q) return activeRows.value
  return activeRows.value.filter(r =>
      (r.username     || '').toLowerCase().includes(q) ||
      (r.email        || '').toLowerCase().includes(q) ||
      (r.display_name || '').toLowerCase().includes(q)
  )
})

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCsv() {
  if (!result.value) return

  const CATEGORY_LABELS = {
    in_all:            'In all 3',
    only_in_users:     'Only in Users',
    only_in_mail_dist: 'Only in Mail Dist.',
    only_in_ad_group:  'Only in AD Group',
    in_users_and_mail: 'Users + Mail',
    in_users_and_ad:   'Users + AD',
    in_mail_and_ad:    'Mail + AD',
  }

  const rows = [['username', 'display_name', 'email', 'department', 'in_users', 'in_mail_dist', 'in_ad_group', 'category']]

  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    for (const row of result.value[key] || []) {
      rows.push([
        row.username     || '',
        row.display_name || '',
        row.email        || '',
        row.department   || '',
        row.in_users     ? '1' : '0',
        row.in_mail_dist ? '1' : '0',
        row.in_ad_group  ? '1' : '0',
        label,
      ])
    }
  }

  const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `cross-reference-${props.application}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="cross-ref-panel">
    <div class="xref-toolbar">
      <button class="btn btn-primary" @click="store.runCrossReference(application)" :disabled="isLoading || !allLoaded">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        {{ isLoading ? 'Running…' : 'Run Cross-Reference' }}
      </button>

      <button v-if="result" class="btn btn-export" @click="exportCsv">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export all (CSV)
      </button>

      <span v-if="!allLoaded" class="hint">Load all 3 sources first to compare</span>
    </div>

    <div v-if="xrefError" class="alert alert-error">{{ xrefError }}</div>

    <template v-if="result">
      <!-- Summary cards -->
      <div class="xref-summary">
        <div class="summary-card card-total">
          <div class="card-value">{{ result.summary.total_unique }}</div>
          <div class="card-label">Total unique</div>
        </div>
        <div class="summary-card card-ok">
          <div class="card-value">{{ result.summary.in_all_count }}</div>
          <div class="card-label">In all 3 sources</div>
        </div>
        <div class="summary-card card-warn" :class="{ 'card-ok': result.summary.discrepancies === 0 }">
          <div class="card-value">{{ result.summary.discrepancies }}</div>
          <div class="card-label">Discrepancies</div>
        </div>
        <div class="summary-card">
          <div class="card-value">{{ result.summary.users_count }}</div>
          <div class="card-label">Users</div>
        </div>
        <div class="summary-card">
          <div class="card-value">{{ result.summary.mail_dist_count }}</div>
          <div class="card-label">Mail dist.</div>
        </div>
        <div class="summary-card">
          <div class="card-value">{{ result.summary.ad_group_count }}</div>
          <div class="card-label">AD Group</div>
        </div>
      </div>

      <!-- Category tabs -->
      <div class="xref-category-tabs">
        <button
            v-for="cat in categories"
            :key="cat.key"
            class="cat-tab"
            :class="{ active: activeCategory === cat.key }"
            @click="activeCategory = cat.key"
        >
          {{ cat.label }}
          <span class="cat-count" :class="cat.key === 'in_all' ? 'count-ok' : 'count-warn'">
            {{ result[cat.key]?.length || 0 }}
          </span>
        </button>
      </div>

      <!-- Category table -->
      <div class="xref-table-wrap">
        <div v-if="activeRows.length === 0" class="empty-state">
          <p>No entries in this category.</p>
        </div>
        <template v-else>
          <div class="table-toolbar">
            <input v-model="xrefSearch" type="text" class="search-input" placeholder="Filter…" />
            <span class="record-count">{{ filteredActiveRows.length }}</span>
          </div>
          <div class="table-scroll">
            <table class="identity-table">
              <thead>
              <tr>
                <th>Username</th>
                <th>Display Name</th>
                <th>Email</th>
                <th>Department</th>
                <th class="center">Users</th>
                <th class="center">Mail Dist.</th>
                <th class="center">AD Group</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in filteredActiveRows" :key="row.username">
                <td class="cell-username">{{ row.username }}</td>
                <td>{{ row.display_name || '—' }}</td>
                <td>{{ row.email || '—' }}</td>
                <td>{{ row.department || '—' }}</td>
                <td class="center"><span :class="row.in_users     ? 'dot dot-yes' : 'dot dot-no'"></span></td>
                <td class="center"><span :class="row.in_mail_dist ? 'dot dot-yes' : 'dot dot-no'"></span></td>
                <td class="center"><span :class="row.in_ad_group  ? 'dot dot-yes' : 'dot dot-no'"></span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </template>

    <div v-else-if="!isLoading" class="empty-state xref-empty">
      <p>Cross-reference will compare the three source lists and show where users appear or are missing.</p>
    </div>
  </div>
</template>
