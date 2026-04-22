export type Step1Assessment = {
  country: string
  sdgGoals?: string
  countryChallenges?: string
  backgroundProblem?: string
  existingProject?: string
  developmentRationale?: string
  objectives?: string
  safeguards?: string
  sources?: string
}

export type Step2Intermediary = {
  country: string
  intermediary: string
  type?: string
  role?: string
  fit?: string
  notes?: string
  sources?: string
}

export type Step3Diagnosis = {
  country: string
  projectContext?: string
  problemStatement?: string
  primaryBarrier: string
  secondaryBarrier?: string
  evidence?: string
  projectStage?: string
  sources?: string
}

export type BarrierReference = {
  category: string
  description: string
  evidence: string
  projectStage: string
  bestFitBlendedFinanceTools: string[]
  bestFitGlobalExpansionOptions: string[]
  source: string
}

export type ToolIndicatorKey =
  | "barrierFit"
  | "mobilizationPotential"
  | "financialAdditionality"
  | "developmentAdditionality"
  | "concessionalityDiscipline"
  | "implementationFeasibility"
  | "resultsImpactMeasurability"

export type ExpansionIndicatorKey =
  | "speed"
  | "cost"
  | "localOwnership"
  | "scalability"
  | "capabilityTransfer"
  | "implementationRisk"

export type ToolReference = {
  id: string
  tool: string
  description: string
  bestWhen: string
  strengths: string[]
  weaknesses: string[]
  riskMethodologies: string[]
  source: string
  baseScores: Record<ToolIndicatorKey, number>
}

export type ExpansionReference = {
  id: string
  model: string
  description: string
  pros: string[]
  cons: string[]
  baseScores: Record<ExpansionIndicatorKey, number>
}

export type IndicatorWeight<T extends string> = {
  key: T
  weight: number
}

export type RecommendationResult = {
  id: string
  name: string
  score: number
  reasons: string[]
}

export type ScorecardModel = {
  step1: Step1Assessment[]
  step2: Step2Intermediary[]
  step3: Step3Diagnosis[]
  barriers: BarrierReference[]
  tools: ToolReference[]
  expansions: ExpansionReference[]
}
