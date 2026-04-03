<script setup>
import { ref, reactive, onMounted } from 'vue'
import SourceTab from '@/components/UI/Sourcetab.vue'
import CrossReferencePanel from '@/components/UI/CrossreferencePanel.vue'
import {useIdentityStore} from "@/stores/identityStore.ts";

const applications = [
  { key: 'iprotect', label: 'iProtect' },
  { key: 'iwork',    label: 'iWork' },
  { key: 'ocms',     label: 'OCMS' },
]

const sources = [
  { key: 'users',         label: 'Users' },
  { key: 'mail_dist_list', label: 'Mail Dist. List' },
  { key: 'ad_group',      label: 'AD Group' },
]

const identityStore = useIdentityStore();

const activeApp = ref('iprotect')

// Per-app active source tab
const activeSource = reactive({
  iprotect: 'users',
  iwork:    'users',
  ocms:     'users',
})

// Track record counts: loadStatus[app][source] = count
const loadStatus = reactive({
  iprotect: { users: 0, mail_dist_list: 0, ad_group: 0 },
  iwork:    { users: 0, mail_dist_list: 0, ad_group: 0 },
  ocms:     { users: 0, mail_dist_list: 0, ad_group: 0 },
})

function onLoaded(app, source, { count }) {
  loadStatus[app][source] = count
}

function allLoaded(app) {
  return sources.every(s => loadStatus[app][s.key] > 0)
}

// Hydrate counts from backend on mount
async function fetchStatus() {
  try {
    const res = await identityApi.getStatus()
    const data = res.data
    for (const app of applications) {
      for (const src of sources) {
        if (data[app.key]?.[src.key] !== undefined) {
          loadStatus[app.key][src.key] = data[app.key][src.key]
        }
      }
    }
  } catch (e) {
    // silently ignore — tabs will show 0
  }
}

onMounted(fetchStatus)
</script>

<template>
  <div class="identity-checker">
    <div class="page-header">
      <h1>Identity Checker</h1>
      <p class="subtitle">Load and cross-reference user identities across applications</p>
    </div>

    <!-- Application tabs -->
    <div class="app-tabs">
      <button
          v-for="app in applications"
          :key="app.key"
          class="app-tab"
          :class="{ active: activeApp === app.key }"
          @click="activeApp = app.key"
      >
        <span class="app-tab-label">{{ app.label }}</span>
        <span class="app-tab-status">
          <span
              v-for="src in sources"
              :key="src.key"
              class="status-dot"
              :class="loadStatus[app.key]?.[src.key] > 0 ? 'loaded' : 'empty'"
              :title="`${src.label}: ${loadStatus[app.key]?.[src.key] || 0} records`"
          ></span>
        </span>
      </button>
    </div>

    <!-- Per-application panel -->
    <div v-for="app in applications" :key="app.key" v-show="activeApp === app.key" class="app-panel">

      <!-- Source tabs + Cross-ref tab -->
      <div class="source-tabs">
        <button
            v-for="src in sources"
            :key="src.key"
            class="source-tab-btn"
            :class="{ active: activeSource[app.key] === src.key }"
            @click="activeSource[app.key] = src.key"
        >
          {{ src.label }}
          <span v-if="loadStatus[app.key]?.[src.key] > 0" class="src-count">
            {{ loadStatus[app.key][src.key] }}
          </span>
        </button>

        <button
            class="source-tab-btn tab-xref"
            :class="{ active: activeSource[app.key] === 'xref' }"
            @click="activeSource[app.key] = 'xref'"
        >
          ⚡ Cross-Reference
          <span v-if="allLoaded(app.key)" class="src-count count-ready">Ready</span>
        </button>
      </div>

      <!-- Source content panes -->
      <div class="source-content">
        <template v-for="src in sources" :key="src.key">
          <div v-show="activeSource[app.key] === src.key">
            <SourceTab
                :application="app.key"
                :source="src.key"
                :source-label="src.label"
                @loaded="onLoaded(app.key, src.key, $event)"
            />
          </div>
        </template>

        <!-- Cross-reference pane -->
        <div v-show="activeSource[app.key] === 'xref'">
          <CrossReferencePanel
              :application="app.key"
              :all-loaded="allLoaded(app.key)"
          />
        </div>
      </div>

    </div>
  </div>
</template>



<style scoped></style>