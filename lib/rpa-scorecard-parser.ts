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

function parseStep1(rows: Record<string, unknown>[]): Step1Assessment[] {
  return rows
    .filter((row) => normalize(row["Country"]))
    .map((row) => ({
      country: normalize(row["Country"]),
      sdgGoals: normalize(row["SDG Goals / NDCs Target"]),
      countryChallenges: normalize(row["Country Challenges"]),
      backgroundProblem: normalize(row["Background Problem"]),
      existingProject: normalize(
        row["Existing Project / Initiative Addressing the Challenge"],
      ),
      developmentRationale: normalize(
        row["Development Rationale for Intervention"],
      ),
      objectives: normalize(row["Objectives / Expected Results"]),
      safeguards: normalize(row["Quality Considerations / Safeguards"]),
      sources: normalize(row["Sources"]),
    }))
}

function parseStep2(rows: Record<string, unknown>[]): Step2Intermediary[] {
  return rows
    .filter((row) => normalize(row["Country"]) || normalize(row["Intermediary"]))
    .map((row) => ({
      country: normalize(row["Country"]),
      intermediary: normalize(row["Intermediary"]),
      type: normalize(row["Type"]),
      role: normalize(row["Role"]),
      fit: normalize(row["Strategic Fit"]),
      notes: normalize(row["Notes"]),
      sources: normalize(row["Sources"]),
    }))
}

function parseStep3(rows: Record<string, unknown>[]): Step3Diagnosis[] {
  return rows
    .filter((row) => normalize(row["Country"]))
    .map((row) => ({
      country: normalize(row["Country"]),
      projectContext: normalize(row["Project Context"]),
      problemStatement: normalize(row["Problem Statement"]),
      primaryBarrier: normalize(row["Primary Barrier"]),
      secondaryBarrier: normalize(row["Secondary Barrier"]),
      evidence: normalize(row["Evidence"]),
      projectStage: normalize(row["Project Stage"]),
      sources: normalize(row["Sources"]),
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
