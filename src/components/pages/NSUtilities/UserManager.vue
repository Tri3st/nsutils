<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import SourceTab from '@/components/UI/Sourcetab.vue'
import CrossReferencePanel from '@/components/UI/CrossreferencePanel.vue'
import UploadLogPanel from '@/components/NSUtilities/UploadLogPanel.vue'
import {useIdentityStore} from "@/stores/identityStore.ts";
import type {
  Application,
  Source
} from '@/types/identityChecker.ts'


interface AppTab {
  key: Application;
  label: string;
}

interface SourceTab {
  key: Source;
  label: string;
}

type ActiveSourceTab = Source | 'xref' | 'logs'

const APPLICATIONS: AppTab[] = [
  { key: 'iprotect', label: 'iProtect' },
  { key: 'iwork',    label: 'iWork' },
  { key: 'ocms',     label: 'OCMS' },
]

const SOURCES: SourceTab[] = [
  { key: 'users',         label: 'Users' },
  { key: 'mail_dist_list', label: 'Mail Dist. List' },
  { key: 'ad_group',      label: 'AD Group' },
]

const identityStore = useIdentityStore();

const activeApp = ref<Application>('iprotect')

// Per-app active source tab
const activeSource = reactive<Record<Application, ActiveSourceTab>>({
  iprotect: 'users',
  iwork:    'users',
  ocms:     'users',
})

onMounted(() => useIdentityStore.fetchStatus());
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
          v-for="app in APPLICATIONS"
          :key="app.key"
          class="app-tab"
          :class="{ active: activeApp === app.key }"
          @click="activeApp = app.key"
      >
        <span class="app-tab-label">{{ app.label }}</span>
        <span class="app-tab-status">
          <span
              v-for="src in SOURCES"
              :key="src.key"
              class="status-dot"
              :class="store.statusMap[app.key]?.[src.key] > 0 ? 'loaded' : 'empty'"
              :title="`${src.label}: ${store.statusMap[app.key]?.[src.key] || 0} records`"
          ></span>
        </span>
      </button>
    </div>

    <!-- Per-application panel -->
    <div 
      v-for="app in APPLICATIONS" 
      :key="app.key"
      v-show="activeApp === app.key" 
      class="app-panel"
      >

      <!-- Source tabs + Cross-ref tab -->
      <div class="source-tabs">
        <button
            v-for="src in SOURCES"
            :key="src.key"
            class="source-tab-btn"
            :class="{ active: activeSource[app.key] === src.key }"
            @click="activeSource[app.key] = src.key"
        >
          {{ src.label }}
          <span v-if="identityStore.statusMap[app.key]?.[src.key] > 0" class="src-count">
            {{ identityStore.statusMap[app.key][src.key] }}
          </span>
        </button>

        <button
            class="source-tab-btn tab-xref"
            :class="{ active: activeSource[app.key] === 'xref' }"
            @click="activeSource[app.key] = 'xref'"
        >
          ⚡ Cross-Reference
          <span v-if="identityStore.allLoaded(app.key)" class="src-count count-ready">Ready</span>
        </button>

        <button
          class="source-tab-btn tab-logs"
          :class="{ active: activeSource[app.key] === 'logs' }"
          @click="activeSource[app.key] = 'logs'"
        >
          📋 Upload History
        </button>
      </div>

      <!-- Source content panes -->
      <div class="source-content">
        <template v-for="src in SOURCES" :key="src.key">
          <div v-show="activeSource[app.key] === src.key">
            <SourceTab
                :application="app.key"
                :source="src.key"
                :source-label="src.label"
            />
          </div>
        </template>

        <!-- Cross-reference pane -->
        <div v-show="activeSource[app.key] === 'xref'">
          <CrossReferencePanel
              :application="app.key"
          />
        </div>

        <!-- Logs pane -->
        <div v-show="activeSource[app.key] === 'logs'">
          <UploadLogPanel
              :application="app.key"
          />
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped></style>