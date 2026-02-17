'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  organizationId?: number
}

export default function Navigation({ organizationId }: NavigationProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/about-ppi-f', label: 'About PPI-F' },
    { href: '/documentation', label: 'Documentation' },
    { href: '/roi-calculator', label: 'ROI Calculator' },
  ]

  return (
    <>
      <ul className="hidden md:flex list-none gap-[30px] items-center" role="navigation" aria-label="Main navigation">
        {navLinks.map((link) => {
          const active = isActive(link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-link text-slate-700 no-underline font-medium transition-colors relative ${
                  active ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
        {organizationId && (
          <>
            <li className="w-px h-[30px] bg-slate-200 mx-[15px] p-0 list-none" />
            <li>
              <Link
                href={`/organizations/${organizationId}/assessments`}
                className={`nav-link text-slate-700 no-underline font-medium transition-colors relative ${
                  isActive(`/organizations/${organizationId}/assessments`)
                    ? 'text-blue-600'
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                Assessments
              </Link>
            </li>
            <li>
              <Link
                href={`/organizations/${organizationId}/analytics`}
                className={`nav-link text-slate-700 no-underline font-medium transition-colors relative ${
                  isActive(`/organizations/${organizationId}/analytics`)
                    ? 'text-blue-600'
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                Analytics
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  )
}

