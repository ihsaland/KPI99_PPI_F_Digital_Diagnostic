'use client'

import React from 'react'

interface PPIFrameworkVisualizationProps {
  scores?: {
    performance?: number
    production_readiness?: number
    infrastructure_efficiency?: number
    failure_resilience?: number
  }
}

export default function PPIFrameworkVisualization({ scores }: PPIFrameworkVisualizationProps) {
  const dimensions = [
    {
      name: 'Performance',
      shortName: 'P',
      color: 'blue',
      description: 'System speed and optimization',
      score: scores?.performance
    },
    {
      name: 'Production Readiness',
      shortName: 'P',
      color: 'green',
      description: 'Deployment confidence and safety',
      score: scores?.production_readiness
    },
    {
      name: 'Infrastructure Efficiency',
      shortName: 'I',
      color: 'purple',
      description: 'Engineering economics and scalability',
      score: scores?.infrastructure_efficiency
    },
    {
      name: 'Failure Resilience',
      shortName: 'F',
      color: 'red',
      description: 'System reliability and recovery',
      score: scores?.failure_resilience
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-300',
    green: 'bg-green-100 text-green-600 border-green-300',
    purple: 'bg-purple-100 text-purple-600 border-purple-300',
    red: 'bg-red-100 text-red-600 border-red-300'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">PPI-F Framework</h3>
        <p className="text-slate-600">The four dimensions of engineering maturity</p>
      </div>

      {/* Framework Diagram */}
      <div className="relative mb-8">
        {/* Central Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-500 via-green-500 to-purple-500 rounded-full flex items-center justify-center z-10 shadow-lg">
          <div className="text-center text-white">
            <div className="text-3xl font-bold">PPI-F</div>
            <div className="text-xs opacity-90">Maturity</div>
          </div>
        </div>

        {/* Dimension Cards */}
        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
          {dimensions.map((dim, index) => {
            const positions = [
              { top: '0', left: '50%', transform: 'translateX(-50%)' }, // Top
              { top: '50%', right: '0', transform: 'translateY(-50%)' }, // Right
              { bottom: '0', left: '50%', transform: 'translateX(-50%)' }, // Bottom
              { top: '50%', left: '0', transform: 'translateY(-50%)' } // Left
            ]
            const position = positions[index]
            
            return (
              <div
                key={dim.name}
                className={`relative ${colorClasses[dim.color as keyof typeof colorClasses]} rounded-lg p-6 border-2 shadow-md`}
                style={{
                  position: 'relative',
                  ...(index === 0 && { marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }),
                  ...(index === 1 && { marginLeft: 'auto' }),
                  ...(index === 2 && { marginTop: 'auto', marginLeft: 'auto', marginRight: 'auto' }),
                  ...(index === 3 && { marginRight: 'auto' })
                }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{dim.shortName}</div>
                  <div className="font-semibold text-sm mb-1">{dim.name}</div>
                  <div className="text-xs opacity-75 mb-2">{dim.description}</div>
                  {dim.score !== undefined && (
                    <div className="mt-3 pt-3 border-t-2 border-current">
                      <div className="text-2xl font-bold">{dim.score.toFixed(1)}</div>
                      <div className="text-xs opacity-75">/ 5.0</div>
                    </div>
                  )}
                </div>
                
                {/* Connection Line */}
                <div
                  className="absolute w-24 h-0.5 bg-slate-300"
                  style={{
                    ...(index === 0 && { bottom: '-2rem', left: '50%', transform: 'translateX(-50%) rotate(90deg)' }),
                    ...(index === 1 && { left: '-6rem', top: '50%', transform: 'translateY(-50%)' }),
                    ...(index === 2 && { top: '-2rem', left: '50%', transform: 'translateX(-50%) rotate(90deg)' }),
                    ...(index === 3 && { right: '-6rem', top: '50%', transform: 'translateY(-50%)' })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Framework Description */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-3">Understanding the PPI-F Framework</h4>
        <p className="text-sm text-slate-600 mb-4">
          The PPI-F framework measures engineering maturity across four critical dimensions. Each dimension represents 
          a fundamental aspect of production system excellence:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-slate-900">Performance (P):</strong> How fast and efficient your systems are
          </div>
          <div>
            <strong className="text-slate-900">Production Readiness (P):</strong> How safely and confidently you deploy
          </div>
          <div>
            <strong className="text-slate-900">Infrastructure Efficiency (I):</strong> How cost-effectively you scale
          </div>
          <div>
            <strong className="text-slate-900">Failure Resilience (F):</strong> How gracefully you handle failures
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-4 italic">
          "Performance failures are business risks — until they are engineered." — KPI99
        </p>
      </div>
    </div>
  )
}


