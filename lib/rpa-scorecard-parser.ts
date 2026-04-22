import * as XLSX from "xlsx"
import type {
  ScorecardModel,
  Step1Assessment,
  Step2Intermediary,
  Step3Diagnosis,
} from "@/types/rpa"
import {
  BARRIER_REFERENCES,
  EXPANSION_REFERENCES,
  TOOL_REFERENCES,
} from "@/lib/rpa-reference-data"

const normalize = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()

const toJsonRows = (sheet: XLSX.WorkSheet): Record<string, unknown>[] =>
  XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  }) as Record<string, unknown>[]

const getValue = (row: Record<string, unknown>, aliases: string[]) => {
  for (const alias of aliases) {
    const key = Object.keys(row).find(
      (header) => normalize(header).toLowerCase() === alias.toLowerCase(),
    )
    if (key) return normalize(row[key])
  }
  return ""
}

function parseStep1(rows: Record<string, unknown>[]): Step1Assessment[] {
  return rows
    .filter((row) => getValue(row, ["country"]))
    .map((row) => ({
      country: getValue(row, ["country"]),
      sdgGoals: getValue(row, ["sdg goals / ndcs target", "sdg goals", "ndc target"]),
      countryChallenges: getValue(row, ["country challenges"]),
      backgroundInformation: getValue(row, ["background information", "background problem"]),
      existingProject: getValue(row, ["existing project / initiative addressing the challenge", "existing project"]),
      developmentRationale: getValue(row, ["development rationale for intervention", "development rationale"]),
      expectedResults: getValue(row, ["objectives / expected results", "expected results"]),
      safeguards: getValue(row, ["quality considerations / safeguards", "quality/safeguards", "safeguards"]),
      sources: getValue(row, ["sources"]),
    }))
}

function parseStep2(rows: Record<string, unknown>[]): Step2Intermediary[] {
  return rows
    .filter((row) => getValue(row, ["country"]) || getValue(row, ["intermediary", "intermediary name"]))
    .map((row) => ({
      country: getValue(row, ["country"]),
      projectContext: getValue(row, ["project context"]),
      intermediaryName: getValue(row, ["intermediary name", "intermediary"]),
      intermediaryDescription: getValue(row, ["intermediary description", "description"]),
      intermediaryRoleInProject: getValue(row, ["intermediary role in the project", "role", "intermediary role"]),
      type: getValue(row, ["type"]),
      strategicFit: getValue(row, ["strategic fit"]),
      notes: getValue(row, ["notes"]),
      sources: getValue(row, ["sources"]),
    }))
    .filter((row) => row.intermediaryName)
}

function parseStep3(rows: Record<string, unknown>[]): Step3Diagnosis[] {
  return rows
    .filter((row) => getValue(row, ["country"]))
    .map((row) => ({
      country: getValue(row, ["country"]),
      projectContext: getValue(row, ["project context"]),
      problemStatement: getValue(row, ["problem statement"]),
      primaryBarrier: getValue(row, ["primary barrier"]),
      secondaryBarrier: getValue(row, ["secondary barrier"]),
      evidence: getValue(row, ["evidence"]),
      projectStage: getValue(row, ["project stage"]),
      sources: getValue(row, ["sources"]),
    }))
    .filter((row) => row.primaryBarrier)
}

export function parseRpaScorecardWorkbook(file: ArrayBuffer): ScorecardModel {
  const workbook = XLSX.read(file, { type: "array" })

  const step1 = workbook.Sheets["Step 1"]
    ? parseStep1(toJsonRows(workbook.Sheets["Step 1"]))
    : []
  const step2 = workbook.Sheets["Step 2"]
    ? parseStep2(toJsonRows(workbook.Sheets["Step 2"]))
    : []
  const step3 = workbook.Sheets["Step 3"]
    ? parseStep3(toJsonRows(workbook.Sheets["Step 3"]))
    : []

  return {
    step1,
    step2,
    step3,
    barriers: BARRIER_REFERENCES,
    tools: TOOL_REFERENCES,
    expansions: EXPANSION_REFERENCES,
  }
}
