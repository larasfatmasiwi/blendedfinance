import type * as XLSXType from "xlsx"
import {
  scoringDimensions,
  type BarrierDiagnosis,
  type BlendedFinanceRecommendation,
  type CountryAssessment,
  type GlobalExpansionRecommendation,
  type IntermediaryMapping,
  type ScorecardByCountry,
} from "@/lib/workflow-types"

const DEFAULT_SCORE = 5

const createScenario = (country: string) => ({
  countryAssessment: { country } as CountryAssessment,
  intermediaryMapping: [] as IntermediaryMapping[],
  barrierDiagnosis: [] as BarrierDiagnosis[],
  blendedFinanceRecommendation: [] as BlendedFinanceRecommendation[],
  globalExpansionRecommendation: [] as GlobalExpansionRecommendation[],
})

const normalize = (value: unknown) => String(value ?? "").trim()

const findValue = (row: Record<string, unknown>, aliases: string[]) => {
  for (const alias of aliases) {
    const key = Object.keys(row).find((k) => k.toLowerCase().trim() === alias.toLowerCase().trim())
    if (key) return normalize(row[key])
  }
  return ""
}

const toScore = (value: unknown) => {
  const parsed = Number(value)
  if (Number.isFinite(parsed)) return Math.min(10, Math.max(0, parsed))
  return DEFAULT_SCORE
}

const parseLegacyFlatRows = (rows: unknown[][]): ScorecardByCountry => {
  const parsed: ScorecardByCountry = {}
  const dataRows = rows.slice(1)

  for (const row of dataRows) {
    if (!row?.length) continue
    const country = normalize(row[0])
    const instrument = normalize(row[1])
    if (!country || !instrument) continue

    if (!parsed[country]) parsed[country] = createScenario(country)

    const dimensionScores = scoringDimensions.reduce((acc, item, index) => {
      acc[item.key] = toScore(row[index + 2])
      return acc
    }, {} as Record<(typeof scoringDimensions)[number]["key"], number>)

    parsed[country].blendedFinanceRecommendation.push({
      instrument,
      fitScore:
        Object.values(dimensionScores).reduce((total, score) => total + score, 0) /
        scoringDimensions.length,
      rationale: "Imported from legacy matrix workbook format.",
      dimensionScores,
    })
  }

  return parsed
}

const stepSheetType = (sheetName: string) => {
  const lower = sheetName.toLowerCase()
  if (lower.includes("step 1") || lower.includes("country")) return 1
  if (lower.includes("step 2") || lower.includes("intermediary")) return 2
  if (lower.includes("step 3") || lower.includes("barrier")) return 3
  if (lower.includes("step 4") || lower.includes("blend")) return 4
  if (lower.includes("step 5") || lower.includes("expansion") || lower.includes("global")) return 5
  return 0
}

export const parseScorecardWorkbook = (XLSX: typeof XLSXType, workbook: XLSXType.WorkBook): ScorecardByCountry => {
  const parsed: ScorecardByCountry = {}

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const firstRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][]
  const header = (firstRows[0] ?? []).map((item) => normalize(item).toLowerCase())

  if (header.includes("country") && header.includes("strategy")) {
    return parseLegacyFlatRows(firstRows)
  }

  for (const sheetName of workbook.SheetNames) {
    const stepType = stepSheetType(sheetName)
    if (!stepType) continue

    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[]

    for (const row of rows) {
      const country =
        findValue(row, ["Country", "Market", "Country / Market"]) ||
        findValue(row, ["Target Market", "Target country"]) ||
        "Unspecified Country"

      if (!parsed[country]) parsed[country] = createScenario(country)
      const scenario = parsed[country]

      if (stepType === 1) {
        scenario.countryAssessment = {
          country,
          region: findValue(row, ["Region"]),
          incomeLevel: findValue(row, ["Income level", "Income Level"]),
          marketMaturity: findValue(row, ["Market maturity", "Readiness", "Market Readiness"]),
          macroNotes: findValue(row, ["Notes", "Macro notes", "Assessment notes"]),
        }
      }

      if (stepType === 2) {
        const name = findValue(row, ["Intermediary", "Name", "Intermediary name"])
        if (!name) continue
        scenario.intermediaryMapping.push({
          intermediaryType: findValue(row, ["Type", "Intermediary type"]),
          name,
          role: findValue(row, ["Role"]),
          maturity: findValue(row, ["Maturity"]),
          notes: findValue(row, ["Notes"]),
        })
      }

      if (stepType === 3) {
        const barrier = findValue(row, ["Barrier", "Constraint"])
        if (!barrier) continue
        scenario.barrierDiagnosis.push({
          barrier,
          severity: findValue(row, ["Severity", "Priority"]),
          evidence: findValue(row, ["Evidence", "Data point"]),
          owner: findValue(row, ["Owner", "Responsible party"]),
        })
      }

      if (stepType === 4) {
        const instrument = findValue(row, ["Instrument", "Recommendation", "Strategy"])
        if (!instrument) continue
        const dimensionScores = scoringDimensions.reduce((acc, item) => {
          const value = findValue(row, [item.label, item.key])
          if (value !== "") {
            acc[item.key] = toScore(value)
          }
          return acc
        }, {} as Partial<Record<(typeof scoringDimensions)[number]["key"], number>>)

        scenario.blendedFinanceRecommendation.push({
          instrument,
          rationale: findValue(row, ["Rationale", "Why"]),
          fitScore: toScore(findValue(row, ["Fit score", "Total score", "Score"])),
          dimensionScores,
        })
      }

      if (stepType === 5) {
        const targetMarket = findValue(row, ["Target Market", "Expansion Market", "Market"])
        if (!targetMarket) continue
        scenario.globalExpansionRecommendation.push({
          targetMarket,
          priority: findValue(row, ["Priority"]),
          rationale: findValue(row, ["Rationale", "Why"]),
          prerequisites: findValue(row, ["Prerequisites", "Dependencies"]),
        })
      }
    }
  }

  return parsed
}
