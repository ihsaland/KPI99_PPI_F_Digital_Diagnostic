'use client'

import React from 'react'

interface ProgressIndicatorProps {
  scores: Array<{
    dimension: string
    maturity_score: number
    percentage: number
  }>
}

export default function ProgressIndicator({ scores }: ProgressIndicatorProps) {
  const getStatusColor = (score: number) => {
    if (score >= 4.0) return 'bg-green-500'
    if (score >= 3.0) return 'bg-yellow-400'
    if (score >= 2.0) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const getStatusLabel = (score: number) => {
    if (score >= 4.0) return 'Excellent'
    if (score >= 3.0) return 'Good'
    if (score >= 2.0) return 'Fair'
    if (score >= 1.0) return 'Poor'
    return 'Critical'
  }

  return (
    <div className="space-y-4">
      {scores.map((score) => (
        <div key={score.dimension} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              {score.dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                {(score.maturity_score ?? 0).toFixed(1)}/5.0
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                score.maturity_score >= 4.0 ? 'bg-green-100 text-green-700' :
                score.maturity_score >= 3.0 ? 'bg-yellow-100 text-yellow-700' :
                score.maturity_score >= 2.0 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {getStatusLabel(score.maturity_score)}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getStatusColor(score.maturity_score)} transition-all duration-500 rounded-full`}
              style={{ width: `${score.percentage}%` }}
            />
          </div>
          <div className="text-xs text-slate-500">
            {(score.percentage ?? 0).toFixed(0)}% of maximum score
          </div>
        </div>
      ))}
    </div>
  )
}



