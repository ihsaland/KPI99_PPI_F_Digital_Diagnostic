'use client'

import React from 'react'

interface PanAbstractProps {
  title: string
  subtitle?: string
  variant?: 'default' | 'gradient' | 'pattern'
}

export default function PanAbstract({ title, subtitle }: PanAbstractProps) {
  return (
    <header className="hero relative overflow-hidden text-white text-center">
      <div className="absolute inset-0 bg-black/30 z-0" aria-hidden />
      <div className="container mx-auto max-w-[1200px] px-5 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2.5 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="tagline text-lg md:text-xl font-medium opacity-95 max-w-[560px] mx-auto mt-5">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
