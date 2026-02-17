'use client'

import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface RadarChartProps {
  data: Array<{
    dimension: string
    maturity: number
  }>
}

export default function RadarChartComponent({ data }: RadarChartProps) {
  const chartData = data.map(item => ({
    dimension: item.dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: item.maturity,
    fullMark: 5,
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: '#94a3b8', fontSize: 10 }}
        />
        <Radar
          name="Maturity Score"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          formatter={(value: number) => [`${value.toFixed(2)}/5.0`, 'Maturity Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}




