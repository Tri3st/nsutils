// ─── Domain constants ──────────────────────────────────────────────────────────

export const APPLICATIONS = ['iprotect', 'iwork', 'ocms'] as const
export const SOURCES = ['users', 'mail_dist_list', 'ad_group'] as const

export type Application = (typeof APPLICATIONS)[number]
export type Source = (typeof SOURCES)[number]

// ─── API response types ────────────────────────────────────────────────────────

export interface Identity {
  id: number
  application: Application
  source: Source
  username: string
  email: string | null
  display_name: string | null
  department: string | null
  extra_data: Record<string, unknown>
  uploaded_at: string
}

export interface UploadLog {
  id: number
  application: Application
  source: Source
  filename: string
  row_count: number
  uploaded_at: string
  status: 'success' | 'error'
  error_message: string | null
}

export interface UploadResponse {
  application: Application
  source: Source
  filename: string
  created: number
  skipped: number
}

export interface CrossReferenceEntry {
  username: string
  email: string | null
  display_name: string | null
  department: string | null
  in_users: boolean
  in_mail_dist: boolean
  in_ad_group: boolean
}

export interface CrossReferenceSummary {
  total_unique: number
  users_count: number
  mail_dist_count: number
  ad_group_count: number
  in_all_count: number
  discrepancies: number
  sources_loaded: Record<Source, boolean>
}

export interface CrossReferenceResult {
  in_all: CrossReferenceEntry[]
  only_in_users: CrossReferenceEntry[]
  only_in_mail_dist: CrossReferenceEntry[]
  only_in_ad_group: CrossReferenceEntry[]
  in_users_and_mail: CrossReferenceEntry[]
  in_users_and_ad: CrossReferenceEntry[]
  in_mail_and_ad: CrossReferenceEntry[]
  summary: CrossReferenceSummary
}

export type CrossReferenceCategory = keyof Omit<CrossReferenceResult, 'summary'>

/** { iprotect: { users: 42, mail_dist_list: 0, ad_group: 5 }, ... } */
export type StatusMap = Record<Application, Record<Source, number>>

// ─── Store internal types ──────────────────────────────────────────────────────

export interface UploadMeta {
  filename: string
  count: number
}

/** Helper: nested record keyed by Application then Source */
export type PerAppSource<T> = Record<Application, Record<Source, T>>

/** Helper: record keyed by Application */
export type PerApp<T> = Record<Application, T>