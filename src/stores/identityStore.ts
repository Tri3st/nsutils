import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../lib/identitycheckerApi.ts'
import {
    APPLICATIONS,
    SOURCES,
    type Application,
    type Source,
    type Identity,
    type UploadLog,
    type UploadMeta,
    type CrossReferenceResult,
    type StatusMap,
    type PerApp,
    type PerAppSource
} from '@/types/identityChecker.ts'

/**
 * Build the initial nested state shape:
 * { iprotect: { users: <val>, mail_dist_list: <val>, ad_group: <val> }, ... }
 */
function perAppSource<T>(defaultValue: () => T): PerAppSource<T> {
    return Object.fromEntries(
        APPLICATIONS.map(app => [
            app,
            Object.fromEntries(SOURCES.map(src => [src, defaultValue()])),
        ])
    ) as PerAppSource<T>
}

/** Build per-app state shape: { iprotect: <val>, iwork: <val>, ocms: <val> } */
function perApp<T>(defaultValue: () => T): PerApp<T> {
    return Object.fromEntries(
        APPLICATIONS.map(app => [app, defaultValue()])
    ) as PerApp<T>
}

export const useIdentityStore = defineStore('identityChecker', () => {
    // ─── State ────────────────────────────────────────────────────────────────

    /** identities[app][source] = Identity[] */
    const identities = ref<PerAppSource<Identity[]>>(perAppSource(() => []))

    /** uploadMeta[app][source] = { filename, count } | null */
    const uploadMeta = ref<PerAppSource<UploadMeta | null>>(perAppSource(() => null))

    /** uploading[app][source] = boolean */
    const uploading = ref<PerAppSource<boolean>>(perAppSource(() => false))

    /** uploadProgress[app][source] = 0–100 */
    const uploadProgress = ref<PerAppSource<number>>(perAppSource(() => 0))

    /** clearing[app][source] = boolean */
    const clearing = ref<PerAppSource<boolean>>(perAppSource(() => false))

    /** errors[app][source] = string | null */
    const errors = ref<PerAppSource<string | null>>(perAppSource(() => null))

    /** crossReference[app] = result object | null */
    const crossReference = ref<PerApp<CrossReferenceResult | null>>(perApp(() => null))

    /** xrefLoading[app] = boolean */
    const xrefLoading = ref<PerApp<boolean>>(perApp(() => false))

    /** xrefErrors[app] = string | null */
    const xrefErrors = ref<PerApp<string | null>>(perApp(() => null))

    /** uploadLogs[app] = UploadLog[] */
    const uploadLogs = ref<PerApp<UploadLog[]>>(perApp(() => []))

    /** logsLoading[app] = boolean */
    const logsLoading = ref<PerApp<boolean>>(perApp(() => false))

    // ─── Getters ──────────────────────────────────────────────────────────────

    /** Number of records loaded for a given app+source */
    function countFor(app: string, source: string): number {
        return identities.value[app][source].length
    }

    /**
     * Flat status map: { iprotect: { users: 42, mail_dist_list: 0, ... }, ... }
     * Useful for the app-tab status dots.
     */
    const statusMap = computed<StatusMap>(() =>
        Object.fromEntries(
            APPLICATIONS.map(app => [
                app,
                Object.fromEntries(SOURCES.map(src => [src, identities.value[app][src].length])
            )]),
        ) as StatusMap,
    )

    /** True when all 3 sources for an app have at least 1 record loaded  */
    function allSourcesLoaded(app: Application): boolean {
        return SOURCES.every(src => identities.value[app][src].length > 0)
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    /** Hydrate record counts from the backend on app load. */
    async function fetchStatus(): Promise<void> {
        try {
            const res = await api.getStatus()
            // The status endpoint returns counts, not rows — just update counts
            // so we know which sources have data without fetching all rows yet.
            for (const app of APPLICATIONS) {
                for (const src of SOURCES) {
                    const count: number = res.data[app]?.[src] ?? 0
                    // Only mark meta as "has data" — don't overwrite actual loaded rows
                    if (count > 0 && identities.value[app][src].length === 0) {
                        // We know data exists; mark upload meta so UI shows badge
                        uploadMeta.value[app][src] ??= { filename: '(persisted)', count }
                    }
                }
            }
        } catch {
            // Silently ignore — components will show empty state
        }
    }

    /** Load all identity rows for a given app+source from the backend. */
    async function fetchIdentities(app: Application, source: Source): Promise<void> {
        errors.value[app][source] = null
        try {
            const res = await api.getIdentities(app, source)
            identities.value[app][source] = res.data
        } catch (e: unknown) {
            errors.value[app][source] = extractError(e, 'Failed to load identities')
        }
    }

    /** Upload a file for a given app+source. Replaces existing data. */
    async function uploadFile(app: Application, source: Source, file: File): Promise<void> {
        errors.value[app][source] = null
        uploading.value[app][source] = true
        uploadProgress.value[app][source] = 0

        try {
            const res = await api.uploadFile(app, source, file, (event) => {
                if (event.total) {
                    uploadProgress.value[app][source] = Math.round((event.loaded / event.total) * 100)
                }
            })
            uploadMeta.value[app][source] = { filename: res.data.filename, count: res.data.created }
            // Reload the actual rows
            await fetchIdentities(app, source)
            // Invalidate cross-reference result for this app since data changed
            crossReference.value[app] = null
        } catch (e: unknown) {
            errors.value[app][source] = extractError(e, 'Upload failed')
        } finally {
            uploading.value[app][source] = false
        }
    }

    /** Clear all identities for a given app+source. */
    async function clearIdentities(app: Application, source: Source): Promise<void> {
        errors.value[app][source] = null
        clearing.value[app][source] = true
        try {
            await api.clearIdentities(app, source)
            identities.value[app][source] = []
            uploadMeta.value[app][source] = null
            // Invalidate cross-reference
            crossReference.value[app] = null
        } catch (e: unknown) {
            errors.value[app][source] = extractError(e, 'Clear failed')
        } finally {
            clearing.value[app][source] = false
        }
    }

    /** Run cross-reference for an application. */
    async function runCrossReference(app: Application): Promise<void> {
        xrefErrors.value[app] = null
        xrefLoading.value[app] = true
        try {
            const res = await api.getCrossReference(app)
            crossReference.value[app] = res.data
        } catch (e: unknown) {
            xrefErrors.value[app] = extractError(e, 'Cross-reference failed')
        } finally {
            xrefLoading.value[app] = false
        }
    }

    /** Fetch upload logs for an application. */
    async function fetchUploadLogs(app: Application) {
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

// --- Helpers --------------------------------------------------------------------------------

function extractError(e: unknown, fallback: string): string {
    if (
        e && 
        typeof e === 'object' &&
        'response' in e && 
        e.response &&
        typeof e.response === 'object' &&
        'data' in e.response &&
        e.response.data &&
        typeof e.response.data === 'object' &&
        'error' in e.response.data &&
        typeof (e.response.data as Record<string, unknown>).error === 'string'
    ) {
        return (e.response.data as { error: string }).error
    }
    return fallback
}