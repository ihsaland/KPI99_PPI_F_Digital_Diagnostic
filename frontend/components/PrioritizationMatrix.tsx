'use client'

import React from 'react'
import { Recommendation } from '@/lib/api'

interface PrioritizationMatrixProps {
  recommendations: Recommendation[]
  onStatusChange?: (recommendationId: number, status: string) => void
}

export default function PrioritizationMatrix({ recommendations, onStatusChange }: PrioritizationMatrixProps) {
  const getEffortValue = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'low': return 1
      case 'medium': return 2
      case 'high': return 3
      default: return 2
    }
  }

  const getImpactValue = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'low': return 1
      case 'medium': return 2
      case 'high': return 3
      default: return 2
    }
  }

  const getQuadrant = (effort: string, impact: string) => {
    const effortVal = getEffortValue(effort)
    const impactVal = getImpactValue(impact)
    
    if (impactVal >= 2 && effortVal <= 2) return 'quick-wins'
    if (impactVal >= 2 && effortVal >= 2) return 'major-projects'
    if (impactVal <= 2 && effortVal <= 2) return 'fill-ins'
    return 'thankless-tasks'
  }

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'quick-wins': return 'bg-green-100 border-green-300'
      case 'major-projects': return 'bg-blue-100 border-blue-300'
      case 'fill-ins': return 'bg-yellow-100 border-yellow-300'
      case 'thankless-tasks': return 'bg-red-100 border-red-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case 'quick-wins': return 'Quick Wins'
      case 'major-projects': return 'Major Projects'
      case 'fill-ins': return 'Fill-ins'
      case 'thankless-tasks': return 'Thankless Tasks'
      default: return 'Other'
    }
  }

  const quadrants = {
    'quick-wins': [] as Recommendation[],
    'major-projects': [] as Recommendation[],
    'fill-ins': [] as Recommendation[],
    'thankless-tasks': [] as Recommendation[],
  }

  recommendations.forEach(rec => {
    const quadrant = getQuadrant(rec.effort, rec.impact)
    quadrants[quadrant as keyof typeof quadrants].push(rec)
  })

  return (
    <div className="space-y-6">
      {/* Matrix Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Effort vs Impact Matrix</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Quick Wins */}
          <div className={`${getQuadrantColor('quick-wins')} rounded-lg p-4 border-2 min-h-[200px]`}>
            <h4 className="font-semibold text-slate-900 mb-2">Quick Wins</h4>
            <p className="text-xs text-slate-600 mb-3">High Impact, Low Effort</p>
            <div className="space-y-2">
              {quadrants['quick-wins'].map(rec => (
                <div key={rec.id} className="bg-white rounded p-2 text-sm">
                  <div className="font-medium text-slate-900">{rec.title}</div>
                  <div className="text-xs text-slate-600">{rec.timeline} days</div>
                </div>
              ))}
              {quadrants['quick-wins'].length === 0 && (
                <p className="text-xs text-slate-500 italic">No recommendations</p>
              )}
            </div>
          </div>

          {/* Major Projects */}
          <div className={`${getQuadrantColor('major-projects')} rounded-lg p-4 border-2 min-h-[200px]`}>
            <h4 className="font-semibold text-slate-900 mb-2">Major Projects</h4>
            <p className="text-xs text-slate-600 mb-3">High Impact, High Effort</p>
            <div className="space-y-2">
              {quadrants['major-projects'].map(rec => (
                <div key={rec.id} className="bg-white rounded p-2 text-sm">
                  <div className="font-medium text-slate-900">{rec.title}</div>
                  <div className="text-xs text-slate-600">{rec.timeline} days</div>
                </div>
              ))}
              {quadrants['major-projects'].length === 0 && (
                <p className="text-xs text-slate-500 italic">No recommendations</p>
              )}
            </div>
          </div>

          {/* Fill-ins */}
          <div className={`${getQuadrantColor('fill-ins')} rounded-lg p-4 border-2 min-h-[200px]`}>
            <h4 className="font-semibold text-slate-900 mb-2">Fill-ins</h4>
            <p className="text-xs text-slate-600 mb-3">Low Impact, Low Effort</p>
            <div className="space-y-2">
              {quadrants['fill-ins'].map(rec => (
                <div key={rec.id} className="bg-white rounded p-2 text-sm">
                  <div className="font-medium text-slate-900">{rec.title}</div>
                  <div className="text-xs text-slate-600">{rec.timeline} days</div>
                </div>
              ))}
              {quadrants['fill-ins'].length === 0 && (
                <p className="text-xs text-slate-500 italic">No recommendations</p>
              )}
            </div>
          </div>

          {/* Thankless Tasks */}
          <div className={`${getQuadrantColor('thankless-tasks')} rounded-lg p-4 border-2 min-h-[200px]`}>
            <h4 className="font-semibold text-slate-900 mb-2">Thankless Tasks</h4>
            <p className="text-xs text-slate-600 mb-3">Low Impact, High Effort</p>
            <div className="space-y-2">
              {quadrants['thankless-tasks'].map(rec => (
                <div key={rec.id} className="bg-white rounded p-2 text-sm">
                  <div className="font-medium text-slate-900">{rec.title}</div>
                  <div className="text-xs text-slate-600">{rec.timeline} days</div>
                </div>
              ))}
              {quadrants['thankless-tasks'].length === 0 && (
                <p className="text-xs text-slate-500 italic">No recommendations</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed List with Status Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommendations with Status Tracking</h3>
        <div className="space-y-3">
          {recommendations.map(rec => {
            const quadrant = getQuadrant(rec.effort, rec.impact)
            return (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border-2 ${getQuadrantColor(quadrant)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-white/50 text-slate-600">
                        {getQuadrantLabel(quadrant)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{rec.description}</p>
                    <div className="flex gap-3 text-xs">
                      <span className="px-2 py-1 rounded bg-white/50">
                        Effort: <strong>{rec.effort}</strong>
                      </span>
                      <span className="px-2 py-1 rounded bg-white/50">
                        Impact: <strong>{rec.impact}</strong>
                      </span>
                      <span className="px-2 py-1 rounded bg-white/50">
                        Timeline: <strong>{rec.timeline} days</strong>
                      </span>
                    </div>
                  </div>
                  {onStatusChange && (
                    <select
                      value={rec.status || 'pending'}
                      onChange={(e) => onStatusChange(rec.id, e.target.value)}
                      className="ml-4 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="skipped">Skipped</option>
                    </select>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}




