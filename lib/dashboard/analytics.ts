import type { ScorecardWorkbookModel } from "@/types/dashboard/scorecard"

const tally = (items: string[]) =>
  Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item] = (acc[item] ?? 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

export function buildOverviewMetrics(model: ScorecardWorkbookModel) {
  return {
    countriesAnalyzed: new Set(model.step1.map((item) => item.country)).size,
    existingProjects: model.step1.filter((item) => item.existingProject).length,
    intermediariesMapped: model.step2.length,
    barrierCategories: new Set(model.step3.map((item) => item.primaryBarrier)).size,
    toolRecommendations: new Set(model.step3.map((item) => item.recommendedTool)).size,
    expansionModels: new Set(model.step5.map((item) => item.model)).size,
  }
}

export function buildOverviewCharts(model: ScorecardWorkbookModel) {
  return {
    barrierFrequency: tally(model.step3.map((item) => item.primaryBarrier)),
    toolFrequency: tally(model.step3.map((item) => item.recommendedTool)),
    expansionFrequency: tally(model.cases.map((item) => item.expansionModel.model)),
    stagePipeline: tally(model.step3.map((item) => item.projectStage)),
  }
}
