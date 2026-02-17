'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { organizationsApi, webhooksApi, Webhook } from '@/lib/api'
import toast from 'react-hot-toast'
import Logo from '@/components/Logo'

const AVAILABLE_EVENTS = [
  { value: 'assessment.completed', label: 'Assessment Completed' },
  { value: 'assessment.created', label: 'Assessment Created' },
  { value: 'recommendation.updated', label: 'Recommendation Updated' },
  { value: 'recommendation.completed', label: 'Recommendation Completed' },
]

export default function IntegrationsPage() {
  const params = useParams()
  const organizationId = parseInt(params.id as string)

  const [organization, setOrganization] = useState<any>(null)
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
    secret: '',
  })

  useEffect(() => {
    fetchData()
  }, [organizationId])

  const fetchData = async () => {
    try {
      const [orgResponse, webhooksResponse] = await Promise.all([
        organizationsApi.get(organizationId),
        webhooksApi.list(organizationId),
      ])
      setOrganization(orgResponse.data)
      setWebhooks(webhooksResponse.data)
    } catch (error: any) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await webhooksApi.create({
        organization_id: organizationId,
        url: formData.url,
        events: formData.events,
        secret: formData.secret || undefined,
      })
      toast.success('Webhook created successfully')
      setShowCreateForm(false)
      setFormData({ url: '', events: [], secret: '' })
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create webhook')
    }
  }

  const handleToggleWebhook = async (webhookId: number, isActive: boolean) => {
    try {
      await webhooksApi.update(webhookId, { is_active: !isActive })
      toast.success('Webhook updated')
      fetchData()
    } catch (error: any) {
      toast.error('Failed to update webhook')
    }
  }

  const handleDeleteWebhook = async (webhookId: number) => {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return
    }
    try {
      await webhooksApi.delete(webhookId)
      toast.success('Webhook deleted')
      fetchData()
    } catch (error: any) {
      toast.error('Failed to delete webhook')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <Logo size="md" showText={true} />
          </Link>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-8 max-w-6xl" role="main">
        <Link href={`/organizations/${organizationId}/assessments`} className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assessments
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations & Webhooks</h1>
              <p className="text-slate-600">{organization?.name}</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {showCreateForm ? 'Cancel' : '+ New Webhook'}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateWebhook} className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Webhook</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/webhook"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Events to Subscribe
                  </label>
                  <div className="space-y-2">
                    {AVAILABLE_EVENTS.map((event) => (
                      <label key={event.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, events: [...formData.events, event.value] })
                            } else {
                              setFormData({ ...formData, events: formData.events.filter(e => e !== event.value) })
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-slate-700">{event.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Secret (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.secret}
                    onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                    placeholder="Webhook secret for signature verification"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Used to verify webhook authenticity with HMAC SHA256 signature
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Create Webhook
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {webhooks.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-600">No webhooks configured. Create one to get started.</p>
              </div>
            ) : (
              webhooks.map((webhook) => (
                <div key={webhook.id} className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{webhook.url}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          webhook.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {webhook.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {webhook.events.map((event) => (
                          <span key={event} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleWebhook(webhook.id, webhook.is_active)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition font-medium ${
                          webhook.is_active
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {webhook.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Created {new Date(webhook.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">API Documentation</h2>
          <p className="text-slate-600 mb-4">
            Access the complete API documentation with interactive Swagger UI.
          </p>
          <div className="flex gap-4">
            <a
              href="/api/docs"
              target="_blank"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              View API Docs (Swagger)
            </a>
            <a
              href="/api/redoc"
              target="_blank"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View API Docs (ReDoc)
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}



