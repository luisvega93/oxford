export type ScenarioCode = 'a' | 'b' | 'c' | 'e' | 'g' | 'h'

export interface AnnualProjection {
  year: number
  revenue: number
  costs: number
  netCashFlow: number
  cumulativeCashFlow: number
}

export interface ScenarioDefinition {
  code: ScenarioCode
  title: string
  summary: string
  cashFlowLines: string[]
  keyTakeaway: string
}

export interface Alternative {
  id: string
  order: number
  name: string
  displayName: string
  shortLabel: string
  thesis: string
  includedScenarioCodes: ScenarioCode[]
  includedScenarioLabel: string
  tenYearRevenue: number
  tenYearCosts: number
  tenYearNetCashFlow: number
  capitalRequirement: number
  peakDrawdownAbs: number
  payback: string
  netMargin: number
  recommended: boolean
  projections: AnnualProjection[]
}

export interface AlternativeEditorial {
  tagline: string
  explanation: string
  pros: string[]
  cons: string[]
  investorAngle: string
}

export interface DashboardContent {
  hero: {
    eyebrow: string
    headline: string
    summary: string
    callout: string
  }
  comparisonIntro: string
  methodologyNote: string
  footerTitle: string
  alternatives: Record<string, AlternativeEditorial>
}

export interface DashboardData {
  source: {
    workbook: string
    generatedAt: string
  }
  scenarios: Record<ScenarioCode, ScenarioDefinition>
  alternatives: Alternative[]
}
