'use client'

import React from 'react'

interface PPIInsightsProps {
  scores: Array<{
    dimension: string
    maturity_score: number
  }>
  overallMaturity: number
}

export default function PPIInsights({ scores, overallMaturity }: PPIInsightsProps) {
  const DIMENSION_LABELS: Record<string, string> = {
    performance: 'Performance',
    production_readiness: 'Production Readiness',
    infrastructure_efficiency: 'Infrastructure Efficiency',
    failure_resilience: 'Failure Resilience',
  }

  // Find strongest and weakest dimensions
  const sortedScores = [...scores].sort((a, b) => b.maturity_score - a.maturity_score)
  const strongest = sortedScores[0]
  const weakest = sortedScores[sortedScores.length - 1]

  // Calculate dimension balance
  const avgScore = scores.reduce((sum, s) => sum + s.maturity_score, 0) / scores.length
  const variance = scores.reduce((sum, s) => sum + Math.pow(s.maturity_score - avgScore, 2), 0) / scores.length
  const isBalanced = variance < 0.5

  // PPI-F specific insights
  const insights = []

  // Overall maturity insight
  if (overallMaturity >= 4.0) {
    insights.push({
      type: 'excellent',
      title: 'Engineering Excellence',
      message: 'Your organization demonstrates best-in-class engineering maturity. Focus on maintaining excellence and sharing practices across teams.',
      icon: '🏆'
    })
  } else if (overallMaturity >= 3.5) {
    insights.push({
      type: 'good',
      title: 'Strong Engineering Foundation',
      message: 'You have a solid engineering foundation. Focus on addressing remaining gaps to reach excellence.',
      icon: '✅'
    })
  } else if (overallMaturity >= 3.0) {
    insights.push({
      type: 'fair',
      title: 'Good Base, Room for Improvement',
      message: 'You have a good base with clear improvement opportunities. Prioritize high-impact recommendations.',
      icon: '📈'
    })
  } else {
    insights.push({
      type: 'critical',
      title: 'Critical Gaps Identified',
      message: 'Significant gaps require immediate attention. Focus on critical blockers and high-priority recommendations.',
      icon: '⚠️'
    })
  }

  // Balance insight
  if (!isBalanced) {
    insights.push({
      type: 'warning',
      title: 'Unbalanced Maturity Profile',
      message: `Your ${DIMENSION_LABELS[weakest.dimension]} dimension (${weakest.maturity_score.toFixed(1)}/5.0) is significantly lower than your strongest dimension. Focus on bringing all dimensions to a similar level.`,
      icon: '⚖️'
    })
  } else {
    insights.push({
      type: 'good',
      title: 'Balanced Maturity Profile',
      message: 'Your dimensions are well-balanced, indicating consistent engineering practices across all areas.',
      icon: '⚖️'
    })
  }

  // Dimension-specific insights
  if (weakest.maturity_score < 2.0) {
    insights.push({
      type: 'critical',
      title: `Critical Gap in ${DIMENSION_LABELS[weakest.dimension]}`,
      message: `Your ${DIMENSION_LABELS[weakest.dimension]} dimension requires immediate attention. This is a critical blocker that limits your overall maturity.`,
      icon: '🚨'
    })
  }

  if (strongest.maturity_score >= 4.0 && weakest.maturity_score < 3.0) {
    insights.push({
      type: 'info',
      title: 'Leverage Your Strengths',
      message: `Your ${DIMENSION_LABELS[strongest.dimension]} practices (${strongest.maturity_score.toFixed(1)}/5.0) are excellent. Consider applying similar approaches to improve ${DIMENSION_LABELS[weakest.dimension]}.`,
      icon: '💡'
    })
  }

  const insightColors = {
    excellent: 'bg-green-50 border-green-200 text-green-800',
    good: 'bg-blue-50 border-blue-200 text-blue-800',
    fair: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-purple-50 border-purple-200 text-purple-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-2xl">💡</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">KPI99 PPI-F Insights</h2>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-lg ${insightColors[insight.type as keyof typeof insightColors]}`}
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3">{insight.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm opacity-90">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 italic">
          "Performance failures are business risks — until they are engineered." — KPI99
        </p>
      </div>
    </div>
  )
}

