'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

interface MobileMenuProps {
  organizationId?: number
}

export default function MobileMenu({ organizationId }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/organizations/new', label: 'New Assessment' },
    { href: '/documentation', label: 'Documentation' },
    { href: '/about-ppi-f', label: 'About PPI-F' },
    { href: '/roi-calculator', label: 'ROI Calculator' },
  ]

  const allNavLinks = [
    ...navLinks,
    ...(organizationId ? [
      { href: `/organizations/${organizationId}/assessments`, label: 'Assessments' },
      { href: `/organizations/${organizationId}/analytics`, label: 'Analytics' },
    ] : [])
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden bg-transparent border-none text-2xl text-slate-700 cursor-pointer p-1"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        ☰
      </button>

      {isOpen && (
        <ul
          id="mobile-menu"
          className={`md:hidden absolute top-full left-0 right-0 bg-white flex-col p-5 shadow-[0_4px_20px_rgba(0,0,0,0.1)] gap-0 ${
            isOpen ? 'flex' : 'hidden'
          }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {allNavLinks.map((link, index) => {
            const active = isActive(link.href)
            const isLast = index === allNavLinks.length - 1
            return (
              <li
                key={link.href}
                className={`w-full py-3 ${!isLast ? 'border-b border-slate-200' : ''}`}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-slate-700 no-underline font-medium transition-colors ${
                    active ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}



