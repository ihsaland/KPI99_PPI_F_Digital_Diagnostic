'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Header />

      {/* Header Image */}
      <PanAbstract
        title="Documentation"
        subtitle="Complete guide to using the KPI99 AI-Augmented PPI-F Digital Diagnostic Tool"
        variant="default"
      />

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-12" role="main">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">How to Use the KPI99 AI-Augmented PPI-F Digital Diagnostic Tool</h1>
            <p className="text-lg text-slate-600 mb-8">
              This guide will walk you through using the AI-enhanced application to assess your organization's engineering maturity 
              with intelligent diagnostics, predictive insights, and workload optimization recommendations.
            </p>

            {/* Table of Contents */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#ppi-f-framework" className="text-blue-600 hover:text-blue-700 hover:underline">1. The PPI-F Framework</a></li>
                <li><a href="#getting-started" className="text-blue-600 hover:text-blue-700 hover:underline">2. Getting Started</a></li>
                <li><a href="#creating-assessment" className="text-blue-600 hover:text-blue-700 hover:underline">3. Creating Your First Assessment</a></li>
                <li><a href="#completing-assessment" className="text-blue-600 hover:text-blue-700 hover:underline">4. Completing an Assessment</a></li>
                <li><a href="#viewing-results" className="text-blue-600 hover:text-blue-700 hover:underline">5. Viewing Results</a></li>
                <li><a href="#understanding-scores" className="text-blue-600 hover:text-blue-700 hover:underline">6. Understanding Scoring Scale</a></li>
                <li><a href="#understanding-reports" className="text-blue-600 hover:text-blue-700 hover:underline">7. Understanding Reports</a></li>
                <li><a href="#ai-capabilities" className="text-blue-600 hover:text-blue-700 hover:underline">8. AI-Augmented Capabilities</a></li>
                <li><a href="#advanced-features" className="text-blue-600 hover:text-blue-700 hover:underline">9. Advanced Features</a></li>
                <li><a href="#tips" className="text-blue-600 hover:text-blue-700 hover:underline">10. Tips and Best Practices</a></li>
                <li><a href="#success-stories" className="text-blue-600 hover:text-blue-700 hover:underline">11. PPI-F Success Stories</a></li>
                <li><a href="#resources" className="text-blue-600 hover:text-blue-700 hover:underline">12. KPI99 Resources</a></li>
              </ul>
            </div>
          </div>

          {/* PPI-F Framework Section */}
          <section id="ppi-f-framework" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The PPI-F Framework</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">What is PPI-F?</h3>
                <p className="text-slate-600 mb-4">
                  PPI-F (Performance, Production Readiness, Infrastructure Efficiency, Failure Resilience) is KPI99's 
                  AI-Augmented Performance Engineering framework for measuring and improving digital system maturity. Enhanced with 
                  intelligent diagnostics, predictive analytics, and workload optimization, PPI-F measures what engineers actually 
                  control: system capabilities, operational practices, and engineering outcomes—all powered by machine learning insights.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-slate-700">
                    <strong className="text-slate-900">KPI99's Philosophy:</strong> Performance failures are business risks — 
                    until they are engineered. The AI-Augmented PPI-F framework helps engineering teams identify gaps with intelligent 
                    anomaly detection, prioritize improvements with ML-powered recommendations, and track progress toward engineering 
                    excellence with predictive analytics.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">The Four Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-600 mb-2">Performance (P)</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">What it measures:</strong> System speed, throughput, bottleneck identification, monitoring capabilities, performance budgets, and optimization techniques. Enhanced with AI-powered anomaly detection and ML-based regression detection.
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">Why it matters:</strong> Performance directly impacts user experience, conversion rates, and operational costs. Slow systems lose users, waste resources, and damage brand reputation. AI diagnostics help proactively identify issues before they impact users.
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong className="text-slate-900">PPI-F perspective:</strong> Performance isn't just about speed—it's about understanding system behavior, identifying constraints, and engineering solutions that scale. AI-augmented diagnostics provide intelligent insights into workload patterns and optimization opportunities.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-600 mb-2">Production Readiness (P)</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">What it measures:</strong> SLOs, deployment strategies, rollback capabilities, runbooks, change management, configuration management, and testing coverage.
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">Why it matters:</strong> Production readiness determines deployment safety, incident response speed, and system reliability. Unprepared systems fail in production.
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong className="text-slate-900">PPI-F perspective:</strong> Production readiness is about engineering confidence—knowing that your systems can be deployed safely, monitored effectively, and recovered quickly when things go wrong.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-600 mb-2">Infrastructure Efficiency (I)</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">What it measures:</strong> Capacity management, cost monitoring, resource utilization, optimization strategies, infrastructure as code, and cost allocation. Enhanced with AI-driven predictive capacity forecasting and cost trajectory modeling.
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">What it measures:</strong> Capacity management, cost monitoring, resource utilization, optimization strategies, infrastructure as code, and cost allocation.
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">Why it matters:</strong> Infrastructure efficiency directly impacts operational costs, scalability, and resource utilization. Inefficient infrastructure wastes money and limits growth.
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong className="text-slate-900">PPI-F perspective:</strong> Infrastructure efficiency is about engineering economics—building systems that scale cost-effectively, optimize resource usage, and provide clear cost visibility. AI-driven predictive capacity and cost modeling help forecast demand and optimize spending.
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-600 mb-2">Failure Resilience (F)</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">What it measures:</strong> High availability strategies, disaster recovery, RTO/RPO, cascading failure prevention, backup and recovery, failure testing, and incident response.
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong className="text-slate-900">Why it matters:</strong> Failure resilience determines system availability, data protection, and business continuity. Systems that can't handle failures cause outages and data loss.
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong className="text-slate-900">PPI-F perspective:</strong> Failure resilience is about engineering reliability—building systems that fail gracefully, recover quickly, and protect data integrity when things go wrong.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">How PPI-F Differs</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li><strong className="text-slate-900">Engineering-First:</strong> Measures engineering practices and system capabilities, not just processes</li>
                  <li><strong className="text-slate-900">Four Focused Dimensions:</strong> Concentrates on what matters most for production systems</li>
                  <li><strong className="text-slate-900">Actionable Recommendations:</strong> Provides prioritized, engineering-focused improvements with effort and impact estimates</li>
                  <li><strong className="text-slate-900">Continuous Improvement:</strong> Designed for iterative progress tracking and velocity measurement</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Learn More About PPI-F</h3>
                <p className="text-slate-600 mb-4">
                  Want to understand the PPI-F framework in depth? Visit our comprehensive guide to learn about the framework 
                  philosophy, methodology, and how it helps engineering teams build better systems.
                </p>
                <Link
                  href="/about-ppi-f"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Explore PPI-F Framework
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Getting Started</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Start the Application</h3>
                <p className="text-slate-600 mb-4">Make sure both the backend and frontend servers are running:</p>
                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2">Backend (Terminal 1):</p>
                  <code className="text-sm text-slate-700 block">cd backend<br />source venv/bin/activate<br />python run.py</code>
                  <p className="text-sm text-slate-600 mt-2">The backend will run on <code className="bg-slate-200 px-1 rounded">http://localhost:8001</code></p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2">Frontend (Terminal 2):</p>
                  <code className="text-sm text-slate-700 block">cd frontend<br />npm run dev</code>
                  <p className="text-sm text-slate-600 mt-2">The frontend will run on <code className="bg-slate-200 px-1 rounded">http://localhost:3000</code></p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Open the Application</h3>
                <p className="text-slate-600 mb-4">Open your browser and navigate to: <strong className="text-slate-900">http://localhost:3000</strong></p>
                <p className="text-slate-600">You'll see the home page with:</p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>A hero section explaining the tool</li>
                  <li>PPI-F dimensions overview (Performance, Production Readiness, Infrastructure Efficiency, Failure Resilience)</li>
                  <li>Organizations section</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Creating Assessment */}
          <section id="creating-assessment" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Creating Your First Assessment</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Step 1: Create an Organization</h3>
                <ol className="list-decimal list-inside text-slate-600 space-y-2">
                  <li>On the home page, click <strong className="text-slate-900">"Start Your First Assessment"</strong> or <strong className="text-slate-900">"New Assessment"</strong> in the navigation</li>
                  <li>You'll be taken to the "Create Organization" page</li>
                  <li>Fill in:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><strong>Organization Name</strong>: Your company or team name (required)</li>
                      <li><strong>Domain</strong>: Your organization's domain (optional)</li>
                    </ul>
                  </li>
                  <li>Click <strong className="text-slate-900">"Create Organization"</strong></li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Step 2: Create an Assessment</h3>
                <ol className="list-decimal list-inside text-slate-600 space-y-2">
                  <li>After creating an organization, you'll be redirected to the organization's assessments page</li>
                  <li>Click <strong className="text-slate-900">"Create New Assessment"</strong></li>
                  <li>Fill in:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><strong>Assessment Name</strong>: e.g., "Q1 2024 Engineering Maturity Assessment"</li>
                      <li><strong>Version</strong>: Optional version identifier (defaults to "1.0")</li>
                    </ul>
                  </li>
                  <li>Click <strong className="text-slate-900">"Create Assessment"</strong></li>
                </ol>
              </div>
            </div>
          </section>

          {/* Completing Assessment */}
          <section id="completing-assessment" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Completing an Assessment</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Understanding the Assessment Interface</h3>
                <p className="text-slate-600 mb-4">Once you create a PPI-F Diagnostic, you'll see the assessment questionnaire page with:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li><strong className="text-slate-900">PPI-F Progress Indicators</strong>: Shows your progress for each of the four PPI-F dimensions and overall maturity</li>
                  <li><strong className="text-slate-900">Question Navigation Sidebar</strong>: Lists all questions organized by PPI-F dimension</li>
                  <li><strong className="text-slate-900">Current Question</strong>: The PPI-F question you're currently answering</li>
                  <li><strong className="text-slate-900">Answer Options</strong>: Different input types depending on the question:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><strong>Single Select</strong>: Radio buttons</li>
                      <li><strong>Multi Select</strong>: Checkboxes</li>
                      <li><strong>Numeric</strong>: Number input</li>
                      <li><strong>Free Text</strong>: Text area</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Answering Questions</h3>
                <ol className="list-decimal list-inside text-slate-600 space-y-2">
                  <li><strong className="text-slate-900">Read the question carefully</strong> - Each PPI-F question is designed to assess a specific aspect of your engineering maturity within one of the four dimensions</li>
                  <li><strong className="text-slate-900">Select or enter your answer</strong> based on your current practices</li>
                  <li><strong className="text-slate-900">Auto-save</strong>: Your answers are automatically saved as you progress</li>
                  <li><strong className="text-slate-900">Navigate between questions</strong>:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Use <strong>Previous</strong> and <strong>Next</strong> buttons</li>
                      <li>Click on any question in the sidebar to jump to it</li>
                      <li>Use the search/filter to find specific questions</li>
                    </ul>
                  </li>
                  <li><strong className="text-slate-900">Critical Questions</strong>: Some questions are marked as critical - make sure to answer these</li>
                  <li><strong className="text-slate-900">Validation</strong>: The system will prevent you from completing the assessment if critical questions are unanswered</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Completing the Assessment</h3>
                <ol className="list-decimal list-inside text-slate-600 space-y-2">
                  <li>Once you've answered all questions (or at least all critical ones), click <strong className="text-slate-900">"Complete Assessment"</strong></li>
                  <li>The system will:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>Calculate maturity scores for each dimension</li>
                      <li>Generate findings based on your answers</li>
                      <li>Create AI-powered, intelligently prioritized recommendations</li>
                      <li>Calculate overall maturity score and risk level</li>
                      <li>Run AI diagnostics for anomaly detection and predictive insights</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Viewing Results */}
          <section id="viewing-results" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Viewing Results</h2>
            
            <p className="text-slate-600 mb-6">After completing an assessment, you'll see the AI-Augmented results page with:</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Executive Summary</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li><strong className="text-slate-900">Overall Maturity Score</strong>: 0-5 scale</li>
                  <li><strong className="text-slate-900">Risk Level</strong>: Low, Medium, High, or Critical</li>
                  <li><strong className="text-slate-900">Cost Leakage Estimate</strong>: Estimated financial impact</li>
                  <li><strong className="text-slate-900">Key Insights</strong>: High-level takeaways</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2. PPI-F Framework Visualization</h3>
                <p className="text-slate-600 mb-2">Visual representation of the PPI-F framework with your scores:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
                  <li><strong className="text-slate-900">PPI-F Framework Diagram</strong>: Interactive visualization showing all four dimensions</li>
                  <li><strong className="text-slate-900">Dimension Scores</strong>: Individual scores for Performance, Production Readiness, Infrastructure Efficiency, and Failure Resilience</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Dimension Scores & Visualizations</h3>
                <p className="text-slate-600 mb-2">Detailed visual representations of your PPI-F scores:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li><strong className="text-slate-900">PPI-F Maturity Heatmap</strong>: Color-coded view of maturity across all four dimensions</li>
                  <li><strong className="text-slate-900">Radar Chart</strong>: Visual comparison of all PPI-F dimensions</li>
                  <li><strong className="text-slate-900">Progress Indicators</strong>: Detailed breakdown with percentages for each dimension</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">4. PPI-F Findings</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li><strong className="text-slate-900">Severity Levels</strong>: Critical, High, Medium, Low</li>
                  <li><strong className="text-slate-900">Organized by Dimension</strong>: See findings for each PPI-F dimension</li>
                  <li><strong className="text-slate-900">Descriptions</strong>: Detailed explanations of each finding</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">5. PPI-F Engineering Recommendations</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
                  <li><strong className="text-slate-900">PPI-F Prioritization Matrix</strong>: Visual representation of engineering effort vs. business impact
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><strong>Quick Wins</strong>: Low engineering effort, high business impact - start here!</li>
                      <li><strong>Major Projects</strong>: High engineering effort, high business impact - plan strategically</li>
                      <li><strong>Fill-ins</strong>: Low engineering effort, low business impact - do when convenient</li>
                      <li><strong>Thankless Tasks</strong>: High engineering effort, low business impact - avoid or defer</li>
                    </ul>
                  </li>
                  <li><strong className="text-slate-900">Status Tracking</strong>: Track PPI-F recommendation status (pending, in_progress, completed, skipped)</li>
                  <li><strong className="text-slate-900">Engineering Details</strong>: Each PPI-F recommendation includes title, description, engineering effort level, business impact level, timeline estimate, priority score, and related KPIs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">6. Assessment Tools</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li><strong className="text-slate-900">Notes</strong>: Add notes and comments to your assessment</li>
                  <li><strong className="text-slate-900">Tags</strong>: Organize assessments with custom tags</li>
                  <li><strong className="text-slate-900">Custom Fields</strong>: Add additional metadata</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Understanding Scoring Scale */}
          <section id="understanding-scores" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Understanding Scoring Scale</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Score Range</h3>
                <p className="text-slate-600 mb-4">
                  The KPI99 PPI-F Digital Diagnostic Tool uses a <strong className="text-slate-900">0.0 to 5.0 maturity scale</strong> to assess your engineering practices:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                  <li>Each of the four PPI-F dimensions (Performance, Production Readiness, Infrastructure Efficiency, Failure Resilience) receives a score from 0.0 to 5.0</li>
                  <li>The <strong className="text-slate-900">overall maturity score</strong> is the average of all dimension scores</li>
                  <li>Scores are calculated using weighted averages based on question importance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Overall Maturity Ratings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">4.0 - 5.0: Excellent</h4>
                    <p className="text-sm text-slate-600">Low risk, mature practices. Your organization demonstrates best-in-class engineering maturity with comprehensive processes and practices in place.</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">3.0 - 3.9: Good</h4>
                    <p className="text-sm text-slate-600">Medium risk, solid foundation. You have a good base with room for improvement. Focus on addressing gaps to reach excellence.</p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">2.0 - 2.9: Fair</h4>
                    <p className="text-sm text-slate-600">High risk, significant gaps. There are substantial areas requiring attention. Prioritize critical recommendations.</p>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">0.0 - 1.9: Needs Improvement</h4>
                    <p className="text-sm text-slate-600">Critical risk, major gaps. Immediate action required. Focus on critical blockers first.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Risk Levels</h3>
                <p className="text-slate-600 mb-4">Risk levels are automatically calculated based on your overall maturity score:</p>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Risk Level</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Score Range</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-b border-slate-100">
                        <td className="py-2 px-3"><span className="font-semibold text-green-600">Low</span></td>
                        <td className="py-2 px-3">≥ 4.0</td>
                        <td className="py-2 px-3">Minimal risk, mature engineering practices</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 px-3"><span className="font-semibold text-blue-600">Medium</span></td>
                        <td className="py-2 px-3">3.0 - 3.9</td>
                        <td className="py-2 px-3">Moderate risk, solid foundation with improvement opportunities</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 px-3"><span className="font-semibold text-yellow-600">High</span></td>
                        <td className="py-2 px-3">2.0 - 2.9</td>
                        <td className="py-2 px-3">Elevated risk, significant gaps requiring attention</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3"><span className="font-semibold text-red-600">Critical</span></td>
                        <td className="py-2 px-3">&lt; 2.0</td>
                        <td className="py-2 px-3">Critical risk, major gaps requiring immediate action</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">What is a Good Score?</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">Target: 3.5+ Overall</h4>
                    <p className="text-slate-600 mb-2">A score of <strong className="text-slate-900">3.5 or higher</strong> indicates a solid, production-ready system with mature engineering practices.</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      <li>All dimensions should be ≥ 3.0</li>
                      <li>No critical blockers present</li>
                      <li>Some dimensions may be 4.0+</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">Excellent: 4.0+ Overall</h4>
                    <p className="text-slate-600 mb-2">A score of <strong className="text-slate-900">4.0 or higher</strong> represents best-in-class engineering maturity.</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      <li>All dimensions ≥ 3.5</li>
                      <li>Most dimensions ≥ 4.0</li>
                      <li>Low risk across all areas</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-semibold text-slate-900 mb-2">Minimum Acceptable: 3.0 Overall</h4>
                    <p className="text-slate-600 mb-2">A score of <strong className="text-slate-900">3.0 or higher</strong> is the minimum for a production-ready system.</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      <li>No dimension should be below 2.5</li>
                      <li>Address critical blockers immediately</li>
                      <li>Focus on high-priority recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Critical Blockers</h3>
                <p className="text-slate-600 mb-4">
                  Some questions are marked as <strong className="text-slate-900">critical</strong>. If any critical question receives a score below 2.0, 
                  the entire dimension score is capped at 2.0, regardless of other answers. This ensures that critical gaps are addressed before 
                  claiming higher maturity levels.
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900">Important:</strong> Always address critical blockers first, as they prevent you from achieving 
                    higher overall scores even if other areas are strong.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Dimension Balance</h3>
                <p className="text-slate-600 mb-4">
                  While a high overall score is good, it's important to have <strong className="text-slate-900">balanced scores across all four dimensions</strong>. 
                  A score of 4.5 in one dimension but 2.0 in another indicates an unbalanced maturity profile.
                </p>
                <p className="text-slate-600">
                  Aim for:
                </p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>All dimensions within 0.5 points of each other for balanced maturity</li>
                  <li>No single dimension below 2.5 (even if overall is good)</li>
                  <li>Consistent improvement across all areas over time</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Understanding Reports */}
          <section id="understanding-reports" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Understanding Reports</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Export Options</h3>
                <p className="text-slate-600 mb-4">You can export your assessment in multiple formats:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">PDF Reports</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Full Report: Complete assessment with all details</li>
                      <li>• Executive Report: High-level summary for leadership</li>
                      <li>• Engineering Report: Technical details for engineering teams</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Other Formats</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• JSON Export: Machine-readable format</li>
                      <li>• CSV Export: Recommendation backlog</li>
                      <li>• Excel Export: Spreadsheet format</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Report Contents</h3>
                <p className="text-slate-600 mb-2">PDF Reports include:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Executive summary</li>
                  <li>Dimension scores and visualizations</li>
                  <li>Detailed findings</li>
                  <li>Prioritized recommendations</li>
                  <li>Action roadmap (30/60/90 days)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* AI-Augmented Capabilities */}
          <section id="ai-capabilities" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">AI-Augmented Capabilities</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">🤖 AI-Augmented Performance Engineering</h3>
                <p className="text-slate-600 mb-4">
                  The KPI99 PPI-F Digital Diagnostic Tool is enhanced with AI-powered diagnostics that provide intelligent insights 
                  beyond traditional assessments. Our AI-Augmented Performance Engineering approach helps identify patterns, predict 
                  trends, and optimize recommendations using machine learning.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">1. AI-Assisted Anomaly Detection</h3>
                <p className="text-slate-600 mb-3">
                  The system automatically detects anomalies in your assessment results:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                  <li><strong className="text-slate-900">Regression Detection</strong>: Identifies significant drops in maturity scores compared to historical assessments</li>
                  <li><strong className="text-slate-900">Dimension Imbalance Analysis</strong>: Detects when one dimension is significantly weaker than others</li>
                  <li><strong className="text-slate-900">Unusual Patterns</strong>: Flags potential data quality issues or assessment inconsistencies</li>
                  <li><strong className="text-slate-900">Confidence Scoring</strong>: Each anomaly includes a confidence level based on statistical analysis</li>
                </ul>
                <p className="text-slate-600">
                  Anomalies are displayed in the <strong className="text-slate-900">AI-Augmented Diagnostics</strong> section of your results page, 
                  helping you identify areas that need immediate attention or verification.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Predictive Insights & Forecasting</h3>
                <p className="text-slate-600 mb-3">
                  Based on your assessment history, the AI system provides predictive analytics:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                  <li><strong className="text-slate-900">Maturity Projections</strong>: Forecasts your maturity score 6 months ahead based on current trends</li>
                  <li><strong className="text-slate-900">Trend Analysis</strong>: Identifies whether your maturity is improving, declining, or stable</li>
                  <li><strong className="text-slate-900">Velocity Tracking</strong>: Measures the rate of improvement over time</li>
                  <li><strong className="text-slate-900">Capacity Forecasting</strong>: Predicts infrastructure capacity needs and cost trajectories</li>
                  <li><strong className="text-slate-900">Cost Optimization Insights</strong>: Estimates potential savings opportunities (15-30% typical)</li>
                </ul>
                <p className="text-slate-600">
                  These insights help you plan ahead and make data-driven decisions about where to invest engineering resources.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Workload Behavior Modeling</h3>
                <p className="text-slate-600 mb-3">
                  For organizations using distributed systems (Spark, EMR, EKS, Kubernetes), the AI system provides specialized insights:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                  <li><strong className="text-slate-900">Distributed Workload Optimization</strong>: Identifies opportunities for Spark executor skew detection and cluster efficiency improvements</li>
                  <li><strong className="text-slate-900">Workload Clustering</strong>: Analyzes behavioral patterns to recommend optimization strategies</li>
                  <li><strong className="text-slate-900">Resource Waste Detection</strong>: Highlights areas where infrastructure resources are underutilized</li>
                </ul>
                <p className="text-slate-600">
                  These insights are automatically generated when the system detects distributed systems usage in your assessment responses.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">4. AI-Powered Recommendation Prioritization</h3>
                <p className="text-slate-600 mb-3">
                  Recommendations are intelligently prioritized using machine learning:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                  <li><strong className="text-slate-900">Impact/Effort Optimization</strong>: AI calculates optimal prioritization based on dimension criticality and historical patterns</li>
                  <li><strong className="text-slate-900">Workload Pattern Analysis</strong>: Adjusts recommendations based on detected system patterns</li>
                  <li><strong className="text-slate-900">Contextual Scoring</strong>: Considers your organization's maturity level when prioritizing</li>
                </ul>
                <p className="text-slate-600">
                  This ensures you focus on recommendations that will have the greatest impact for your specific situation.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">KPI99's AI Integration Philosophy</h3>
                <p className="text-slate-700 mb-3">
                  KPI99 positions itself as an <strong className="text-slate-900">AI-Augmented Performance Engineering</strong> company, not a generic AI consultancy. 
                  Our AI capabilities are specifically designed to enhance performance engineering for enterprise distributed systems.
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-900">Core Focus:</strong> Performance. Scale. Reliability—Engineered. AI augments our engineering-first approach 
                  by providing intelligent diagnostics, predictive insights, and workload optimization—all in service of building better systems.
                </p>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section id="advanced-features" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Advanced Features</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Assessment Comparison</h3>
                <p className="text-slate-600">Compare two assessments to track progress:</p>
                <ol className="list-decimal list-inside text-slate-600 mt-2 space-y-1">
                  <li>Go to an assessment's results page</li>
                  <li>Click <strong className="text-slate-900">"Compare with Another Assessment"</strong></li>
                  <li>Select the assessment to compare</li>
                  <li>View side-by-side comparison of scores and changes</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Assessment Cloning</h3>
                <p className="text-slate-600">Create a copy of an existing assessment:</p>
                <ol className="list-decimal list-inside text-slate-600 mt-2 space-y-1">
                  <li>Go to the assessments list</li>
                  <li>Click the <strong className="text-slate-900">"Clone"</strong> button on an assessment</li>
                  <li>Provide a new name for the cloned assessment</li>
                  <li>All answers will be copied to the new assessment</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Analytics Dashboard</h3>
                <p className="text-slate-600">View organization-level analytics:</p>
                <ol className="list-decimal list-inside text-slate-600 mt-2 space-y-1">
                  <li>Navigate to an organization</li>
                  <li>Click <strong className="text-slate-900">"Analytics"</strong> in the navigation</li>
                  <li>View trends, metrics, and benchmark comparisons</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Bulk Operations</h3>
                <p className="text-slate-600">Perform actions on multiple assessments:</p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li><strong className="text-slate-900">Bulk Status Update</strong>: Update recommendation statuses in bulk</li>
                  <li><strong className="text-slate-900">Bulk Delete</strong>: Delete multiple assessments at once</li>
                  <li><strong className="text-slate-900">Bulk Summary</strong>: Get summary for multiple assessments</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">5. Advanced Filtering</h3>
                <p className="text-slate-600">Filter assessments by:</p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li><strong className="text-slate-900">Status</strong>: draft, in_progress, completed</li>
                  <li><strong className="text-slate-900">Search</strong>: Search by name or tags</li>
                  <li><strong className="text-slate-900">Date Range</strong>: Filter by creation or completion date</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">6. Webhooks and Integrations</h3>
                <p className="text-slate-600">Set up webhooks to integrate with other systems:</p>
                <ol className="list-decimal list-inside text-slate-600 mt-2 space-y-1">
                  <li>Go to <strong className="text-slate-900">"Integrations"</strong> in an organization</li>
                  <li>Create a webhook subscription</li>
                  <li>Configure events to subscribe to (assessment.created, assessment.completed, etc.)</li>
                  <li>Set up HMAC verification for security</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">7. Notifications</h3>
                <p className="text-slate-600">Stay informed about:</p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>Assessment completions</li>
                  <li>New recommendations</li>
                  <li>Important updates</li>
                  <li>View unread count in the notification bell</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tips and Best Practices */}
          <section id="tips" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Tips and Best Practices</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">1. Answer Honestly</h3>
                <p className="text-slate-600">Be honest about your current state. The assessment is only as good as your answers. It's okay to have low scores - that's why you're doing the assessment!</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">2. Involve the Right People</h3>
                <p className="text-slate-600">Include team members who understand different aspects of your engineering. Consider multiple perspectives for a more accurate assessment.</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">3. Review Recommendations Carefully</h3>
                <p className="text-slate-600">Focus on "Quick Wins" first for immediate impact. Plan "Major Projects" for longer-term improvements. Use the prioritization matrix to guide your roadmap.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">4. Track Progress Over Time</h3>
                <p className="text-slate-600">Run assessments quarterly or bi-annually. Compare results to see improvements. Use the analytics dashboard to visualize trends.</p>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">5. Export and Share</h3>
                <p className="text-slate-600">Export executive reports for leadership. Share engineering reports with your team. Use CSV exports to create tickets in project management tools.</p>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">6. Use Tags and Notes</h3>
                <p className="text-slate-600">Tag assessments by quarter, team, or project. Add notes about context or decisions. This helps when reviewing historical assessments.</p>
              </div>

              <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">7. Leverage Custom Fields</h3>
                <p className="text-slate-600">Add metadata relevant to your organization. Track additional context (team size, tech stack, etc.). Use for filtering and organization.</p>
              </div>
            </div>
          </section>

          {/* PPI-F Success Stories */}
          <section id="success-stories" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">PPI-F Success Stories</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Case Study: E-Commerce Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">Initial PPI-F Score:</strong> 2.1/5.0</p>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">After 6 Months:</strong> 3.8/5.0</p>
                    <p className="text-sm text-slate-600"><strong className="text-slate-900">Improvement:</strong> +1.7 points</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">Key Improvements:</strong></p>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Reduced P95 latency by 60%</li>
                      <li>Implemented automated rollbacks</li>
                      <li>Reduced infrastructure costs by 40%</li>
                      <li>Achieved 99.9% uptime</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "The PPI-F framework helped us identify critical gaps we didn't know existed. Following the recommendations, 
                  we saw immediate improvements in system reliability and user experience." — Engineering Lead
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Case Study: SaaS Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">Initial PPI-F Score:</strong> 2.8/5.0</p>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">After 12 Months:</strong> 4.2/5.0</p>
                    <p className="text-sm text-slate-600"><strong className="text-slate-900">Improvement:</strong> +1.4 points</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">Key Improvements:</strong></p>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Implemented comprehensive observability</li>
                      <li>Reduced deployment time by 75%</li>
                      <li>Achieved multi-region active-active setup</li>
                      <li>Zero critical incidents in 6 months</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "PPI-F gave us a clear roadmap. We focused on Quick Wins first, then tackled Major Projects. 
                  The framework's prioritization matrix was invaluable." — CTO
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Case Study: FinTech Startup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">Initial PPI-F Score:</strong> 1.9/5.0</p>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">After 9 Months:</strong> 3.5/5.0</p>
                    <p className="text-sm text-slate-600"><strong className="text-slate-900">Improvement:</strong> +1.6 points</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2"><strong className="text-slate-900">Key Improvements:</strong></p>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Implemented SLOs and error budgets</li>
                      <li>Built comprehensive disaster recovery</li>
                      <li>Reduced infrastructure costs by 50%</li>
                      <li>Passed SOC 2 Type II audit</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "Starting with a low PPI-F score was actually helpful—it showed us exactly where to focus. 
                  The framework's critical blocker identification saved us months of trial and error." — VP Engineering
                </p>
              </div>
            </div>
          </section>

          {/* KPI99 Resources */}
          <section id="resources" className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">KPI99 Resources</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">PPI-F Framework Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Framework Documentation</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Learn about the PPI-F framework methodology, philosophy, and best practices.
                    </p>
                    <Link
                      href="/about-ppi-f"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Explore PPI-F Framework
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">API Documentation</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Integrate PPI-F assessments into your workflows using our comprehensive API.
                    </p>
                    <a
                      href="http://localhost:8001/api/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View API Docs
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">KPI99 Philosophy</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                  <p className="text-lg text-slate-700 mb-4 italic">
                    "Performance failures are business risks — until they are engineered."
                  </p>
                  <p className="text-slate-600">
                    At KPI99, we believe that engineering maturity isn't about following processes—it's about building 
                    systems that perform reliably, scale efficiently, and recover gracefully from failures. The PPI-F framework 
                    is our contribution to the engineering community, providing a practical, actionable approach to measuring 
                    and improving engineering maturity that actually works in production.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Get Support</h3>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <p className="text-slate-600 mb-4">
                    Need help with your PPI-F assessment or have questions about the framework?
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Review the comprehensive documentation above</li>
                    <li>• Explore the PPI-F framework methodology page</li>
                    <li>• Check the API documentation for integration help</li>
                    <li>• Visit <a href="https://kpi99.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">kpi99.io</a> for more resources</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Links</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Dashboard
              </Link>
              <Link href="/organizations/new" className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Organization
              </Link>
              <a
                href="http://localhost:8001/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                API Documentation
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
