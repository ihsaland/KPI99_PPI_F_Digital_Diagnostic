'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'

export default function AboutPPIFPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Header />

      {/* Header Image */}
      <PanAbstract
        title="The AI-Augmented PPI-F Framework"
        subtitle="Performance failures are business risks — until they are engineered. Enhanced with AI-powered diagnostics."
        variant="pattern"
      />

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-12" role="main">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The PPI-F (Performance, Production Readiness, Infrastructure Efficiency, Failure Resilience) framework 
              is KPI99's AI-Augmented Performance Engineering approach to measuring and improving digital system maturity 
              with intelligent diagnostics, predictive insights, and workload optimization.
            </p>
          </div>

          {/* Framework Philosophy */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Framework Philosophy</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                The PPI-F framework was created by KPI99 to address a fundamental truth: <strong className="text-slate-900">performance failures 
                are business risks until they are engineered.</strong> Traditional maturity models often focus on process and compliance, 
                but PPI-F takes an engineering-first approach, measuring what actually matters for production systems.
              </p>
              <p>
                Unlike generic maturity assessments, PPI-F is specifically designed for engineering teams building and operating 
                digital systems. It measures the four dimensions that directly impact system reliability, user experience, and 
                business outcomes.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
                <p className="text-slate-700">
                  <strong className="text-slate-900">KPI99's Core Belief:</strong> Engineering maturity isn't about following 
                  processes—it's about building systems that perform reliably, scale efficiently, and recover gracefully from failures.
                </p>
              </div>
            </div>
          </section>

          {/* Why PPI-F Matters */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why PPI-F Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Engineering-First Approach</h3>
                <p className="text-slate-600">
                  PPI-F measures what engineers actually control: system performance, deployment practices, infrastructure 
                  efficiency, and failure handling. No abstract processes—just concrete, measurable engineering practices.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Business Impact Focus</h3>
                <p className="text-slate-600">
                  Every dimension directly impacts business outcomes: user experience, operational costs, system reliability, 
                  and revenue protection. PPI-F connects engineering maturity to business value.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Augmented Insights</h3>
                <p className="text-slate-600">
                  PPI-F doesn't just measure—it provides AI-powered anomaly detection, predictive capacity forecasting, 
                  and intelligently prioritized recommendations with effort, impact, and timeline estimates. Every finding 
                  comes with a clear path to improvement enhanced by machine learning.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Continuous Improvement</h3>
                <p className="text-slate-600">
                  Track progress over time, compare assessments, and measure improvement velocity. PPI-F is designed for 
                  iterative engineering excellence.
                </p>
              </div>
            </div>
          </section>

          {/* The Four Dimensions */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Four PPI-F Dimensions</h2>
            <div className="space-y-8">
              {/* Performance */}
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">Performance</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">Why it matters:</strong> Performance directly impacts user experience, 
                  conversion rates, and operational costs. Slow systems lose users, waste resources, and damage brand reputation.
                </p>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">What we measure:</strong> Response times, throughput, bottleneck identification, 
                  monitoring capabilities, performance budgets, and optimization techniques. Enhanced with AI-powered anomaly detection 
                  and ML-based regression detection.
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">PPI-F perspective:</strong> Performance isn't just about speed—it's about 
                  understanding system behavior, identifying constraints, and engineering solutions that scale. AI-augmented diagnostics 
                  help proactively identify performance issues before they impact users.
                </p>
              </div>

              {/* Production Readiness */}
              <div className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">Production Readiness</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">Why it matters:</strong> Production readiness determines deployment safety, 
                  incident response speed, and system reliability. Unprepared systems fail in production.
                </p>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">What we measure:</strong> SLOs, deployment strategies, rollback capabilities, 
                  runbooks, change management, configuration management, and testing coverage.
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">PPI-F perspective:</strong> Production readiness is about engineering confidence— 
                  knowing that your systems can be deployed safely, monitored effectively, and recovered quickly when things go wrong.
                </p>
              </div>

              {/* Infrastructure Efficiency */}
              <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">Infrastructure Efficiency</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">Why it matters:</strong> Infrastructure efficiency directly impacts operational 
                  costs, scalability, and resource utilization. Inefficient infrastructure wastes money and limits growth.
                </p>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">What we measure:</strong> Capacity management, cost monitoring, resource utilization, 
                  optimization strategies, infrastructure as code, and cost allocation. Enhanced with AI-driven predictive capacity 
                  forecasting and cost trajectory modeling.
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">PPI-F perspective:</strong> Infrastructure efficiency is about engineering economics— 
                  building systems that scale cost-effectively, optimize resource usage, and provide clear cost visibility. AI-powered 
                  capacity and cost modeling help forecast demand and optimize spending.
                </p>
              </div>

              {/* Failure Resilience */}
              <div className="border-l-4 border-red-500 pl-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">Failure Resilience</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">Why it matters:</strong> Failure resilience determines system availability, 
                  data protection, and business continuity. Systems that can't handle failures cause outages and data loss.
                </p>
                <p className="text-slate-600 mb-4">
                  <strong className="text-slate-900">What we measure:</strong> High availability strategies, disaster recovery, RTO/RPO, 
                  cascading failure prevention, backup and recovery, failure testing, and incident response.
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">PPI-F perspective:</strong> Failure resilience is about engineering reliability— 
                  building systems that fail gracefully, recover quickly, and protect data integrity when things go wrong.
                </p>
              </div>
            </div>
          </section>

          {/* How PPI-F Differs */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How PPI-F Differs from Other Frameworks</h2>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Engineering-First vs. Process-First</h3>
                <p className="text-slate-600">
                  Most maturity models measure processes, documentation, and compliance. PPI-F measures engineering practices, 
                  system capabilities, and operational outcomes. We care about what your systems can do, not just what processes 
                  you follow.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Four Focused Dimensions vs. Broad Coverage</h3>
                <p className="text-slate-600">
                  PPI-F focuses on four critical dimensions that directly impact production systems. Rather than trying to measure 
                  everything, we measure what matters most for engineering excellence.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Augmented Recommendations vs. Generic Advice</h3>
                <p className="text-slate-600">
                  Every PPI-F assessment provides AI-powered, intelligently prioritized recommendations with effort estimates, impact analysis, 
                  and timeline guidance. Machine learning enhances prioritization based on workload patterns and historical data. No generic 
                  "improve X"—just specific, engineering-focused improvements powered by AI insights.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Continuous Improvement vs. One-Time Assessment</h3>
                <p className="text-slate-600">
                  PPI-F is designed for iterative improvement. Track progress over time, compare assessments, measure velocity, 
                  and celebrate milestones. Engineering maturity is a journey, not a destination.
                </p>
              </div>
            </div>
          </section>

          {/* KPI99 Approach */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The KPI99 Approach</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                KPI99 created the AI-Augmented PPI-F framework based on years of experience helping engineering teams build and operate 
                production systems. We've seen what works, what doesn't, and what actually matters for system reliability 
                and business outcomes. Our AI integration enhances traditional diagnostics with intelligent anomaly detection, 
                predictive insights, and workload optimization.
              </p>
              <p>
                Our philosophy is simple: <strong className="text-slate-900">performance failures are business risks until they are engineered.</strong> 
                The AI-Augmented PPI-F framework helps engineering teams identify gaps, prioritize improvements with machine learning, 
                and track progress toward engineering excellence with predictive analytics.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 mt-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">KPI99's AI-Augmented Commitment</h3>
                <p className="text-slate-700">
                  We're committed to helping engineering teams build better systems through AI-Augmented Performance Engineering. 
                  The PPI-F framework enhanced with AI diagnostics is our contribution to the engineering community—a practical, 
                  actionable approach to measuring and improving engineering maturity that actually works in production, powered 
                  by intelligent insights and predictive analytics.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Assess Your Engineering Maturity?</h2>
            <p className="text-xl mb-6 opacity-90">
              Start your AI-Augmented PPI-F Diagnostic and discover how your systems measure up with intelligent insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/organizations/new"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-all shadow-lg"
              >
                Start AI-Augmented Diagnostic
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/documentation"
                className="inline-flex items-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all"
              >
                Learn How to Use It
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

