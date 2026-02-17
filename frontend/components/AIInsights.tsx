'use client'

import React, { useState, useEffect } from 'react'
import { aiDiagnosticsApi } from '@/lib/api'

interface Anomaly {
  type: string
  dimension: string
  severity: string
  message: string
  recommendation: string
  confidence: number
}

interface PredictiveInsight {
  maturity_projection?: {
    current: number
    projected_6mo: number
    trend: string
    velocity: number
    confidence: number
  }
  risk_forecast?: any
  capacity_insights?: Array<{
    dimension: string
    type: string
    message: string
    recommendation: string
    priority: string
  }>
  cost_insights?: Array<{
    type: string
    message: string
    estimated_savings_potential: string
    recommendation: string
    priority: string
  }>
}

interface WorkloadInsight {
  type: string
  title: string
  message: string
  recommendation: string
  priority: string
  applicable_dimensions?: string[]
}

interface AIInsightsProps {
  assessmentId: number
}

const DIMENSION_LABELS: Record<string, string> = {
  performance: 'Performance',
  production_readiness: 'Production Readiness',
  infrastructure_efficiency: 'Infrastructure Efficiency',
  failure_resilience: 'Failure Resilience',
}

export default function AIInsights({ assessmentId }: AIInsightsProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight | null>(null)
  const [workloadInsights, setWorkloadInsights] = useState<WorkloadInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'anomalies' | 'predictive' | 'workload'>('anomalies')

  useEffect(() => {
    fetchAIInsights()
  }, [assessmentId])

  const fetchAIInsights = async () => {
    try {
      const [anomaliesRes, predictiveRes, workloadRes] = await Promise.all([
        aiDiagnosticsApi.getAnomalies(assessmentId),
        aiDiagnosticsApi.getInsights(assessmentId),
        aiDiagnosticsApi.getWorkloadInsights(assessmentId)
      ])

      setAnomalies(anomaliesRes.data.anomalies || [])
      setPredictiveInsights(predictiveRes.data || null)
      setWorkloadInsights(workloadRes.data.insights || [])
    } catch (error: any) {
      console.error('Error fetching AI insights:', error)
      // Silently fail - AI insights are optional
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'low':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Analyzing with AI...</span>
        </div>
      </div>
    )
  }

  const hasData = anomalies.length > 0 || predictiveInsights || workloadInsights.length > 0

  if (!hasData) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI-Augmented Diagnostics</h2>
          <p className="text-sm text-slate-600">Powered by KPI99 AI Performance Engineering</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'anomalies'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Anomaly Detection ({anomalies.length})
        </button>
        <button
          onClick={() => setActiveTab('predictive')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'predictive'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Predictive Insights
        </button>
        <button
          onClick={() => setActiveTab('workload')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'workload'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Workload Analysis ({workloadInsights.length})
        </button>
      </div>

      {/* Anomalies Tab */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          {anomalies.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No anomalies detected. Your assessment results appear consistent.</p>
            </div>
          ) : (
            anomalies.map((anomaly, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-lg ${getSeverityColor(anomaly.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-lg mr-2">
                        {anomaly.type === 'regression' ? '📉' : 
                         anomaly.type === 'dimension_imbalance' ? '⚖️' : '📊'}
                      </span>
                      <h3 className="font-semibold capitalize">
                        {anomaly.type.replace('_', ' ')}
                        {anomaly.dimension !== 'all' && ` in ${DIMENSION_LABELS[anomaly.dimension] || anomaly.dimension}`}
                      </h3>
                      <span className="ml-2 text-xs px-2 py-1 bg-white/50 rounded">
                        {Math.round(anomaly.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm mb-2">{anomaly.message}</p>
                    <p className="text-sm font-medium">{anomaly.recommendation}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Predictive Insights Tab */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          {predictiveInsights?.maturity_projection && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Maturity Projection
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Current Score</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {predictiveInsights.maturity_projection.current.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">6-Month Projection</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {predictiveInsights.maturity_projection.projected_6mo.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Trend</div>
                  <div className="text-lg font-semibold capitalize">
                    {predictiveInsights.maturity_projection.trend === 'improving' ? '📈' : 
                     predictiveInsights.maturity_projection.trend === 'declining' ? '📉' : '➡️'}
                    {' '}
                    {predictiveInsights.maturity_projection.trend}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Confidence</div>
                  <div className="text-lg font-semibold">
                    {Math.round(predictiveInsights.maturity_projection.confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {predictiveInsights?.capacity_insights && predictiveInsights.capacity_insights.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Capacity & Performance Insights</h3>
              <div className="space-y-3">
                {predictiveInsights.capacity_insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 rounded-lg ${getPriorityColor(insight.priority)}`}
                  >
                    <p className="text-sm mb-1">{insight.message}</p>
                    <p className="text-sm font-medium">{insight.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {predictiveInsights?.cost_insights && predictiveInsights.cost_insights.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Cost Optimization Insights</h3>
              <div className="space-y-3">
                {predictiveInsights.cost_insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 rounded-lg ${getPriorityColor(insight.priority)}`}
                  >
                    <p className="text-sm mb-1">{insight.message}</p>
                    <p className="text-sm font-semibold mb-1">
                      Estimated Savings Potential: {insight.estimated_savings_potential}
                    </p>
                    <p className="text-sm font-medium">{insight.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!predictiveInsights?.maturity_projection && 
           (!predictiveInsights?.capacity_insights || predictiveInsights.capacity_insights.length === 0) &&
           (!predictiveInsights?.cost_insights || predictiveInsights.cost_insights.length === 0) && (
            <div className="text-center py-8 text-slate-500">
              <p>Insufficient historical data for predictive insights. Complete more assessments to enable forecasting.</p>
            </div>
          )}
        </div>
      )}

      {/* Workload Analysis Tab */}
      {activeTab === 'workload' && (
        <div className="space-y-4">
          {workloadInsights.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No workload-specific insights available for this assessment.</p>
            </div>
          ) : (
            workloadInsights.map((insight, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-lg ${getPriorityColor(insight.priority)}`}
              >
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="mr-2">
                    {insight.type === 'workload_optimization' ? '⚙️' : '🔍'}
                  </span>
                  {insight.title}
                </h3>
                <p className="text-sm mb-2">{insight.message}</p>
                <p className="text-sm font-medium">{insight.recommendation}</p>
                {insight.applicable_dimensions && insight.applicable_dimensions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {insight.applicable_dimensions.map((dim, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-white/50 rounded"
                      >
                        {DIMENSION_LABELS[dim] || dim}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 italic">
          AI-Augmented Performance Engineering by KPI99. These insights are generated using statistical analysis and pattern recognition.
        </p>
      </div>
    </div>
  )
}

