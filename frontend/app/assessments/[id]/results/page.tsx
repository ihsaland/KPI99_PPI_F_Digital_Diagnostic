'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { assessmentsApi, reportsApi, Score, Finding, Recommendation } from '@/lib/api'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, Cell
} from 'recharts'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'
import Heatmap from '@/components/Heatmap'
import RadarChartComponent from '@/components/RadarChart'
import ProgressIndicator from '@/components/ProgressIndicator'
import PrioritizationMatrix from '@/components/PrioritizationMatrix'
import ReportComparison from '@/components/ReportComparison'
import AssessmentNotes from '@/components/AssessmentNotes'
import AssessmentTags from '@/components/AssessmentTags'
import PPIFrameworkVisualization from '@/components/PPIFrameworkVisualization'
import PPIInsights from '@/components/PPIInsights'
import AIInsights from '@/components/AIInsights'
import { recommendationsApi, analyticsApi } from '@/lib/api'

const DIMENSION_LABELS: Record<string, string> = {
  performance: 'Performance',
  production_readiness: 'Production Readiness',
  infrastructure_efficiency: 'Infrastructure Efficiency',
  failure_resilience: 'Failure Resilience',
}

const DIMENSION_COLORS: Record<string, string> = {
  performance: '#3b82f6',
  production_readiness: '#10b981',
  infrastructure_efficiency: '#8b5cf6',
  failure_resilience: '#ef4444',
}

interface ChartDataEntry {
  dimension: string
  dimensionKey: string
  maturity: number
  percentage: number
  color: string
}

