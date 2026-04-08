/**
 * Internal HTTP layer — only used by useIdentityStore.
 * Components should never import this directly.
 */
import axios, { type AxiosProgressEvent } from 'axios'
import type {
    Identity,
    UploadLog,
    UploadResponse,
    CrossReferenceResult,
    StatusMap,
    Application,
    Source
} from '@/types/identityChecker.ts'

const BASE = '/api/identity-checker'

export const api = {
    getStatus(): Promise<{ status: StatusMap }> {
        return axios.get<StatusMap>(`${BASE}/status/`)
    },

    getIdentities(application: Application, source: Source): Promise<{ data: Identity[] }> {
        return axios.get<Identity[]>(`${BASE}/identities/`, { 
            params: { application, source } 
        })
    },

    clearIdentities(application: Application, source: Source): Promise<{ data: { deleted: number }}> {
        return axios.delete<{ deleted: number }>(`${BASE}/identities/`, { params: { application, source } })
    },

    uploadFile(
        application: Application, 
        source: Source, 
        file: File, 
        onProgress?: (event: AxiosProgressEvent) => void,
    ): Promise<{ data: UploadResponse}> {
        const form = new FormData()
        form.append('application', application)
        form.append('source', source)
        form.append('file', file)

        return axios.post<UploadResponse>(`${BASE}/upload/`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: onProgress,
        })
    },

    getCrossReference(application: Application): Promise<{ data: CrossReferenceResult }> {
        return axios.get<CrossReferenceResult>(`${BASE}/cross-reference/`, { 
            params: { application } 
        })
    },

    getUploadLogs(application: Application): Promise<{ data: UploadLog[] }> {
        return axios.get<UploadLog[]>(`${BASE}/upload-logs/`, { 
            params: { application } 
        })
    },
}