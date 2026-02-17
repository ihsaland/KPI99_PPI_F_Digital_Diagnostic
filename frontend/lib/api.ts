import axios from 'axios'

// Determine API base URL
// For Vercel: Use environment variable pointing to Railway/Render backend
// For local dev: Use localhost
// Vercel rewrites will handle /api/* requests if NEXT_PUBLIC_API_URL is not set
const getApiBase = () => {
  // Use environment variable if set (for Vercel deployment)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // For local development or if no env var, use same origin
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`
  }
  
  // Server-side fallback
  return 'http://localhost:8001'
}

const API_BASE = getApiBase()

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Add API key interceptor (if stored in localStorage)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const apiKey = localStorage.getItem('api_key')
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey
    }
  }
  return config
})

export interface Organization {
  id: number
  name: string
  domain?: string
  created_at: string
}

export interface Assessment {
  id: number
  organization_id: number
  name: string
  version: string
  status: string
  notes?: string | null
  tags?: string[]
  custom_fields?: Record<string, any>
  created_at: string
  updated_at?: string
  completed_at?: string
}

export interface Webhook {
  id: number
  organization_id: number
  url: string
  events: string[]
  is_active: boolean
  created_at: string
}

export interface Notification {
  id: number
  organization_id?: number
  assessment_id?: number
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Question {
  id: number
  dimension: string
  question_type: string
  question_text: string
  options?: any
  weight: number
  order: number
  is_critical: boolean
  maturity_mapping?: any
}

export interface Answer {
  id: number
  assessment_id: number
  question_id: number
  answer_value: string
  maturity_score?: number
}

export interface Score {
  id: number
  assessment_id: number
  dimension: string
  maturity_score: number
  weighted_score: number
  max_possible_score: number
  percentage: number
}

export interface Finding {
  id: number
  assessment_id: number
  dimension: string
  severity: string
  title: string
  description: string
}

export interface Recommendation {
  id: number
  assessment_id: number
  dimension: string
  title: string
  description: string
  effort: string
  impact: string
  kpi?: string
  timeline: string
  priority: number
  status?: string
}

export const organizationsApi = {
  list: () => api.get<Organization[]>('/api/organizations/'),
  get: (id: number) => api.get<Organization>(`/api/organizations/${id}`),
  create: (data: { name: string; domain?: string }) =>
    api.post<Organization>('/api/organizations/', data),
}

export const assessmentsApi = {
  list: (organizationId?: number, status?: string, search?: string) =>
    api.get<Assessment[]>('/api/assessments', {
      params: {
        ...(organizationId ? { organization_id: organizationId } : {}),
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      },
    }),
  get: (id: number) => api.get<Assessment>(`/api/assessments/${id}`),
  create: (data: { organization_id: number; name: string; version?: string }) =>
    api.post<Assessment>('/api/assessments', data),
  clone: (assessmentId: number, newName?: string) =>
    api.post<Assessment>(`/api/assessments/${assessmentId}/clone?new_name=${encodeURIComponent(newName || '')}`),
  getAnswers: (assessmentId: number) =>
    api.get<Answer[]>(`/api/assessments/${assessmentId}/answers`),
  submitAnswer: (assessmentId: number, data: { question_id: number; answer_value: string }) =>
    api.post<Answer>(`/api/assessments/${assessmentId}/answers`, {
      assessment_id: assessmentId,
      ...data,
    }),
  complete: (assessmentId: number) =>
    api.post(`/api/assessments/${assessmentId}/complete`),
  getSummary: (assessmentId: number) =>
    api.get(`/api/assessments/${assessmentId}/summary`),
  compare: (assessmentId1: number, assessmentId2: number) =>
    api.get(`/api/assessments/${assessmentId1}/compare/${assessmentId2}`),
  updateNotes: (assessmentId: number, notes: string) =>
    api.patch(`/api/assessments/${assessmentId}/notes?notes=${encodeURIComponent(notes)}`),
  updateTags: (assessmentId: number, tags: string[]) =>
    api.patch(`/api/assessments/${assessmentId}/tags`, tags),
  updateCustomFields: (assessmentId: number, customFields: Record<string, any>) =>
    api.patch(`/api/assessments/${assessmentId}/custom-fields`, customFields),
}

export const recommendationsApi = {
  list: (assessmentId: number, status?: string) =>
    api.get<Recommendation[]>(`/api/recommendations/${assessmentId}`, {
      params: status ? { status } : {},
    }),
  updateStatus: (recommendationId: number, status: string) =>
    api.patch(`/api/recommendations/${recommendationId}/status`, { status }),
}

export const aiDiagnosticsApi = {
  getAnomalies: (assessmentId: number) =>
    api.get(`/api/assessments/${assessmentId}/ai/anomalies`),
  getInsights: (assessmentId: number) =>
    api.get(`/api/assessments/${assessmentId}/ai/insights`),
  getWorkloadInsights: (assessmentId: number) =>
    api.get(`/api/assessments/${assessmentId}/ai/workload`),
}

export const analyticsApi = {
  getTrends: (organizationId: number) =>
    api.get(`/api/analytics/organization/${organizationId}/trends`),
  getMetrics: (organizationId: number) =>
    api.get(`/api/analytics/organization/${organizationId}/metrics`),
  getBenchmark: (organizationId: number) =>
    api.get(`/api/analytics/organization/${organizationId}/benchmark`),
  getInsights: (assessmentId: number) =>
    api.get(`/api/analytics/assessment/${assessmentId}/insights`),
}

export const webhooksApi = {
  list: (organizationId: number) =>
    api.get<Webhook[]>(`/api/webhooks/organization/${organizationId}`),
  create: (data: { organization_id: number; url: string; events: string[]; secret?: string }) =>
    api.post<Webhook>('/api/webhooks', data),
  get: (webhookId: number) =>
    api.get<Webhook>(`/api/webhooks/${webhookId}`),
  update: (webhookId: number, data: Partial<Webhook>) =>
    api.patch<Webhook>(`/api/webhooks/${webhookId}`, data),
  delete: (webhookId: number) =>
    api.delete(`/api/webhooks/${webhookId}`),
}

export const notificationsApi = {
  list: (organizationId: number, unreadOnly?: boolean) =>
    api.get<Notification[]>(`/api/notifications/organization/${organizationId}`, {
      params: unreadOnly ? { unread_only: true } : {},
    }),
  markAsRead: (notificationId: number) =>
    api.patch(`/api/notifications/${notificationId}/read`),
  markAllAsRead: (organizationId: number) =>
    api.post(`/api/notifications/mark-all-read?organization_id=${organizationId}`),
  getUnreadCount: (organizationId: number) =>
    api.get<{ unread_count: number }>(`/api/notifications/organization/${organizationId}/unread-count`),
}

export const questionsApi = {
  list: (dimension?: string) =>
    api.get<Question[]>('/api/questions', {
      params: dimension ? { dimension } : {},
    }),
  get: (id: number) => api.get<Question>(`/api/questions/${id}`),
}

export const reportsApi = {
  getPdf: (assessmentId: number, reportType: string = 'full') =>
    `${API_BASE}/api/reports/${assessmentId}/pdf?report_type=${reportType}`,
  getJson: (assessmentId: number) =>
    api.get(`/api/reports/${assessmentId}/json`),
  getCsv: (assessmentId: number) =>
    `${API_BASE}/api/reports/${assessmentId}/csv`,
  getExcel: (assessmentId: number) =>
    `${API_BASE}/api/reports/${assessmentId}/excel`,
}

export default api

