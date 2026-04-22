import type {
  ScorecardWorkbookModel,
  Step1CountryProblem,
  Step2IntermediaryAssessment,
  Step3BarrierDiagnosis,
  Step4ToolReference,
  Step5ExpansionReference,
} from "@/types/dashboard/scorecard"

// Future Excel parser adapter:
// 1) Parse workbook sheets with xlsx.
// 2) Pass each row array into these mappers.
// 3) Store normalized typed objects in app state/store.

type GenericRow = Record<string, string | number | null | undefined>

const asString = (value: unknown) => String(value ?? "").trim()

export function mapStep1Row(row: GenericRow, index: number): Step1CountryProblem {
  return {
    id: `step1-${index + 1}`,
    country: asString(row.country),
    sdgTarget: asString(row.sdgTarget),
    countryChallenges: asString(row.countryChallenges),
    backgroundProblem: asString(row.backgroundProblem),
    existingProject: asString(row.existingProject),
    developmentRationale: asString(row.developmentRationale),
    expectedResults: asString(row.expectedResults),
    safeguards: asString(row.safeguards),
    sources: asString(row.sources)
      .split(";")
      .map((source) => source.trim())
      .filter(Boolean),
  }
}

export function mapStep2Row(row: GenericRow, index: number): Step2IntermediaryAssessment {
  return {
    id: `step2-${index + 1}`,
    intermediary: asString(row.intermediary),
    type: asString(row.type),
    whyRelevant: asString(row.whyRelevant),
    role: asString(row.role),
    geography: asString(row.geography),
    relationshipStatus: asString(row.relationshipStatus),
    linkedCountry: asString(row.linkedCountry),
    linkedBarrier: asString(row.linkedBarrier),
  }
}

export function mapStep3Row(row: GenericRow, index: number): Step3BarrierDiagnosis {
  return {
    id: `step3-${index + 1}`,
    linkedCountry: asString(row.linkedCountry),
    primaryBarrier: asString(row.primaryBarrier),
    barrierDescription: asString(row.barrierDescription),
    observableSigns: asString(row.observableSigns),
    projectStage: asString(row.projectStage) as Step3BarrierDiagnosis["projectStage"],
    recommendedTool: asString(row.recommendedTool),
    source: asString(row.source),
  }
}

export function mapStep4Row(row: GenericRow, index: number): Step4ToolReference {
  return {
    id: `step4-${index + 1}`,
    tool: asString(row.tool),
    description: asString(row.description),
    bestWhen: asString(row.bestWhen),
    strengths: asString(row.strengths).split(";").map((item) => item.trim()).filter(Boolean),
    weaknesses: asString(row.weaknesses).split(";").map((item) => item.trim()).filter(Boolean),
    riskMethodologies: asString(row.riskMethodologies)
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean),
    source: asString(row.source),
  }
}

export function mapStep5Row(row: GenericRow, index: number): Step5ExpansionReference {
  return {
    id: `step5-${index + 1}`,
    model: asString(row.model),
    description: asString(row.description),
    bestWhen: asString(row.bestWhen),
    pros: asString(row.pros).split(";").map((item) => item.trim()).filter(Boolean),
    cons: asString(row.cons).split(";").map((item) => item.trim()).filter(Boolean),
    implementationImplications: asString(row.implementationImplications),
  }
}

export function mapWorkbookFromRows(input: {
  instruction: string
  step1Rows: GenericRow[]
  step2Rows: GenericRow[]
  step3Rows: GenericRow[]
  step4Rows: GenericRow[]
  step5Rows: GenericRow[]
}): Omit<ScorecardWorkbookModel, "cases"> {
  return {
    instruction: input.instruction,
    step1: input.step1Rows.map(mapStep1Row),
    step2: input.step2Rows.map(mapStep2Row),
    step3: input.step3Rows.map(mapStep3Row),
    step4: input.step4Rows.map(mapStep4Row),
    step5: input.step5Rows.map(mapStep5Row),
  }
}
