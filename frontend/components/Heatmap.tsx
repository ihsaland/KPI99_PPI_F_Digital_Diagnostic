'use client'

import React from 'react'

interface HeatmapProps {
  scores: Array<{
    dimension: string
    maturity_score: number
    percentage: number
  }>
  onCellClick?: (dimension: string) => void
}

export default function Heatmap({ scores, onCellClick }: HeatmapProps) {
  const getColor = (score: number) => {
    if (score >= 4.0) return 'bg-green-500'
    if (score >= 3.0) return 'bg-yellow-400'
    if (score >= 2.0) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const getIntensity = (score: number) => {
    if (score >= 4.0) return 'opacity-100'
    if (score >= 3.0) return 'opacity-90'
    if (score >= 2.0) return 'opacity-80'
    return 'opacity-70'
  }

  const getLabel = (score: number) => {
    if (score >= 4.0) return 'Excellent'
    if (score >= 3.0) return 'Good'
    if (score >= 2.0) return 'Fair'
    if (score >= 1.0) return 'Poor'
    return 'Critical'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {scores.map((score) => (
        <div
          key={score.dimension}
          onClick={() => onCellClick?.(score.dimension)}
          className={`${getColor(score.maturity_score)} ${getIntensity(score.maturity_score)} rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg ${
            onCellClick ? 'hover:shadow-xl' : ''
          }`}
        >
          <div className="text-sm font-medium opacity-90 mb-2">
            {score.dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          <div className="text-3xl font-bold mb-1">{(score.maturity_score ?? 0).toFixed(1)}</div>
          <div className="text-sm opacity-90">{(score.percentage ?? 0).toFixed(0)}%</div>
          <div className="text-xs mt-2 opacity-75">{getLabel(score.maturity_score)}</div>
        </div>
      ))}
    </div>
  )
}



