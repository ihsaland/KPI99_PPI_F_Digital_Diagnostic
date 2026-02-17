import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper'
import Footer from '@/components/Footer'

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KPI99 PPI-F Digital Diagnostic Tool',
  description: 'Measure and improve your organization\'s Performance, Production Readiness, Infrastructure Efficiency, and Failure Resilience',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen">
          <ErrorBoundaryWrapper>
            {children}
          </ErrorBoundaryWrapper>
          <Footer />
        </div>
      </body>
    </html>
  )
}
