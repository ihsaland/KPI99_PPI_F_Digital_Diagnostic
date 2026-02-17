import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <img
          src="/menu_logo.png"
          alt="KPI99"
          className="h-full w-auto max-w-[150px] object-contain block"
        />
      </div>
      {showText && (
        <div className="ml-3">
          <h1 className={`${textSizes[size]} font-bold text-slate-900`}>KPI99</h1>
          <p className="text-xs text-slate-500">PPI-F Diagnostic</p>
        </div>
      )}
    </div>
  )
}

