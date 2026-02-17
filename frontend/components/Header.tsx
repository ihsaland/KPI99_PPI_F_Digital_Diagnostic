'use client'

import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

interface HeaderProps {
  organizationId?: number
}

export default function Header({ organizationId }: HeaderProps) {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-[10px] shadow-[0_2px_20px_rgba(0,0,0,0.1)] z-[1000] transition-all duration-300">
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center h-10">
            <Link href="/">
              <Logo size="md" showText={false} />
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <Navigation organizationId={organizationId} />
            <MobileMenu organizationId={organizationId} />
          </div>
        </div>
      </div>
    </nav>
  )
}

