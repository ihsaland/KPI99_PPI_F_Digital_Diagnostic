'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TrendData {
  assessment_id: number
  assessment_name: string
  completed_at: string | null
  overall_maturity: number
  dimension_scores: Record<string, number>
}

interface TrendAnalysisProps {
  trends: TrendData[]
}

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

export default function TrendAnalysis({ trends }: TrendAnalysisProps) {
  if (trends.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-center">
        <p className="text-slate-600">No trend data available. Complete more assessments to see trends.</p>
      </div>
    )
  }

  // Prepare data for overall maturity trend
  const overallData = trends.map((trend, index) => ({
    name: trend.assessment_name.length > 20 
      ? `${trend.assessment_name.substring(0, 20)}...` 
      : trend.assessment_name,
    date: trend.completed_at 
      ? new Date(trend.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : `Assessment ${index + 1}`,
    maturity: parseFloat(trend.overall_maturity.toFixed(2)),
  }))

  // Prepare data for dimension trends
  const dimensions = ['performance', 'production_readiness', 'infrastructure_efficiency', 'failure_resilience']
  const dimensionData = trends.map((trend, index) => {
    const data: any = {
      name: trend.assessment_name.length > 15 
        ? `${trend.assessment_name.substring(0, 15)}...` 
        : trend.assessment_name,
      date: trend.completed_at 
        ? new Date(trend.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : `Assessment ${index + 1}`,
    }
    dimensions.forEach(dim => {
      data[dim] = parseFloat((trend.dimension_scores[dim] || 0).toFixed(2))
    })
    return data
  })

  return (
    <div className="space-y-6">
      {/* Overall Maturity Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Maturity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={overallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#475569', fontSize: 12 }}
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
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="maturity" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Overall Maturity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dimension Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Dimension Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dimensionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#475569', fontSize: 12 }}
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
            />
            <Legend />
            {dimensions.map(dim => (
              <Line
                key={dim}
                type="monotone"
                dataKey={dim}
                stroke={DIMENSION_COLORS[dim]}
                strokeWidth={2}
                dot={{ fill: DIMENSION_COLORS[dim], r: 4 }}
                name={DIMENSION_LABELS[dim]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trends.length >= 2 && (
          <>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Latest Score</div>
              <div className="text-2xl font-bold text-slate-900">
                {trends[trends.length - 1].overall_maturity.toFixed(2)}/5.0
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Previous Score</div>
              <div className="text-2xl font-bold text-slate-900">
                {trends[trends.length - 2].overall_maturity.toFixed(2)}/5.0
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Change</div>
              <div className={`text-2xl font-bold ${
                trends[trends.length - 1].overall_maturity > trends[trends.length - 2].overall_maturity
                  ? 'text-green-600'
                  : trends[trends.length - 1].overall_maturity < trends[trends.length - 2].overall_maturity
                  ? 'text-red-600'
                  : 'text-slate-600'
              }`}>
                {trends[trends.length - 1].overall_maturity > trends[trends.length - 2].overall_maturity ? '+' : ''}
                {(trends[trends.length - 1].overall_maturity - trends[trends.length - 2].overall_maturity).toFixed(2)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}




