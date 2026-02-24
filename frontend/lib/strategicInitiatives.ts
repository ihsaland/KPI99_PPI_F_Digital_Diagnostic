/**
 * KPI99 Strategic Initiatives supported by PPI-F Diagnostic.
 * Used for tagging assessments and filtering by initiative focus.
 */
export const STRATEGIC_INITIATIVES = [
  {
    tag: 'ai_infrastructure_efficiency',
    label: 'AI Infrastructure Efficiency',
    description: 'Optimize infrastructure utilization and cost through AI-driven analysis and right-sizing.',
  },
  {
    tag: 'cloud_cost_early_warning',
    label: 'Cloud Cost Early-Warning System (Predictive, not reactive)',
    description: 'Forecast spend and usage trends before they hit the budget.',
  },
  {
    tag: 'independent_cloud_cost_audit',
    label: 'Independent Cloud Cost Audit Authority',
    description: 'Third-party, evidence-based review of cloud and infrastructure spend.',
  },
] as const

export type StrategicInitiativeTag = (typeof STRATEGIC_INITIATIVES)[number]['tag']

export function getInitiativeLabel(tag: string): string {
  const found = STRATEGIC_INITIATIVES.find((i) => i.tag === tag)
  return found ? found.label : tag
}

export function isStrategicInitiativeTag(tag: string): tag is StrategicInitiativeTag {
  return STRATEGIC_INITIATIVES.some((i) => i.tag === tag)
}
