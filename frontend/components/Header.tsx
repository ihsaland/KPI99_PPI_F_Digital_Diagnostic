'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

interface HeaderProps {
  organizationId?: number
}

export default function Header({ organizationId }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      id="mainNav"
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_4px_30px_rgba(0,0,0,0.15)]'
          : 'shadow-[0_2px_20px_rgba(0,0,0,0.1)]'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="container mx-auto max-w-[1200px] px-5 py-5">
        <div className="flex items-center justify-between nav-inner">
          <a
            href="https://kpi99.co/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="logo flex items-center h-10"
            aria-label="KPI99 home"
          >
            <img
              src="/menu_logo.png"
              alt="KPI99"
              className="h-10 w-auto max-w-[150px] object-contain block"
            />
          </a>
          <div className="flex items-center gap-5">
            <Navigation organizationId={organizationId} />
            <a
              href="https://kpi99.co/es/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-lang hidden md:inline-flex text-[#334155] font-semibold text-sm no-underline py-1.5 px-3 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-500/10"
            >
              Español
            </a>
            <MobileMenu organizationId={organizationId} />
          </div>
        </div>
      </div>
    </nav>
  )
}
