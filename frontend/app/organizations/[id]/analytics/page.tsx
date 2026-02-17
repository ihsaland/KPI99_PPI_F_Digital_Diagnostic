'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { organizationsApi, analyticsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'
import TrendAnalysis from '@/components/TrendAnalysis'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DIMENSION_LABELS: Record<string, string> = {
  performance: 'Performance',
  production_readiness: 'Production Readiness',
  infrastructure_efficiency: 'Infrastructure Efficiency',
  failure_resilience: 'Failure Resilience',
}

export default function AnalyticsPage() {
  const params = useParams()
  const organizationId = parseInt(params.id as string)

  const [organization, setOrganization] = useState<any>(null)
  const [trends, setTrends] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [benchmark, setBenchmark] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [organizationId])

  const fetchData = async () => {
    try {
      const [orgResponse, trendsResponse, metricsResponse, benchmarkResponse] = await Promise.all([
        organizationsApi.get(organizationId),
        analyticsApi.getTrends(organizationId),
        analyticsApi.getMetrics(organizationId),
        analyticsApi.getBenchmark(organizationId),
      ])
      setOrganization(orgResponse.data)
      setTrends(trendsResponse.data)
      setMetrics(metricsResponse.data)
      setBenchmark(benchmarkResponse.data)
    } catch (error: any) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const benchmarkData = benchmark?.dimension_benchmarks ? Object.keys(benchmark.dimension_benchmarks).map(dim => ({
    dimension: DIMENSION_LABELS[dim] || dim,
    score: benchmark.dimension_benchmarks[dim].score,
    industry_avg: benchmark.dimension_benchmarks[dim].industry_avg,
  })) : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Header organizationId={organizationId} />

      {/* Header Image */}
      {organization && (
        <PanAbstract
          title={`${organization.name} PPI-F Analytics`}
          subtitle="Track your organization's engineering maturity improvements over time"
          variant="gradient"
        />
      )}

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-8 max-w-7xl" role="main">
        <Link href={`/organizations/${organizationId}/assessments`} className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assessments
        </Link>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">PPI-F Average Maturity</div>
              <div className="text-3xl font-bold text-blue-600">
                {metrics.average_maturity.toFixed(2)}/5.0
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Completed Assessments</div>
              <div className="text-3xl font-bold text-green-600">
                {metrics.completed_assessments}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Total PPI-F Recommendations</div>
              <div className="text-3xl font-bold text-purple-600">
                {metrics.total_recommendations}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-2">Completion Rate</div>
              <div className="text-3xl font-bold text-orange-600">
                {metrics.recommendation_completion_rate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Trend Analysis */}
        {trends && trends.trends && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">PPI-F Maturity Trend Analysis</h2>
            <TrendAnalysis trends={trends.trends} />
          </div>
        )}

        {/* Benchmark Comparison */}
        {benchmark && !benchmark.message && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">PPI-F Industry Benchmark Comparison</h2>
            <p className="text-slate-600 mb-4">
              Compare your PPI-F maturity scores against industry benchmarks to understand how your engineering practices 
              measure up to peers.
            </p>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-600">Your PPI-F Overall Maturity</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {benchmark.overall_maturity.toFixed(2)}/5.0
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Industry Average</div>
                  <div className="text-3xl font-bold text-slate-600">
                    {benchmark.industry_average.toFixed(2)}/5.0
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Difference</div>
                  <div className={`text-3xl font-bold ${
                    benchmark.vs_industry > 0 ? 'text-green-600' : 
                    benchmark.vs_industry < 0 ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {benchmark.vs_industry > 0 ? '+' : ''}{benchmark.vs_industry.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#3b82f6" name="Your Score" />
                <Bar dataKey="industry_avg" fill="#94a3b8" name="Industry Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  )
}

