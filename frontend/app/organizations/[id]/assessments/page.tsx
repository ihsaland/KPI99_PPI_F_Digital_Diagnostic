'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { organizationsApi, assessmentsApi, Assessment } from '@/lib/api'
import { STRATEGIC_INITIATIVES, getInitiativeLabel } from '@/lib/strategicInitiatives'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'
import AdvancedFilters from '@/components/AdvancedFilters'
import BulkActions from '@/components/BulkActions'
import NotificationBell from '@/components/NotificationBell'

export default function AssessmentsPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = parseInt(params.id as string)

  const [organization, setOrganization] = useState<any>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [newAssessmentName, setNewAssessmentName] = useState('')
  const [newAssessmentInitiative, setNewAssessmentInitiative] = useState<string>('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [cloningId, setCloningId] = useState<number | null>(null)
  const [filters, setFilters] = useState<{ status?: string; search?: string }>({})
  const [selectedAssessments, setSelectedAssessments] = useState<number[]>([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [organizationId, filters])

  const fetchData = async () => {
    try {
      const [orgResponse, assessmentsResponse] = await Promise.all([
        organizationsApi.get(organizationId),
        assessmentsApi.list(organizationId, filters.status, filters.search),
      ])
      setOrganization(orgResponse.data)
      setAssessments(assessmentsResponse.data)
    } catch (error: any) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }


  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAssessmentName.trim()) {
      toast.error('Please enter an assessment name')
      return
    }

    if (!organizationId || isNaN(organizationId)) {
      toast.error('Invalid organization ID')
      return
    }

    setCreating(true)
    try {
      console.log('Creating assessment:', { organization_id: organizationId, name: newAssessmentName.trim() })
      
      const tags = newAssessmentInitiative ? [newAssessmentInitiative] : undefined
      const response = await assessmentsApi.create({
        organization_id: organizationId,
        name: newAssessmentName.trim(),
        tags,
      })
      
      console.log('Assessment created successfully:', response.data)
      
      const newAssessment = response.data
      toast.success('Assessment created! Redirecting...')
      setNewAssessmentName('')
      setNewAssessmentInitiative('')
      setShowNewForm(false)
      
      // Small delay to show the success message
      setTimeout(() => {
        router.push(`/assessments/${newAssessment.id}`)
      }, 500)
    } catch (error: any) {
      console.error('Error creating assessment:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      
      let errorMessage = 'Failed to create assessment'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.response?.status === 404) {
        errorMessage = 'Organization not found'
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.'
      }
      
      toast.error(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  const handleCloneAssessment = async (assessmentId: number, assessmentName: string) => {
    try {
      setCloningId(assessmentId)
      const newName = `${assessmentName} (Copy)`
      const response = await assessmentsApi.clone(assessmentId, newName)
      toast.success('Assessment cloned successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to clone assessment')
    } finally {
      setCloningId(null)
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
      <Header organizationId={organizationId} />

      {/* Header Image */}
      {organization && (
        <PanAbstract
          title={organization.name}
          subtitle="PPI-F Diagnostics & Assessments"
          variant="default"
        />
      )}

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-12 max-w-6xl" role="main">
        <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{organization?.name}</h1>
              {organization?.domain && (
                <p className="text-slate-600">{organization.domain}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell organizationId={organizationId} />
              <Link
                href={`/organizations/${organizationId}/analytics`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
              <Link
                href={`/organizations/${organizationId}/integrations`}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Integrations
              </Link>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{organization?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Assessments</h2>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                {showNewForm ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New PPI-F Diagnostic
                  </>
                )}
              </button>
            </div>
            <AdvancedFilters filters={filters} onFilterChange={setFilters} />
            <BulkActions 
              selectedIds={selectedAssessments} 
              onActionComplete={() => setSelectedAssessments([])}
            />
          </div>

          {showNewForm && (
            <div className="px-8 py-6 border-b border-slate-200 bg-blue-50">
              <form onSubmit={handleCreateAssessment} className="space-y-4">
                <div className="flex flex-wrap gap-4 items-end">
                  <input
                    type="text"
                    value={newAssessmentName}
                    onChange={(e) => setNewAssessmentName(e.target.value)}
                    placeholder="PPI-F Diagnostic name (e.g., Q1 2024 Engineering Maturity)"
                    required
                    disabled={creating}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="initiative" className="text-sm font-medium text-slate-700">Strategic initiative (optional)</label>
                    <select
                      id="initiative"
                      value={newAssessmentInitiative}
                      onChange={(e) => setNewAssessmentInitiative(e.target.value)}
                      disabled={creating}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed min-w-[220px]"
                    >
                      <option value="">None</option>
                      {STRATEGIC_INITIATIVES.map((init) => (
                        <option key={init.tag} value={init.tag}>{init.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                  type="submit"
                  disabled={creating || !newAssessmentName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
                </div>
              </form>
            </div>
          )}

          <div className="p-8">
            {assessments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No assessments yet</h3>
                <p className="text-slate-600 mb-6">Create your first assessment to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className={`group block p-6 border rounded-lg hover:shadow-md transition-all bg-white ${
                      selectedAssessments.includes(assessment.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedAssessments.includes(assessment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssessments([...selectedAssessments, assessment.id])
                          } else {
                            setSelectedAssessments(selectedAssessments.filter(id => id !== assessment.id))
                          }
                        }}
                        className="mt-1 w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Link href={`/assessments/${assessment.id}`}>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition">
                            {assessment.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500">
                          Created {new Date(assessment.created_at).toLocaleDateString()}
                        </p>
                        {assessment.tags?.length && assessment.tags.some((t) => STRATEGIC_INITIATIVES.some((i) => i.tag === t)) && (
                          <p className="text-xs text-slate-600 mt-1">
                            Initiative: {getInitiativeLabel(assessment.tags.find((t) => STRATEGIC_INITIATIVES.some((i) => i.tag === t))!)}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        assessment.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : assessment.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {assessment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/assessments/${assessment.id}`}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <span className="text-sm font-medium">View Assessment</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {assessment.status === 'completed' && (
                        <button
                          onClick={() => handleCloneAssessment(assessment.id, assessment.name)}
                          disabled={cloningId === assessment.id}
                          className="text-sm text-slate-600 hover:text-blue-600 font-medium disabled:opacity-50"
                          title="Clone assessment"
                        >
                          {cloningId === assessment.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Cloning...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Clone
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