export default function ResultsPage() {
  const params = useParams()
  const assessmentId = parseInt(params.id as string)

  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview')
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null)
  const [showPrioritization, setShowPrioritization] = useState(false)
  const [insights, setInsights] = useState<any>(null)

  useEffect(() => {
    fetchSummary()
    fetchInsights()
  }, [assessmentId])

  const fetchInsights = async () => {
    try {
      const response = await analyticsApi.getInsights(assessmentId)
      setInsights(response.data)
    } catch (error: any) {
      // Insights are optional, so we don't show error
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await assessmentsApi.getSummary(assessmentId)
      setSummary(response.data)
    } catch (error: any) {
      toast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (recommendationId: number, status: string) => {
    try {
      await recommendationsApi.updateStatus(recommendationId, status)
      toast.success('Recommendation status updated')
      // Refresh summary to get updated statuses
      fetchSummary()
    } catch (error: any) {
      toast.error('Failed to update recommendation status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No results found</p>
        </div>
      </div>
    )
  }

  const chartData = summary.scores.map((score: Score) => ({
    dimension: DIMENSION_LABELS[score.dimension] || score.dimension,
    dimensionKey: score.dimension,
    maturity: score.maturity_score,
    percentage: score.percentage,
    color: DIMENSION_COLORS[score.dimension] || '#3b82f6',
  }))

  const radarData = summary.scores.map((score: Score) => ({
    dimension: score.dimension,
    maturity: score.maturity_score,
  }))

  const getRiskColorClasses = (level: string) => {
    switch (level) {
      case 'critical':
        return 'from-red-50 to-red-100 border-red-200 text-red-600'
      case 'high':
        return 'from-orange-50 to-orange-100 border-orange-200 text-orange-600'
      case 'medium':
        return 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600'
      default:
        return 'from-green-50 to-green-100 border-green-200 text-green-600'
    }
  }

  const riskColorClasses = getRiskColorClasses(summary.risk_level)

  const handleHeatmapClick = (dimension: string) => {
    setSelectedDimension(dimension)
    setSelectedView('detailed')
  }

  const filteredFindings = selectedDimension
    ? summary.findings.filter((f: Finding) => f.dimension === selectedDimension)
    : summary.findings

  const filteredRecommendations = selectedDimension
    ? summary.recommendations.filter((r: Recommendation) => r.dimension === selectedDimension)
    : summary.recommendations

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Header />

      {/* Header Image */}
      {summary?.assessment && (
        <PanAbstract
          title="AI-Augmented PPI-F Maturity Report"
          subtitle={summary.assessment.name}
          variant="pattern"
        />
      )}

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-8 max-w-7xl" role="main">
        <Link href={`/assessments/${assessmentId}`} className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assessment
        </Link>

        {/* View Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => {
              setSelectedView('overview')
              setSelectedDimension(null)
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedView === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('detailed')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedView === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Detailed Analysis
          </button>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-900">AI-Augmented PPI-F Maturity Report</h1>
            {summary?.assessment && (
              <Link
                href={`/organizations/${summary.assessment.organization_id}/analytics`}
                className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </Link>
            )}
          </div>

          {/* PPI-F Framework Visualization */}
          {summary?.scores && (
            <div className="mb-8">
              <PPIFrameworkVisualization
                scores={{
                  performance: summary.scores.find((s: Score) => s.dimension === 'performance')?.maturity_score,
                  production_readiness: summary.scores.find((s: Score) => s.dimension === 'production_readiness')?.maturity_score,
                  infrastructure_efficiency: summary.scores.find((s: Score) => s.dimension === 'infrastructure_efficiency')?.maturity_score,
                  failure_resilience: summary.scores.find((s: Score) => s.dimension === 'failure_resilience')?.maturity_score,
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">{(summary.overall_maturity ?? 0).toFixed(2)}/5.0</div>
              <div className="text-sm font-semibold text-slate-700">PPI-F Overall Maturity</div>
              <div className="text-xs text-slate-500 mt-1">
                {(summary.overall_maturity ?? 0) >= 4.0 ? 'Excellent' :
                 (summary.overall_maturity ?? 0) >= 3.0 ? 'Good' :
                 (summary.overall_maturity ?? 0) >= 2.0 ? 'Fair' : 'Needs Improvement'}
              </div>
            </div>
            <div className={`text-center p-6 bg-gradient-to-br ${riskColorClasses} rounded-xl border`}>
              <div className={`text-4xl font-bold mb-2 capitalize`}>{summary.risk_level}</div>
              <div className="text-sm font-semibold text-slate-700">Risk Level</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{summary.recommendations.length}</div>
              <div className="text-sm font-semibold text-slate-700">PPI-F Recommendations</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="text-4xl font-bold text-orange-600 mb-2">{summary.findings.length}</div>
              <div className="text-sm font-semibold text-slate-700">PPI-F Findings</div>
            </div>
          </div>

          {/* PPI-F Framework Visualization */}
          {summary?.scores && (
            <div className="mb-8">
              <PPIFrameworkVisualization
                scores={{
                  performance: summary.scores.find((s: Score) => s.dimension === 'performance')?.maturity_score,
                  production_readiness: summary.scores.find((s: Score) => s.dimension === 'production_readiness')?.maturity_score,
                  infrastructure_efficiency: summary.scores.find((s: Score) => s.dimension === 'infrastructure_efficiency')?.maturity_score,
                  failure_resilience: summary.scores.find((s: Score) => s.dimension === 'failure_resilience')?.maturity_score,
                }}
              />
            </div>
          )}

          {/* Interactive Heatmap */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">PPI-F Maturity Heatmap</h2>
            <p className="text-sm text-slate-600 mb-4">Click on any dimension to view detailed analysis</p>
            <Heatmap
              scores={summary.scores.map((s: Score) => ({
                dimension: s.dimension,
                maturity_score: s.maturity_score,
                percentage: s.percentage,
              }))}
              onCellClick={handleHeatmapClick}
            />
          </div>

          {/* Dimension Filter */}
          {selectedDimension && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-600">Viewing: </span>
                  <span className="font-semibold text-slate-900">
                    {DIMENSION_LABELS[selectedDimension] || selectedDimension}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDimension(null)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Maturity Radar Chart</h2>
            <p className="text-sm text-slate-600 mb-4">
              Visual representation of maturity across all dimensions
            </p>
            <RadarChartComponent data={radarData} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Maturity Scores Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="dimension"
                  tick={{ fill: '#475569', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fill: '#475569', fontSize: 12 }}
                  label={{ value: 'Maturity Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${(value ?? 0).toFixed(2)}/5.0 (${(props.payload?.percentage ?? 0).toFixed(0)}%)`,
                    'Maturity Score'
                  ]}
                />
                <Bar dataKey="maturity" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry: ChartDataEntry, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Detailed Progress by Dimension</h2>
          <ProgressIndicator
            scores={summary.scores.map((s: Score) => ({
              dimension: s.dimension,
              maturity_score: s.maturity_score,
              percentage: s.percentage,
            }))}
          />
        </div>

        {/* Area Chart - Progress Visualization */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Dimension Progress Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMaturity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="dimension"
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${(value ?? 0).toFixed(2)}/5.0`, 'Maturity Score']}
              />
              <Area
                type="monotone"
                dataKey="maturity"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorMaturity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Findings */}
        {filteredFindings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              PPI-F Key Findings {selectedDimension && `- ${DIMENSION_LABELS[selectedDimension]}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFindings.map((finding: Finding) => (
                <div
                  key={finding.id}
                  className={`p-5 border-l-4 rounded-lg ${
                    finding.severity === 'critical'
                      ? 'border-red-500 bg-red-50'
                      : finding.severity === 'high'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      finding.severity === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : finding.severity === 'high'
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {finding.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {DIMENSION_LABELS[finding.dimension]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{finding.title}</h3>
                  <p className="text-sm text-slate-700">{finding.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prioritization Matrix */}
        {filteredRecommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                PPI-F Engineering Recommendations {selectedDimension && `- ${DIMENSION_LABELS[selectedDimension]}`}
              </h2>
              <button
                onClick={() => setShowPrioritization(!showPrioritization)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {showPrioritization ? 'Hide Matrix' : 'Show Prioritization Matrix'}
              </button>
            </div>
            {showPrioritization && (
              <PrioritizationMatrix
                recommendations={filteredRecommendations}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        )}

        {/* Recommendations with Timeline Visualization */}
        {filteredRecommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Recommendations & Roadmap {selectedDimension && `- ${DIMENSION_LABELS[selectedDimension]}`}
            </h2>
            <div className="space-y-8">
              {['30', '60', '90'].map((timeline) => {
                const timelineRecs = filteredRecommendations.filter(
                  (r: Recommendation) => r.timeline === timeline
                )
                if (timelineRecs.length === 0) return null

                return (
                  <div key={timeline} className="relative">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        timeline === '30' ? 'bg-green-500' :
                        timeline === '60' ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}>
                        {timeline}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-slate-900">{timeline}-Day Roadmap</h3>
                        <p className="text-sm text-slate-600">{timelineRecs.length} recommendations</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                      {timelineRecs.map((rec: Recommendation) => (
                        <div
                          key={rec.id}
                          className="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                              <span className="text-xs text-slate-500">
                                {DIMENSION_LABELS[rec.dimension]}
                              </span>
                            </div>
                            <select
                              value={rec.status || 'pending'}
                              onChange={(e) => handleStatusChange(rec.id, e.target.value)}
                              className="ml-4 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="skipped">Skipped</option>
                            </select>
                          </div>
                          <p className="text-sm text-slate-700 mb-3">{rec.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className={`px-2 py-1 rounded ${
                              rec.effort === 'low' ? 'bg-green-100 text-green-700' :
                              rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Effort: {rec.effort}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              rec.impact === 'high' ? 'bg-blue-100 text-blue-700' :
                              rec.impact === 'medium' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              Impact: {rec.impact}
                            </span>
                            {rec.kpi && (
                              <span className="px-2 py-1 rounded bg-slate-200 text-slate-700">
                                KPI: {rec.kpi}
                              </span>
                            )}
                            {rec.status && (
                              <span className={`px-2 py-1 rounded ${
                                rec.status === 'completed' ? 'bg-green-100 text-green-700' :
                                rec.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                rec.status === 'skipped' ? 'bg-gray-100 text-gray-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                Status: {rec.status.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Comparison View */}
        {selectedView === 'detailed' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">PPI-F Progress Comparison</h2>
            <p className="text-slate-600 mb-6">
              Compare this PPI-F Diagnostic with previous diagnostics to track engineering maturity progress over time.
            </p>
            {summary?.assessment && (
              <ReportComparison
                organizationId={summary.assessment.organization_id}
                currentAssessmentId={assessmentId}
              />
            )}
          </div>
        )}

        {/* KPI99 PPI-F Insights */}
        {summary?.scores && (
          <div className="mb-6">
            <PPIInsights
              scores={summary.scores}
              overallMaturity={summary.overall_maturity || 0}
            />
          </div>
        )}

        {/* AI-Augmented Diagnostics */}
        <div className="mb-6">
          <AIInsights assessmentId={assessmentId} />
        </div>

        {/* Assessment Insights */}
        {insights && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">PPI-F Assessment Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-semibold mb-1">Quick Wins Available</div>
                <div className="text-2xl font-bold text-blue-900">{insights.quick_wins}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-600 font-semibold mb-1">Critical Findings</div>
                <div className="text-2xl font-bold text-red-900">{insights.critical_findings}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 font-semibold mb-1">High Priority Items</div>
                <div className="text-2xl font-bold text-purple-900">{insights.high_priority_recommendations}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-semibold mb-1">Completed Actions</div>
                <div className="text-2xl font-bold text-green-900">
                  {insights.recommendation_status_breakdown?.completed || 0}
                </div>
              </div>
            </div>
            {insights && insights.strongest_dimension && insights.weakest_dimension ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Strongest Dimension</div>
                  <div className="text-lg font-bold text-green-900">
                    {DIMENSION_LABELS[insights.strongest_dimension?.dimension] || insights.strongest_dimension?.dimension || 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">
                    Score: {(insights.strongest_dimension?.score ?? 0).toFixed(2)}/5.0
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm text-orange-600 font-semibold mb-1">Focus Area</div>
                  <div className="text-lg font-bold text-orange-900">
                    {DIMENSION_LABELS[insights.weakest_dimension?.dimension] || insights.weakest_dimension?.dimension || 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">
                    Score: {(insights.weakest_dimension?.score ?? 0).toFixed(2)}/5.0
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Assessment Tags and Notes */}
        {summary?.assessment && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AssessmentTags
              assessmentId={assessmentId}
              initialTags={summary.assessment.tags}
            />
            <AssessmentNotes
              assessmentId={assessmentId}
              initialNotes={summary.assessment.notes}
            />
          </div>
        )}

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Export PPI-F Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">PDF Reports</h3>
              <p className="text-sm text-slate-600 mb-3">Professional formatted reports for sharing</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={reportsApi.getPdf(assessmentId, 'full')}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                >
                  Full Report
                </a>
                <a
                  href={reportsApi.getPdf(assessmentId, 'executive')}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                >
                  Executive Summary
                </a>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Data Exports</h3>
              <p className="text-sm text-slate-600 mb-3">Export data for analysis and integration</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={reportsApi.getExcel(assessmentId)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                >
                  Excel Export
                </a>
                <a
                  href={reportsApi.getCsv(assessmentId)}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                >
                  CSV Backlog
                </a>
                <button
                  onClick={async () => {
                    try {
                      const response = await reportsApi.getJson(assessmentId)
                      const dataStr = JSON.stringify(response.data, null, 2)
                      const dataBlob = new Blob([dataStr], { type: 'application/json' })
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `assessment_${assessmentId}.json`
                      link.click()
                      toast.success('JSON exported successfully')
                    } catch (error) {
                      toast.error('Failed to export JSON')
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  JSON Export
                </button>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <p className="mb-2"><strong>Report Types:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Full Report:</strong> Complete assessment with all findings and recommendations</li>
              <li><strong>Executive Summary:</strong> High-level overview for leadership</li>
              <li><strong>Excel Export:</strong> All assessment data in spreadsheet format</li>
              <li><strong>CSV Backlog:</strong> Recommendations formatted for project management tools</li>
              <li><strong>JSON Export:</strong> Machine-readable format for integrations</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
