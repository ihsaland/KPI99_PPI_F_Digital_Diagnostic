'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { organizationsApi, Organization } from '@/lib/api'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'
import toast from 'react-hot-toast'

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await organizationsApi.list()
      console.log('Organizations response:', response)
      if (response && response.data) {
        setOrganizations(response.data)
      } else {
        setOrganizations([])
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error)
      console.error('Error details:', error.response?.data || error.message)
      console.error('Error status:', error.response?.status)
      console.error('Error URL:', error.config?.url)
      console.error('Full error:', error)
      
      // Provide more specific error message
      let errorMessage = 'Failed to load organizations. '
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage += 'Cannot connect to backend server. Please check if the backend is running and NEXT_PUBLIC_API_URL is set correctly.'
      } else if (error.response?.status === 404) {
        errorMessage += 'Backend endpoint not found. Please verify the backend URL is correct.'
      } else if (error.response?.status === 0 || error.message?.includes('CORS')) {
        errorMessage += 'CORS error detected. Please check CORS_ORIGINS in Railway backend settings.'
      } else {
        errorMessage += 'Please check if the backend server is running.'
      }
      
      setError(errorMessage)
      toast.error('Failed to load organizations')
      setOrganizations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Header />

      {/* Header Image */}
      <PanAbstract
        title="AI-Augmented PPI-F Diagnostic"
        subtitle="Performance failures are business risks — until they are engineered. Enhanced with AI-powered insights."
        variant="gradient"
      />

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-12" role="main">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Measure and improve your organization's Performance, Production Readiness,
            Infrastructure Efficiency, and Failure Resilience with KPI99's AI-Augmented Performance Engineering framework.
            Get intelligent anomaly detection, predictive insights, and workload optimization recommendations.
          </p>
          <div className="mb-8">
            <Link
              href="/documentation"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              View Full Usage Guide
            </Link>
          </div>
          {(organizations.length === 0 && (!loading || error)) && (
            <Link
              href="/organizations/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start AI-Augmented Diagnostic
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>

        {/* PPI-F Dimensions Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance</h3>
            <p className="text-sm text-slate-600 mb-2">AI-powered anomaly detection, workload behavior modeling, and bottleneck identification</p>
            <p className="text-xs text-slate-500 italic">PPI-F Dimension: ML-based regression detection and optimization</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Production Readiness</h3>
            <p className="text-sm text-slate-600 mb-2">SLOs, deployment safety, and operational runbooks</p>
            <p className="text-xs text-slate-500 italic">PPI-F Dimension: Deployment confidence and safety</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Infrastructure Efficiency</h3>
            <p className="text-sm text-slate-600 mb-2">AI-driven capacity forecasting, predictive cost modeling, and tier optimization</p>
            <p className="text-xs text-slate-500 italic">PPI-F Dimension: Predictive capacity and cost modeling</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Failure Resilience</h3>
            <p className="text-sm text-slate-600 mb-2">High availability, disaster recovery, and AI-enabled fault isolation</p>
            <p className="text-xs text-slate-500 italic">PPI-F Dimension: System reliability and recovery</p>
          </div>
        </div>

        {/* Organizations Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Organizations</h2>
              <Link
                href="/organizations/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Organization
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-600">Loading organizations...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Organizations</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <button
                  onClick={fetchOrganizations}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No organizations yet</h3>
                <p className="text-slate-600 mb-6">Get started by creating your first organization</p>
                <Link
                  href="/organizations/new"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Create Organization
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizations.map((org) => (
                  <Link
                    key={org.id}
                    href={`/organizations/${org.id}/assessments`}
                    className="group block p-5 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">{org.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition">
                      {org.name}
                    </h3>
                    {org.domain && (
                      <p className="text-sm text-slate-500">{org.domain}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

