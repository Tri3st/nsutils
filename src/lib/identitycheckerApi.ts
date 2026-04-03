/**
 * Internal HTTP layer — only used by useIdentityStore.
 * Components should never import this directly.
 */
import axios from 'axios'

const BASE = '/api/identity-checker'

export const api = {
    getStatus() {
        return axios.get(`${BASE}/status/`)
    },

    getIdentities(application: string, source: string) {
        return axios.get(`${BASE}/identities/`, { params: { application, source } })
    },

    clearIdentities(application: string, source: string) {
        return axios.delete(`${BASE}/identities/`, { params: { application, source } })
    },

    uploadFile(application: string, source: string, file: string, onProgress: any) {
        const form = new FormData()
        form.append('application', application)
        form.append('source', source)
        form.append('file', file)
        return axios.post(`${BASE}/upload/`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: onProgress,
        })
    },

    getCrossReference(application: string) {
        return axios.get(`${BASE}/cross-reference/`, { params: { application } })
    },

    getUploadLogs(application: string) {
        return axios.get(`${BASE}/upload-logs/`, { params: { application } })
    },
}