'use client'

import React, { useState, useEffect } from 'react'
import { assessmentsApi, Assessment } from '@/lib/api'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

interface ReportComparisonProps {
  organizationId: number
  currentAssessmentId: number
}

const DIMENSION_LABELS: Record<string, string> = {
  performance: 'Performance',
  production_readiness: 'Production Readiness',
  infrastructure_efficiency: 'Infrastructure Efficiency',
  failure_resilience: 'Failure Resilience',
}

export default function ReportComparison({ organizationId, currentAssessmentId }: ReportComparisonProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null)
  const [comparison, setComparison] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAssessments()
  }, [organizationId])

  const fetchAssessments = async () => {
    try {
      const response = await assessmentsApi.list(organizationId)
      const completed = response.data.filter((a: Assessment) => 
        a.status === 'completed' && a.id !== currentAssessmentId
      )
      setAssessments(completed)
    } catch (error: any) {
      toast.error('Failed to load assessments')
    }
  }

  const handleCompare = async () => {
    if (!selectedAssessmentId) {
      toast.error('Please select an assessment to compare')
      return
    }

    setLoading(true)
    try {
      const response = await assessmentsApi.compare(currentAssessmentId, selectedAssessmentId)
      setComparison(response.data)
    } catch (error: any) {
      toast.error('Failed to compare assessments')
    } finally {
      setLoading(false)
    }
  }

  if (assessments.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <p className="text-sm text-slate-600 text-center">
          No other completed assessments available for comparison.
          <br />
          Complete more assessments to enable comparison features.
        </p>
      </div>
    )
  }

  const chartData = comparison ? Object.keys(comparison.differences).map(dim => ({
    dimension: DIMENSION_LABELS[dim] || dim,
    current: comparison.assessment1.scores[dim] || 0,
    previous: comparison.assessment2.scores[dim] || 0,
    difference: comparison.differences[dim].difference,
  })) : []

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Compare Assessments</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Assessment to Compare
            </label>
            <select
              value={selectedAssessmentId || ''}
              onChange={(e) => setSelectedAssessmentId(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select Assessment --</option>
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.name} ({new Date(assessment.completed_at || assessment.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCompare}
            disabled={!selectedAssessmentId || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </div>

      {comparison && (
        <>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Comparison Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Current Assessment</h4>
                <p className="text-sm text-slate-600">{comparison.assessment1.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {comparison.assessment1.completed_at 
                    ? new Date(comparison.assessment1.completed_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Previous Assessment</h4>
                <p className="text-sm text-slate-600">{comparison.assessment2.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {comparison.assessment2.completed_at 
                    ? new Date(comparison.assessment2.completed_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="Current Assessment" />
                <Bar dataKey="previous" fill="#94a3b8" name="Previous Assessment" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Differences</h3>
            <div className="space-y-3">
              {Object.values(comparison.differences).map((diff: any) => (
                <div
                  key={diff.dimension}
                  className="p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">
                      {DIMENSION_LABELS[diff.dimension] || diff.dimension}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      diff.difference > 0
                        ? 'bg-green-100 text-green-700'
                        : diff.difference < 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {diff.difference > 0 ? '+' : ''}{diff.difference.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Current: </span>
                      <span className="font-semibold">{diff.score1.toFixed(2)}/5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Previous: </span>
                      <span className="font-semibold">{diff.score2.toFixed(2)}/5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Change: </span>
                      <span className="font-semibold">
                        {diff.percentage_change > 0 ? '+' : ''}{diff.percentage_change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}




