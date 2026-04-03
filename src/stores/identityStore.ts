import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../lib/identitycheckerApi.ts'
import { AxiosError } from 'axios';

const APPLICATIONS = ['iprotect', 'iwork', 'ocms']
const SOURCES = ['users', 'mail_dist_list', 'ad_group']

/**
 * Build the initial nested state shape:
 * { iprotect: { users: <val>, mail_dist_list: <val>, ad_group: <val> }, ... }
 */
function perAppSource(defaultValue: any) {
    return Object.fromEntries(
        APPLICATIONS.map(app => [
            app,
            Object.fromEntries(SOURCES.map(src => [src, defaultValue()])),
        ])
    )
}

/** Build per-app state shape: { iprotect: <val>, iwork: <val>, ocms: <val> } */
function perApp(defaultValue: any) {
    return Object.fromEntries(APPLICATIONS.map(app => [app, defaultValue()]))
}

export const useIdentityStore = defineStore('identityChecker', () => {
    // ─── State ────────────────────────────────────────────────────────────────

    /** identities[app][source] = Identity[] */
    const identities = ref(perAppSource(() => []))

    /** uploadMeta[app][source] = { filename, count } | null */
    const uploadMeta = ref(perAppSource(() => null))

    /** uploading[app][source] = boolean */
    const uploading = ref(perAppSource(() => false))

    /** uploadProgress[app][source] = 0–100 */
    const uploadProgress = ref(perAppSource(() => 0))

    /** clearing[app][source] = boolean */
    const clearing = ref(perAppSource(() => false))

    /** errors[app][source] = string | null */
    const errors = ref(perAppSource(() => null))

    /** crossReference[app] = result object | null */
    const crossReference = ref(perApp(() => null))

    /** xrefLoading[app] = boolean */
    const xrefLoading = ref(perApp(() => false))

    /** xrefErrors[app] = string | null */
    const xrefErrors = ref(perApp(() => null))

    /** uploadLogs[app] = UploadLog[] */
    const uploadLogs = ref(perApp(() => []))

    /** logsLoading[app] = boolean */
    const logsLoading = ref(perApp(() => false))

    // ─── Getters ──────────────────────────────────────────────────────────────

    /** Number of records loaded for a given app+source */
    function countFor(app: string, source: string): number {
        return identities.value[app][source].length
    }

    /** True when all 3 sources for an app have at least 1 record */
    function allSourcesLoaded(app: string): boolean {
        return SOURCES.every(src => identities.value[app][src].length > 0)
    }

    /**
     * Flat status map: { iprotect: { users: 42, mail_dist_list: 0, ... }, ... }
     * Useful for the app-tab status dots.
     */
    const statusMap = computed(() =>
        Object.fromEntries(
            APPLICATIONS.map(app => [
                app,
                Object.fromEntries(SOURCES.map(src => [src, identities.value[app][src].length])),
            ])
        )
    )

    // ─── Actions ──────────────────────────────────────────────────────────────

    /** Hydrate record counts from the backend on app load. */
    async function fetchStatus() {
        try {
            const res = await api.getStatus()
            // The status endpoint returns counts, not rows — just update counts
            // so we know which sources have data without fetching all rows yet.
            for (const app of APPLICATIONS) {
                for (const src of SOURCES) {
                    const count = res.data[app]?.[src] ?? 0
                    // Only mark meta as "has data" — don't overwrite actual loaded rows
                    if (count > 0 && identities.value[app][src].length === 0) {
                        // We know data exists; mark upload meta so UI shows badge
                        uploadMeta.value[app][src] = uploadMeta.value[app][src] ?? { filename: '(persisted)', count }
                    }
                }
            }
        } catch {
            // Silently ignore — components will show empty state
        }
    }

    /** Load all identity rows for a given app+source from the backend. */
    async function fetchIdentities(app: string, source: string) {
        errors.value[app][source] = null
        try {
            const res = await api.getIdentities(app, source)
            identities.value[app][source] = res.data
        } catch (e) {
            const err = e as AxiosError<{ error: string}>
            errors.value[app][source] = err.response?.data?.error || 'Failed to load identities'
        }
    }

    /** Upload a file for a given app+source. Replaces existing data. */
    async function uploadFile(app: string, source: string, file: string) {
        errors.value[app][source] = null
        uploading.value[app][source] = true
        uploadProgress.value[app][source] = 0

        try {
            const res = await api.uploadFile(app, source, file, (e: any) => {
                uploadProgress.value[app][source] = Math.round((e.loaded / e.total) * 100)
            })
            uploadMeta.value[app][source] = { filename: res.data.filename, count: res.data.created }
            // Reload the actual rows
            await fetchIdentities(app, source)
            // Invalidate cross-reference result for this app since data changed
            crossReference.value[app] = null
        } catch (e: any) {
            const err = e as AxiosError<{ error: string}>
            errors.value[app][source] = err.response?.data?.error || 'Upload failed'
        } finally {
            uploading.value[app][source] = false
        }
    }

    /** Clear all identities for a given app+source. */
    async function clearIdentities(app: string, source: string) {
        errors.value[app][source] = null
        clearing.value[app][source] = true
        try {
            await api.clearIdentities(app, source)
            identities.value[app][source] = []
            uploadMeta.value[app][source] = null
            // Invalidate cross-reference
            crossReference.value[app] = null
        } catch (e) {
            errors.value[app][source] = 'Clear failed'
        } finally {
            clearing.value[app][source] = false
        }
    }

    /** Run cross-reference for an application. */
    async function runCrossReference(app: string) {
        xrefErrors.value[app] = null
        xrefLoading.value[app] = true
        try {
            const res = await api.getCrossReference(app)
            crossReference.value[app] = res.data
        } catch (e: any) {
            const err = e as AxiosError<{ error: string}>
            xrefErrors.value[app] = err.response?.data?.error || 'Cross-reference failed'
        } finally {
            xrefLoading.value[app] = false
        }
    }

    /** Fetch upload logs for an application. */
    async function fetchUploadLogs(app: string) {
        logsLoading.value[app] = true
        try {
            const res = await api.getUploadLogs(app)
            uploadLogs.value[app] = res.data
        } catch {
            // Silently ignore
        } finally {
            logsLoading.value[app] = false
        }
    }

    return {
        // State
        identities,
        uploadMeta,
        uploading,
        uploadProgress,
        clearing,
        errors,
        crossReference,
        xrefLoading,
        xrefErrors,
        uploadLogs,
        logsLoading,
        // Getters
        statusMap,
        countFor,
        allSourcesLoaded,
        // Actions
        fetchStatus,
        fetchIdentities,
        uploadFile,
        clearIdentities,
        runCrossReference,
        fetchUploadLogs,
    }
})