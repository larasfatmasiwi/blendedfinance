export type ProjectStage =
  | "Ideation"
  | "Early Validation"
  | "Pilot"
  | "Scale-Up"
  | "Mature"

export interface Step1CountryProblem {
  id: string
  country: string
  sdgTarget: string
  countryChallenges: string
  backgroundProblem: string
  existingProject: string
  developmentRationale: string
  expectedResults: string
  safeguards: string
  sources: string[]
}

export interface Step2IntermediaryAssessment {
  id: string
  intermediary: string
  type: string
  whyRelevant: string
  role: string
  geography: string
  relationshipStatus: string
  linkedCountry: string
  linkedBarrier: string
}

export interface Step3BarrierDiagnosis {
  id: string
  linkedCountry: string
  primaryBarrier: string
  barrierDescription: string
  observableSigns: string
  projectStage: ProjectStage
  recommendedTool: string
  source: string
}

export interface Step4ToolReference {
  id: string
  tool: string
  description: string
  bestWhen: string
  strengths: string[]
  weaknesses: string[]
  riskMethodologies: string[]
  source: string
}

export interface Step5ExpansionReference {
  id: string
  model: string
  description: string
  bestWhen: string
  pros: string[]
  cons: string[]
  implementationImplications: string
}

export interface RecommendationProfile {
  localOwnershipNeed: number
  speedPriority: number
  costSensitivity: number
  capacityBuildingNeed: number
  scalabilityGoal: number
  regulatoryFeasibilityNeed: number
}

export interface CaseRecord {
  id: string
  country: Step1CountryProblem
  intermediary: Step2IntermediaryAssessment
  barrier: Step3BarrierDiagnosis
  expansionModel: Step5ExpansionReference
  recommendationProfile: RecommendationProfile
}

export interface ScorecardWorkbookModel {
  instruction: string
  step1: Step1CountryProblem[]
  step2: Step2IntermediaryAssessment[]
  step3: Step3BarrierDiagnosis[]
  step4: Step4ToolReference[]
  step5: Step5ExpansionReference[]
  cases: CaseRecord[]
}
