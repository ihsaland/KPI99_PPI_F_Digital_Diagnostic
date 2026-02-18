'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import PanAbstract from '@/components/panAbstract'
import toast from 'react-hot-toast'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

interface ROIInputs {
  region: string
  annual_cloud_spend_usd: number
  critical_incidents_per_month: number
  avg_cost_per_incident_usd: number
  monthly_engineering_cost_usd: number
  monthly_revenue_at_risk_usd: number
  engagement_cost_usd: number
  engagement_duration_months: number
  time_horizon_months: number
  ppi_f_maturity_score?: number
}

interface ROIResults {
  scenario: string
  cloud_impact: number
  incident_impact: number
  revenue_impact: number
  productivity_impact: number
  total_impact: number
  roi_multiple: number
  payback_months_from_start?: number
  payback_months_from_completion?: number
  realization_factor: number
  cloud_savings_pct?: number
  incident_reduction_pct?: number
  revenue_mitigated_pct?: number
  productivity_recovery_pct?: number
}

const REGIONS = ['LATAM', 'North America', 'Europe', 'Asia Pacific', 'Other']
const SCENARIOS = ['conservative', 'expected', 'upside']

interface PieDataEntry {
  name: string
  value: number
}

const SCENARIO_DEFAULTS = {
  conservative: {
    cloud_savings_pct: 0.06,
    incident_reduction_pct: 0.15,
    revenue_mitigated_pct: 0.05,
    productivity_recovery_pct: 0.02,
    realization_factor: 0.60
  },
  expected: {
    cloud_savings_pct: 0.12,
    incident_reduction_pct: 0.30,
    revenue_mitigated_pct: 0.10,
    productivity_recovery_pct: 0.05,
    realization_factor: 0.75
  },
  upside: {
    cloud_savings_pct: 0.18,
    incident_reduction_pct: 0.45,
    revenue_mitigated_pct: 0.20,
    productivity_recovery_pct: 0.08,
    realization_factor: 0.90
  }
}

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<ROIInputs>({
    region: 'LATAM',
    annual_cloud_spend_usd: 350000,
    critical_incidents_per_month: 4,
    avg_cost_per_incident_usd: 8000,
    monthly_engineering_cost_usd: 120000,
    monthly_revenue_at_risk_usd: 50000,
    engagement_cost_usd: 30000,
    engagement_duration_months: 3,
    time_horizon_months: 12,
    ppi_f_maturity_score: undefined
  })

  const [results, setResults] = useState<Record<string, ROIResults>>({})
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field: keyof ROIInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'region' ? value : parseFloat(value as string) || 0
    }))
  }

  const validateInputs = (): boolean => {
    if (inputs.annual_cloud_spend_usd < 0) {
      toast.error('Annual cloud spend must be >= 0')
      return false
    }
    if (inputs.critical_incidents_per_month < 0) {
      toast.error('Critical incidents per month must be >= 0')
      return false
    }
    if (inputs.avg_cost_per_incident_usd < 0) {
      toast.error('Average cost per incident must be >= 0')
      return false
    }
    if (inputs.monthly_engineering_cost_usd < 0) {
      toast.error('Monthly engineering cost must be >= 0')
      return false
    }
    if (inputs.monthly_revenue_at_risk_usd < 0) {
      toast.error('Monthly revenue at risk must be >= 0')
      return false
    }
    if (inputs.engagement_cost_usd <= 0) {
      toast.error('Engagement cost must be > 0')
      return false
    }
    if (inputs.time_horizon_months <= 0) {
      toast.error('Time horizon must be > 0')
      return false
    }
    if (inputs.engagement_duration_months < 0) {
      toast.error('Engagement duration must be >= 0')
      return false
    }
    if (inputs.engagement_duration_months >= inputs.time_horizon_months) {
      toast.error('Engagement duration must be less than time horizon')
      return false
    }
    return true
  }

  const calculateROI = async () => {
    if (!validateInputs()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8001/api/roi/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: '1.0.0',
          region: inputs.region,
          time_horizon_months: inputs.time_horizon_months,
          inputs: {
            annual_cloud_spend_usd: inputs.annual_cloud_spend_usd,
            critical_incidents_per_month: inputs.critical_incidents_per_month,
            avg_cost_per_incident_usd: inputs.avg_cost_per_incident_usd,
            monthly_engineering_cost_usd: inputs.monthly_engineering_cost_usd,
            monthly_revenue_at_risk_usd: inputs.monthly_revenue_at_risk_usd,
            engagement_cost_usd: inputs.engagement_cost_usd,
            engagement_duration_months: inputs.engagement_duration_months
          },
          ppi_f_maturity_score: inputs.ppi_f_maturity_score
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to calculate ROI')
      }

      const data = await response.json()
      setResults(data.computed || {})
      setShowResults(true)
      toast.success('ROI calculation completed!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to calculate ROI')
      console.error('ROI calculation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  const impactData = showResults ? Object.entries(results).map(([scenario, result]) => ({
    scenario: scenario.charAt(0).toUpperCase() + scenario.slice(1),
    'Cloud Impact': result.cloud_impact,
    'Incident Impact': result.incident_impact,
    'Revenue Impact': result.revenue_impact,
    'Productivity Impact': result.productivity_impact,
    'Total Impact': result.total_impact
  })) : []

  const pieData = showResults && results.expected ? [
    { name: 'Cloud Cost Optimization', value: results.expected.cloud_impact },
    { name: 'Incident Reduction', value: results.expected.incident_impact },
    { name: 'Revenue Protection', value: results.expected.revenue_impact },
    { name: 'Productivity Recovery', value: results.expected.productivity_impact },
  ] : []

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <Header />

      {/* Header Image */}
      <PanAbstract
        title="KPI99 ROI Calculator"
        subtitle="CFO-ready ROI modeling tool for engineering maturity improvements"
        variant="gradient"
      />

      <main id="main-content" className="container mx-auto px-6 pt-32 pb-12" role="main">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Input Parameters</h2>
                
                <div className="space-y-6">
                  {/* Region */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={inputs.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {REGIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Financial Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Annual Cloud Spend (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.annual_cloud_spend_usd || ''}
                        onChange={(e) => handleInputChange('annual_cloud_spend_usd', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="350000"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Engagement Cost (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.engagement_cost_usd || ''}
                        onChange={(e) => handleInputChange('engagement_cost_usd', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="30000"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Incident Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Critical Incidents per Month <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.critical_incidents_per_month || ''}
                        onChange={(e) => handleInputChange('critical_incidents_per_month', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="4"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Avg Cost per Incident (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.avg_cost_per_incident_usd || ''}
                        onChange={(e) => handleInputChange('avg_cost_per_incident_usd', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="8000"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Engineering & Revenue */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Monthly Engineering Cost (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.monthly_engineering_cost_usd || ''}
                        onChange={(e) => handleInputChange('monthly_engineering_cost_usd', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="120000"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Monthly Revenue at Risk (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.monthly_revenue_at_risk_usd || ''}
                        onChange={(e) => handleInputChange('monthly_revenue_at_risk_usd', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="50000"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Engagement Duration & Time Horizon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Engagement Duration (Months) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.engagement_duration_months || ''}
                        onChange={(e) => handleInputChange('engagement_duration_months', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="3"
                        min="0"
                        step="0.5"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Duration of the engagement. ROI starts accumulating after completion.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Time Horizon (Months) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.time_horizon_months || ''}
                        onChange={(e) => handleInputChange('time_horizon_months', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="12"
                        min="1"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        The period over which to calculate the ROI and financial impacts.
                      </p>
                    </div>
                  </div>

                  {/* PPI-F Score */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      PPI-F Maturity Score (Optional)
                    </label>
                    <input
                      type="number"
                      value={inputs.ppi_f_maturity_score || ''}
                      onChange={(e) => handleInputChange('ppi_f_maturity_score', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0.0 - 5.0"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      If provided, will adjust default savings percentages based on maturity level
                    </p>
                  </div>

                  {/* Calculate Button */}
                  <button
                    onClick={calculateROI}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                      </span>
                    ) : (
                      'Calculate ROI'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Value Pillars</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">Cloud Cost Optimization</h4>
                    <p className="text-sm text-blue-700">Reduce infrastructure costs through efficiency improvements</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">Incident Reduction</h4>
                    <p className="text-sm text-green-700">Decrease critical incidents and associated costs</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-1">Revenue Protection</h4>
                    <p className="text-sm text-purple-700">Mitigate revenue loss from system failures</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-1">Productivity Recovery</h4>
                    <p className="text-sm text-orange-700">Recover engineering time lost to incidents and inefficiencies</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Scenarios and Calculation Formulas - Bottom Section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scenarios */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Scenarios</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2 text-lg">Conservative</h4>
                  <p className="text-sm text-slate-600 mb-3">Lower savings, higher realization factor (60%)</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Cloud Savings:</span>
                      <span className="font-semibold text-slate-900 ml-1">6%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Incident Reduction:</span>
                      <span className="font-semibold text-slate-900 ml-1">15%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Revenue Mitigation:</span>
                      <span className="font-semibold text-slate-900 ml-1">5%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Productivity Recovery:</span>
                      <span className="font-semibold text-slate-900 ml-1">2%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2 text-lg">Expected</h4>
                  <p className="text-sm text-slate-600 mb-3">Balanced savings, moderate realization (75%)</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Cloud Savings:</span>
                      <span className="font-semibold text-slate-900 ml-1">12%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Incident Reduction:</span>
                      <span className="font-semibold text-slate-900 ml-1">30%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Revenue Mitigation:</span>
                      <span className="font-semibold text-slate-900 ml-1">10%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Productivity Recovery:</span>
                      <span className="font-semibold text-slate-900 ml-1">5%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2 text-lg">Upside</h4>
                  <p className="text-sm text-slate-600 mb-3">Higher savings, best realization (90%)</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Cloud Savings:</span>
                      <span className="font-semibold text-slate-900 ml-1">18%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Incident Reduction:</span>
                      <span className="font-semibold text-slate-900 ml-1">45%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Revenue Mitigation:</span>
                      <span className="font-semibold text-slate-900 ml-1">20%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Productivity Recovery:</span>
                      <span className="font-semibold text-slate-900 ml-1">8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Formulas */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Calculation Formulas</h3>
              <div className="space-y-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Cloud Impact</h4>
                  <code className="text-xs text-slate-700 block whitespace-pre-wrap">
{`Annual Cloud Spend × 
Cloud Savings % × 
Realization Factor`}
                  </code>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Incident Impact</h4>
                  <code className="text-xs text-slate-700 block whitespace-pre-wrap">
{`(Incidents/Month × 
Cost/Incident × 12) × 
Incident Reduction % × 
Realization Factor`}
                  </code>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Revenue Impact</h4>
                  <code className="text-xs text-slate-700 block whitespace-pre-wrap">
{`(Monthly Revenue at Risk × 12) × 
Revenue Mitigation % × 
Realization Factor`}
                  </code>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Productivity Impact</h4>
                  <code className="text-xs text-slate-700 block whitespace-pre-wrap">
{`(Monthly Engineering Cost × 12) × 
Productivity Recovery % × 
Realization Factor`}
                  </code>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Total Impact</h4>
                  <code className="text-xs text-blue-700 block">
                    Cloud + Incident + Revenue + Productivity
                  </code>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">ROI Multiple</h4>
                  <code className="text-xs text-green-700 block">
                    Total Impact ÷ Engagement Cost
                  </code>
                </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Payback Period</h4>
                    <code className="text-xs text-purple-700 block whitespace-pre-wrap">
{`From Start:
Engagement Duration + 
(Engagement Cost ÷ Monthly Impact)

From Completion:
Engagement Cost ÷ Monthly Impact

Note: ROI starts accumulating 
after engagement completion`}
                    </code>
                  </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {showResults && Object.keys(results).length > 0 && (
            <div className="mt-8 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SCENARIOS.map(scenario => {
                  const result = results[scenario]
                  if (!result) return null
                  
                  return (
                    <div key={scenario} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 capitalize">{scenario} Scenario</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-slate-600">Total Impact</div>
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(result.total_impact)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">ROI Multiple</div>
                          <div className="text-2xl font-bold text-green-600">{formatNumber(result.roi_multiple)}x</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Payback Period (from start)</div>
                          <div className="text-2xl font-bold text-purple-600">
                            {result.payback_months_from_start ? formatNumber(result.payback_months_from_start, 1) + ' months' : 'N/A'}
                          </div>
                          {result.payback_months_from_completion && (
                            <div className="text-xs text-slate-500 mt-1">
                              ({formatNumber(result.payback_months_from_completion, 1)} months after completion)
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Realization Factor</div>
                          <div className="text-lg font-semibold text-slate-700">{(result.realization_factor * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Calculation Breakdown for Expected Scenario */}
              {results.expected && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Calculation Breakdown (Expected Scenario)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">Cloud Cost Optimization</h3>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>Annual Cloud Spend: {formatCurrency(inputs.annual_cloud_spend_usd)}</div>
                          <div>Savings %: {(results.expected.cloud_savings_pct ?? 0) * 100}%</div>
                          <div>Realization: {(results.expected.realization_factor * 100).toFixed(0)}%</div>
                          <div className="pt-2 border-t border-blue-300">
                            <strong>Impact:</strong> {formatCurrency(results.expected.cloud_impact)}
                          </div>
                          <div className="text-xs text-blue-600 mt-1 font-mono">
                            {formatCurrency(inputs.annual_cloud_spend_usd)} × {(results.expected.cloud_savings_pct ?? 0) * 100}% × {(results.expected.realization_factor * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h3 className="font-semibold text-green-900 mb-2">Incident Reduction</h3>
                        <div className="text-sm text-green-700 space-y-1">
                          <div>Annual Incident Cost: {formatCurrency(inputs.critical_incidents_per_month * inputs.avg_cost_per_incident_usd * 12)}</div>
                          <div>Reduction %: {(results.expected.incident_reduction_pct ?? 0) * 100}%</div>
                          <div>Realization: {(results.expected.realization_factor * 100).toFixed(0)}%</div>
                          <div className="pt-2 border-t border-green-300">
                            <strong>Impact:</strong> {formatCurrency(results.expected.incident_impact)}
                          </div>
                          <div className="text-xs text-green-600 mt-1 font-mono">
                            {formatCurrency(inputs.critical_incidents_per_month * inputs.avg_cost_per_incident_usd * 12)} × {(results.expected.incident_reduction_pct ?? 0) * 100}% × {(results.expected.realization_factor * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h3 className="font-semibold text-purple-900 mb-2">Revenue Protection</h3>
                        <div className="text-sm text-purple-700 space-y-1">
                          <div>Annual Revenue at Risk: {formatCurrency(inputs.monthly_revenue_at_risk_usd * 12)}</div>
                          <div>Mitigation %: {(results.expected.revenue_mitigated_pct ?? 0) * 100}%</div>
                          <div>Realization: {(results.expected.realization_factor * 100).toFixed(0)}%</div>
                          <div className="pt-2 border-t border-purple-300">
                            <strong>Impact:</strong> {formatCurrency(results.expected.revenue_impact)}
                          </div>
                          <div className="text-xs text-purple-600 mt-1 font-mono">
                            {formatCurrency(inputs.monthly_revenue_at_risk_usd * 12)} × {(results.expected.revenue_mitigated_pct ?? 0) * 100}% × {(results.expected.realization_factor * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h3 className="font-semibold text-orange-900 mb-2">Productivity Recovery</h3>
                        <div className="text-sm text-orange-700 space-y-1">
                          <div>Annual Engineering Cost: {formatCurrency(inputs.monthly_engineering_cost_usd * 12)}</div>
                          <div>Recovery %: {(results.expected.productivity_recovery_pct ?? 0) * 100}%</div>
                          <div>Realization: {(results.expected.realization_factor * 100).toFixed(0)}%</div>
                          <div className="pt-2 border-t border-orange-300">
                            <strong>Impact:</strong> {formatCurrency(results.expected.productivity_impact)}
                          </div>
                          <div className="text-xs text-orange-600 mt-1 font-mono">
                            {formatCurrency(inputs.monthly_engineering_cost_usd * 12)} × {(results.expected.productivity_recovery_pct ?? 0) * 100}% × {(results.expected.realization_factor * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 bg-slate-100 rounded-lg p-4 border border-slate-300">
                    <div className="text-sm text-slate-700 space-y-2">
                      <div>
                        <strong>Total Impact:</strong> {formatCurrency(results.expected.total_impact)}
                      </div>
                      <div className="font-mono text-xs text-slate-600">
                        {formatCurrency(results.expected.cloud_impact)} + {formatCurrency(results.expected.incident_impact)} + {formatCurrency(results.expected.revenue_impact)} + {formatCurrency(results.expected.productivity_impact)}
                      </div>
                      <div className="pt-2 border-t border-slate-300">
                        <strong>ROI Multiple:</strong> {formatNumber(results.expected.roi_multiple)}x
                        <span className="text-xs text-slate-600 ml-2 font-mono">
                          ({formatCurrency(results.expected.total_impact)} ÷ {formatCurrency(inputs.engagement_cost_usd)})
                        </span>
                      </div>
                      <div>
                        <strong>Payback Period (from contract start):</strong> {results.expected.payback_months_from_start ? formatNumber(results.expected.payback_months_from_start, 1) + ' months' : 'N/A'}
                        <span className="text-xs text-slate-600 ml-2 font-mono">
                          ({inputs.engagement_duration_months} months engagement + {results.expected.payback_months_from_completion ? formatNumber(results.expected.payback_months_from_completion, 1) : 'N/A'} months to recover)
                        </span>
                      </div>
                      {results.expected.payback_months_from_completion && (
                        <div>
                          <strong>Payback Period (from completion):</strong> {formatNumber(results.expected.payback_months_from_completion, 1)} months
                          <span className="text-xs text-slate-600 ml-2 font-mono">
                            ({formatCurrency(inputs.engagement_cost_usd)} ÷ ({formatCurrency(results.expected.total_impact)} ÷ {inputs.time_horizon_months}))
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Impact Breakdown Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Impact Breakdown by Scenario</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="scenario" tick={{ fill: '#475569', fontSize: 12 }} />
                    <YAxis 
                      tick={{ fill: '#475569', fontSize: 12 }}
                      tickFormatter={(value: number | undefined) => `$${((value ?? 0) / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="Cloud Impact" fill="#3b82f6" />
                    <Bar dataKey="Incident Impact" fill="#10b981" />
                    <Bar dataKey="Revenue Impact" fill="#8b5cf6" />
                    <Bar dataKey="Productivity Impact" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Impact Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Expected Scenario - Impact Distribution</h3>
                    {pieData.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name: string; percent?: number }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry: PieDataEntry, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number | undefined) => formatCurrency(value ?? 0)} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Impact Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Expected Scenario - Value Breakdown</h3>
                    {results.expected && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="font-semibold text-blue-900">Cloud Cost Optimization</span>
                          <span className="font-bold text-blue-600">{formatCurrency(results.expected.cloud_impact)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <span className="font-semibold text-green-900">Incident Reduction</span>
                          <span className="font-bold text-green-600">{formatCurrency(results.expected.incident_impact)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <span className="font-semibold text-purple-900">Revenue Protection</span>
                          <span className="font-bold text-purple-600">{formatCurrency(results.expected.revenue_impact)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <span className="font-semibold text-orange-900">Productivity Recovery</span>
                          <span className="font-bold text-orange-600">{formatCurrency(results.expected.productivity_impact)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-100 rounded-lg border border-slate-300 mt-4">
                          <span className="font-bold text-slate-900">Total Impact</span>
                          <span className="font-bold text-slate-900 text-xl">{formatCurrency(results.expected.total_impact)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

