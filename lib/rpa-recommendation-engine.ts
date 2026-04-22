import {
  BARRIER_REFERENCES,
  EXPANSION_REFERENCES,
  TOOL_REFERENCES,
} from "@/lib/rpa-reference-data"
import type {
  ExpansionIndicatorKey,
  IndicatorWeight,
  RecommendationResult,
  Step2Intermediary,
  Step3Diagnosis,
  ToolIndicatorKey,
} from "@/types/rpa"

const normalize = (value: string) => value.toLowerCase().trim()

const average = (values: number[]) =>
  values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : 0

const includesAny = (text: string, parts: string[]) =>
  parts.some((part) => normalize(text).includes(normalize(part)))

export const DEFAULT_TOOL_WEIGHTS: IndicatorWeight<ToolIndicatorKey>[] = [
  { key: "barrierFit", weight: 0.2 },
  { key: "mobilizationPotential", weight: 0.15 },
  { key: "financialAdditionality", weight: 0.15 },
  { key: "developmentAdditionality", weight: 0.15 },
  { key: "concessionalityDiscipline", weight: 0.1 },
  { key: "implementationFeasibility", weight: 0.15 },
  { key: "resultsImpactMeasurability", weight: 0.1 },
]

export const DEFAULT_EXPANSION_WEIGHTS: IndicatorWeight<ExpansionIndicatorKey>[] = [
  { key: "speed", weight: 0.2 },
  { key: "cost", weight: 0.15 },
  { key: "localOwnership", weight: 0.2 },
  { key: "scalability", weight: 0.15 },
  { key: "capacityBuilding", weight: 0.15 },
  { key: "regulatoryFeasibility", weight: 0.15 },
]

function normalizeToolName(value: string) {
  return value
    .replace("TA/grants", "Technical assistance / grants")
    .replace("Technical Assistant (TA)", "Technical assistance / grants")
    .trim()
}

function getBarrierMatch(barrierName: string) {
  return BARRIER_REFERENCES.find(
    (item) => normalize(item.category) === normalize(barrierName),
  )
}

function weightedToolBaseScore(
  weights: IndicatorWeight<ToolIndicatorKey>[],
  scores: Record<ToolIndicatorKey, number>,
) {
  return weights.reduce((sum, item) => sum + scores[item.key] * item.weight, 0)
}

function weightedExpansionBaseScore(
  weights: IndicatorWeight<ExpansionIndicatorKey>[],
  scores: Record<ExpansionIndicatorKey, number>,
) {
  return weights.reduce((sum, item) => sum + scores[item.key] * item.weight, 0)
}

export function recommendTools(
  diagnoses: Step3Diagnosis[],
  weights: IndicatorWeight<ToolIndicatorKey>[] = DEFAULT_TOOL_WEIGHTS,
): RecommendationResult[] {
  const matches = diagnoses
    .map((diagnosis) => ({
      diagnosis,
      barrier: getBarrierMatch(diagnosis.primaryBarrier),
    }))
    .filter((item) => item.barrier)

  return TOOL_REFERENCES.map((tool) => {
    const base = weightedToolBaseScore(weights, tool.baseScores)
    let bonus = 0
    const reasons: string[] = []

    matches.forEach(({ diagnosis, barrier }) => {
      const matchedTools = (barrier?.bestFitBlendedFinanceTools ?? []).map(
        normalizeToolName,
      )
      if (matchedTools.some((name) => normalize(name) === normalize(tool.tool))) {
        bonus += 1.5
        reasons.push(`Direct match for primary barrier: ${diagnosis.primaryBarrier}`)
      }

      if (
        diagnosis.projectStage &&
        includesAny(tool.bestWhen, diagnosis.projectStage.split("/"))
      ) {
        bonus += 0.5
        reasons.push(`Aligned with project stage: ${diagnosis.projectStage}`)
      }
    })

    if (!reasons.length) {
      reasons.push("Baseline score from Excel-derived indicator profile")
    }

    return {
      id: tool.id,
      name: tool.tool,
      score: Number((base + bonus).toFixed(2)),
      reasons: Array.from(new Set(reasons)).slice(0, 3),
    }
  }).sort((a, b) => b.score - a.score)
}

export function recommendExpansionOptions(
  diagnoses: Step3Diagnosis[],
  intermediaries: Step2Intermediary[],
  weights: IndicatorWeight<ExpansionIndicatorKey>[] = DEFAULT_EXPANSION_WEIGHTS,
): RecommendationResult[] {
  const barrierMatches = diagnoses
    .map((diagnosis) => ({
      diagnosis,
      barrier: getBarrierMatch(diagnosis.primaryBarrier),
    }))
    .filter((item) => item.barrier)

  const intermediaryText = intermediaries
    .map(
      (item) =>
        `${item.intermediaryName} ${item.type} ${item.intermediaryRoleInProject} ${item.strategicFit} ${item.notes}`,
    )
    .join(" ")
    .toLowerCase()

  const strongLocalBase =
    /(community|local|municipal|city|foundation|ngo|civil society)/.test(
      intermediaryText,
    )

  return EXPANSION_REFERENCES.map((option) => {
    const base = weightedExpansionBaseScore(weights, option.baseScores)
    let bonus = 0
    const reasons: string[] = []

    if (
      strongLocalBase &&
      ["Deepen Local", "Local Repurposing", "Local Hybrid"].includes(option.model)
    ) {
      bonus += 1
      reasons.push(
        "Existing intermediary landscape suggests usable local delivery base",
      )
    }

    barrierMatches.forEach(({ diagnosis, barrier }) => {
      const preferredOptions = barrier?.bestFitGlobalExpansionOptions ?? []
      if (
        preferredOptions.some(
          (item) => normalize(item) === normalize(option.model),
        )
      ) {
        bonus += 1.2
        reasons.push(
          `Good organizational fit for primary barrier: ${diagnosis.primaryBarrier}`,
        )
      }

      if (
        normalize(diagnosis.primaryBarrier).includes("capacity") &&
        ["Local Hybrid", "Local Repurposing", "Hybrid"].includes(option.model)
      ) {
        bonus += 0.6
        reasons.push(
          "Improves delivery support where implementation capacity is weak",
        )
      }
    })

    if (!reasons.length) {
      reasons.push("Baseline score from Excel-derived expansion profile")
    }

    return {
      id: option.id,
      name: option.model,
      score: Number((base + bonus).toFixed(2)),
      reasons: Array.from(new Set(reasons)).slice(0, 3),
    }
  }).sort((a, b) => b.score - a.score)
}

export function summarizeCountry(diagnoses: Step3Diagnosis[]) {
  return {
    barrierCount: diagnoses.length,
    primaryBarriers: Array.from(
      new Set(diagnoses.map((item) => item.primaryBarrier).filter(Boolean)),
    ),
    stages: Array.from(
      new Set(diagnoses.map((item) => item.projectStage).filter(Boolean)),
    ),
    averageStageTextLength: average(
      diagnoses.map((item) => item.projectStage?.length ?? 0),
    ),
  }
}
