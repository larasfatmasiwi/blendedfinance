"use client"

import { useMemo, useRef, useState } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { parseScorecardWorkbook } from "@/lib/workbook-parser"
import { scoringDimensions, type ScorecardByCountry } from "@/lib/workflow-types"

const emptyScorecard = (): ScorecardByCountry => ({
  "United States": {
    countryAssessment: {
      country: "United States",
      region: "North America",
      incomeLevel: "High income",
      marketMaturity: "Mature",
      macroNotes: "Replace by uploading your scorecard workbook.",
    },
    intermediaryMapping: [],
    barrierDiagnosis: [],
    blendedFinanceRecommendation: [],
    globalExpansionRecommendation: [],
  },
})

const stepLabels = [
  "Step 1: Country assessment",
  "Step 2: Intermediary mapping",
  "Step 3: Barrier diagnosis",
  "Step 4: Blended finance recommendation",
  "Step 5: Global expansion recommendation",
]

export default function ScorecardWorkflowDashboard() {
  const [scorecardData, setScorecardData] = useState<ScorecardByCountry>(emptyScorecard())
  const [selectedCountry, setSelectedCountry] = useState("United States")
  const [selectedStep, setSelectedStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const countryList = useMemo(() => Object.keys(scorecardData), [scorecardData])
  const currentScenario = scorecardData[selectedCountry] || scorecardData[countryList[0]]

  const chartData = useMemo(() => {
    const topRecommendations = (currentScenario?.blendedFinanceRecommendation || []).slice(0, 3)
    return scoringDimensions.map((dimension) => {
      const dataPoint: Record<string, number | string> = { subject: dimension.label }
      topRecommendations.forEach((recommendation) => {
        dataPoint[recommendation.instrument] = recommendation.dimensionScores?.[dimension.key] ?? 0
      })
      return dataPoint
    })
  }, [currentScenario])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileName = file.name.toLowerCase()
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls")

    if (!isExcel) {
      alert("Please upload an Excel workbook (.xlsx or .xls) matching your 5-step scorecard.")
      return
    }

    try {
      const XLSX = await import("xlsx")
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const parsed = parseScorecardWorkbook(XLSX, workbook)

      if (Object.keys(parsed).length === 0) {
        alert("No scorecard rows were found. Check your sheet names and headers.")
        return
      }

      setScorecardData(parsed)
      const firstCountry = Object.keys(parsed)[0]
      if (firstCountry) setSelectedCountry(firstCountry)
      setSelectedStep(1)
      alert("Scorecard workbook uploaded successfully.")
    } catch (error) {
      console.error("Upload error", error)
      alert("Unable to parse workbook. Confirm your Excel sheets follow the 5-step structure.")
    }
  }

  const clearUploadedData = () => {
    setScorecardData(emptyScorecard())
    setSelectedCountry("United States")
    setSelectedStep(1)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const downloadTemplate = async () => {
    const XLSX = await import("xlsx")

    const step1 = XLSX.utils.json_to_sheet([
      { Country: "Kenya", Region: "Africa", "Income level": "Lower middle income", "Market maturity": "Emerging", "Assessment notes": "Strong demand for renewable mini-grid financing" },
    ])
    const step2 = XLSX.utils.json_to_sheet([
      { Country: "Kenya", "Intermediary name": "Local Development Bank", "Intermediary type": "DFI", Role: "Anchor lender", Maturity: "Advanced", Notes: "Strong rural portfolio" },
    ])
    const step3 = XLSX.utils.json_to_sheet([
      { Country: "Kenya", Barrier: "Currency volatility", Severity: "High", Evidence: "USD debt costs spike in drought years", Owner: "Private lenders" },
    ])
    const step4 = XLSX.utils.json_to_sheet([
      {
        Country: "Kenya",
        Instrument: "Guarantee / risk-sharing",
        Rationale: "De-risks local lender participation for first-time projects",
        "Fit score": 8,
        "Barrier fit": 9,
        "Mobilization potential": 8,
        "Financial additionality": 8,
        "Development additionality": 7,
        "Concessionality discipline": 7,
        "Implementation feasibility": 7,
        "Results / impact measurability": 8,
      },
    ])
    const step5 = XLSX.utils.json_to_sheet([
      { Country: "Kenya", "Target Market": "Tanzania", Priority: "High", Rationale: "Comparable market constraints and pipeline", Prerequisites: "Partner due diligence completed" },
    ])

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, step1, "Step 1 - Country assessment")
    XLSX.utils.book_append_sheet(workbook, step2, "Step 2 - Intermediary mapping")
    XLSX.utils.book_append_sheet(workbook, step3, "Step 3 - Barrier diagnosis")
    XLSX.utils.book_append_sheet(workbook, step4, "Step 4 - Recommendation")
    XLSX.utils.book_append_sheet(workbook, step5, "Step 5 - Global expansion")
    XLSX.writeFile(workbook, "blended_finance_scorecard_template.xlsx")
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Workflow Scorecard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Blended Finance Workflow Dashboard</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Upload Workbook
              </label>
              <button onClick={downloadTemplate} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Download 5-Step Template
              </button>
              <button onClick={clearUploadedData} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Reset Data
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">Workbook parser supports:</p>
            <p className="mt-1">• Legacy flat matrix format: Country + Strategy + seven dimension scores.</p>
            <p className="mt-1">• 5-sheet scorecard format aligned to Steps 1-5 (country, intermediary, barrier, recommendation, expansion).</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Select Country</h2>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full md:w-64 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                {countryList.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {stepLabels.map((label, index) => (
                <button
                  key={label}
                  onClick={() => setSelectedStep(index + 1)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                    selectedStep === index + 1
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {selectedStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Country assessment</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <InfoCard label="Country" value={currentScenario?.countryAssessment.country} />
                <InfoCard label="Region" value={currentScenario?.countryAssessment.region} />
                <InfoCard label="Income level" value={currentScenario?.countryAssessment.incomeLevel} />
                <InfoCard label="Market maturity" value={currentScenario?.countryAssessment.marketMaturity} />
                <InfoCard label="Notes" value={currentScenario?.countryAssessment.macroNotes} className="sm:col-span-2" />
              </div>
            </div>
          )}

          {selectedStep === 2 && (
            <DataTable
              title="Intermediary mapping"
              headers={["Type", "Name", "Role", "Maturity", "Notes"]}
              rows={(currentScenario?.intermediaryMapping || []).map((item) => [item.intermediaryType, item.name, item.role, item.maturity, item.notes])}
            />
          )}

          {selectedStep === 3 && (
            <DataTable
              title="Barrier diagnosis"
              headers={["Barrier", "Severity", "Evidence", "Owner"]}
              rows={(currentScenario?.barrierDiagnosis || []).map((item) => [item.barrier, item.severity, item.evidence, item.owner])}
            />
          )}

          {selectedStep === 4 && (
            <div>
              <DataTable
                title="Blended finance recommendation"
                headers={["Instrument", "Fit score", "Rationale"]}
                rows={(currentScenario?.blendedFinanceRecommendation || []).map((item) => [item.instrument, item.fitScore, item.rationale])}
              />

              {currentScenario?.blendedFinanceRecommendation?.length ? (
                <div className="mt-6 h-[420px] w-full rounded-2xl border border-slate-200 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="70%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
                      <Tooltip />
                      {currentScenario.blendedFinanceRecommendation.slice(0, 3).map((recommendation, index) => (
                        <Radar
                          key={recommendation.instrument}
                          name={recommendation.instrument}
                          dataKey={recommendation.instrument}
                          stroke={["#4f46e5", "#0ea5e9", "#10b981"][index]}
                          fill={["#4f46e5", "#0ea5e9", "#10b981"][index]}
                          fillOpacity={0.2}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : null}
            </div>
          )}

          {selectedStep === 5 && (
            <DataTable
              title="Global expansion recommendation"
              headers={["Target market", "Priority", "Rationale", "Prerequisites"]}
              rows={(currentScenario?.globalExpansionRecommendation || []).map((item) => [item.targetMarket, item.priority, item.rationale, item.prerequisites])}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function DataTable({
  title,
  headers,
  rows,
}: {
  title: string
  headers: string[]
  rows: Array<Array<string | number | undefined>>
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-700">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-slate-500" colSpan={headers.length}>No rows found for this step in the uploaded workbook.</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${index}-${cellIndex}`} className="px-4 py-3">{cell || "-"}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InfoCard({ label, value, className = "" }: { label: string; value?: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 p-4 ${className}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-800">{value || "-"}</p>
    </div>
  )
}
