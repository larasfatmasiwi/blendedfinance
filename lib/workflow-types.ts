export const scoringDimensions = [
  { key: "barrier_fit", label: "Barrier fit" },
  { key: "mobilization_potential", label: "Mobilization potential" },
  { key: "financial_additionality", label: "Financial additionality" },
  { key: "development_additionality", label: "Development additionality" },
  { key: "concessionality_discipline", label: "Concessionality discipline" },
  { key: "implementation_feasibility", label: "Implementation feasibility" },
  { key: "results_impact_measurability", label: "Results / impact measurability" },
] as const

export type DimensionKey = (typeof scoringDimensions)[number]["key"]

export type DimensionScores = Record<DimensionKey, number>

export type CountryAssessment = {
  country: string
  region?: string
  incomeLevel?: string
  marketMaturity?: string
  macroNotes?: string
}

export type IntermediaryMapping = {
  intermediaryType: string
  name: string
  role?: string
  maturity?: string
  notes?: string
}

export type BarrierDiagnosis = {
  barrier: string
  severity?: string
  evidence?: string
  owner?: string
}

export type BlendedFinanceRecommendation = {
  instrument: string
  rationale?: string
  fitScore?: number
  dimensionScores?: Partial<DimensionScores>
}

export type GlobalExpansionRecommendation = {
  targetMarket: string
  priority?: string
  rationale?: string
  prerequisites?: string
}

export type ScorecardScenario = {
  countryAssessment: CountryAssessment
  intermediaryMapping: IntermediaryMapping[]
  barrierDiagnosis: BarrierDiagnosis[]
  blendedFinanceRecommendation: BlendedFinanceRecommendation[]
  globalExpansionRecommendation: GlobalExpansionRecommendation[]
}

export type ScorecardByCountry = Record<string, ScorecardScenario>
