"use client"

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react"
import {
  Upload,
  FileSpreadsheet,
  ArrowRightLeft,
  Lightbulb,
  Globe2,
  ShieldCheck,
  FileDown,
} from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { parseRpaScorecardWorkbook } from "@/lib/rpa-scorecard-parser"
import {
  DEFAULT_EXPANSION_WEIGHTS,
  DEFAULT_TOOL_WEIGHTS,
  recommendExpansionOptions,
  recommendTools,
  summarizeCountry,
} from "@/lib/rpa-recommendation-engine"
import type {
  ExpansionIndicatorKey,
  ScorecardModel,
  ToolIndicatorKey,
} from "@/types/rpa"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type WeightMap<T extends string> = Record<T, number>

const toolLabelMap: Record<ToolIndicatorKey, string> = {
  barrierFit: "Barrier fit",
  mobilizationPotential: "Mobilization potential",
  financialAdditionality: "Financial additionality",
  developmentAdditionality: "Development additionality",
  concessionalityDiscipline: "Concessionality discipline",
  implementationFeasibility: "Implementation feasibility",
  resultsImpactMeasurability: "Results / impact measurability",
}

const expansionLabelMap: Record<ExpansionIndicatorKey, string> = {
  speed: "Speed",
  cost: "Cost",
  localOwnership: "Local ownership",
  scalability: "Scalability",
  capacityBuilding: "Capacity building",
  regulatoryFeasibility: "Regulatory feasibility",
}

const toolIndicatorGuidance: Record<ToolIndicatorKey, string> = {
  barrierFit:
    "How directly the tool addresses the primary barrier that has been identified.",
  mobilizationPotential:
    "How strongly the tool can attract additional private or commercial capital.",
  financialAdditionality:
    "Whether the tool enables a transaction that otherwise would not happen, or would only happen at a smaller scale, lower quality, or shorter tenor.",
  developmentAdditionality:
    "Whether the tool generates development value beyond the financing itself.",
  concessionalityDiscipline:
    "Whether concessional support is kept minimal and well targeted, rather than creating excessive subsidy.",
  implementationFeasibility:
    "How realistic the tool is to structure, approve, govern, and implement in the actual context.",
  resultsImpactMeasurability:
    "How clearly outputs, outcomes, and longer-term impacts can be measured.",
}

const expansionIndicatorGuidance: Record<ExpansionIndicatorKey, string> = {
  speed:
    "How quickly the model can be launched, staffed, governed, and made operational.",
  cost:
    "The relative resource efficiency of the model, including setup cost, operating cost, and infrastructure burden.",
  localOwnership:
    "The extent to which the model embeds local leadership, decision-making, legitimacy, and community agency.",
  scalability:
    "The potential for the model to be replicated, expanded geographically, and implemented across larger volumes or multiple jurisdictions.",
  capacityBuilding:
    "The ability of the model to strengthen local institutional capability, talent, and broader ecosystem development.",
  regulatoryFeasibility:
    "How workable the model is within the legal, charitable, fiscal, and governance constraints of the target geography.",
}

function weightsToMap<T extends string>(items: { key: T; weight: number }[]) {
  return items.reduce((acc, item) => {
    acc[item.key] = item.weight
    return acc
  }, {} as WeightMap<T>)
}

function mapToWeights<T extends string>(value: WeightMap<T>) {
  return (Object.entries(value) as [T, number][]).map(([key, weight]) => ({
    key,
    weight,
  }))
}

function scoreBg(score: number) {
  if (score >= 8) return "bg-emerald-100 text-emerald-800"
  if (score >= 6) return "bg-lime-100 text-lime-800"
  if (score >= 4) return "bg-amber-100 text-amber-800"
  return "bg-rose-100 text-rose-800"
}

const flagMap: Record<string, string> = {
  "United States": "🇺🇸",
  Indonesia: "🇮🇩",
  Kenya: "🇰🇪",
  India: "🇮🇳",
  Nigeria: "🇳🇬",
  Brazil: "🇧🇷",
  "United Kingdom": "🇬🇧",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Japan: "🇯🇵",
}

function getCountryFlag(country: string) {
  return flagMap[country] ?? "🌍"
}

export function RpaScorecardDashboard() {
  const [model, setModel] = useState<ScorecardModel | null>(null)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [showAllTools, setShowAllTools] = useState(false)
  const [showAllExpansions, setShowAllExpansions] = useState(false)
  const [toolWeights, setToolWeights] = useState<WeightMap<ToolIndicatorKey>>(
    weightsToMap(DEFAULT_TOOL_WEIGHTS),
  )
  const [expansionWeights, setExpansionWeights] = useState<
    WeightMap<ExpansionIndicatorKey>
  >(weightsToMap(DEFAULT_EXPANSION_WEIGHTS))

  const countries = useMemo(() => {
    if (!model) return []
    return Array.from(
      new Set(
        [
          ...model.step1.map((item) => item.country),
          ...model.step2.map((item) => item.country),
          ...model.step3.map((item) => item.country),
        ].filter(Boolean),
      ),
    ).sort()
  }, [model])

  const activeCountry = selectedCountry || countries[0] || ""

  const filtered = useMemo(() => {
    if (!model || !activeCountry) {
      return {
        step1: [],
        step2: [],
        step3: [],
      }
    }

    return {
      step1: model.step1.filter((item) => item.country === activeCountry),
      step2: model.step2.filter((item) => item.country === activeCountry),
      step3: model.step3.filter((item) => item.country === activeCountry),
    }
  }, [model, activeCountry])

  const toolRecommendations = useMemo(() => {
    return recommendTools(filtered.step3, mapToWeights(toolWeights))
  }, [filtered.step3, toolWeights])

  const expansionRecommendations = useMemo(() => {
    return recommendExpansionOptions(
      filtered.step3,
      filtered.step2,
      mapToWeights(expansionWeights),
    )
  }, [filtered.step2, filtered.step3, expansionWeights])

  const summary = useMemo(() => summarizeCountry(filtered.step3), [filtered.step3])

  const displayedTools = showAllTools
    ? toolRecommendations
    : toolRecommendations.slice(0, 3)
  const displayedExpansions = showAllExpansions
    ? expansionRecommendations
    : expansionRecommendations.slice(0, 3)

  const expansionRadarData = useMemo(() => {
    return Object.entries(expansionLabelMap).map(([key, label]) => {
      const row: Record<string, number | string> = { indicator: label }
      displayedExpansions.forEach((option) => {
        const reference = model?.expansions.find((item) => item.id === option.id)
        row[option.name] = reference?.baseScores[key as ExpansionIndicatorKey] ?? 0
      })
      return row
    })
  }, [displayedExpansions, model])

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const arrayBuffer = await file.arrayBuffer()
    const parsed = parseRpaScorecardWorkbook(arrayBuffer)
    setModel(parsed)
    setSelectedCountry(parsed.step1[0]?.country ?? parsed.step3[0]?.country ?? "")
  }

  function downloadPdfReport() {
    if (!activeCountry) return
    const topTool = toolRecommendations[0]
    const topExpansion = expansionRecommendations[0]
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>RPA Scorecard Report - ${activeCountry}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin-bottom: 4px; }
            .muted { color: #64748b; }
            .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin: 12px 0; }
            ul { margin: 8px 0; }
          </style>
        </head>
        <body>
          <h1>${getCountryFlag(activeCountry)} ${activeCountry} - RPA Workflow Report</h1>
          <p class="muted">Generated: ${new Date().toLocaleDateString()}</p>

          <div class="box">
            <h3>Barrier diagnosis summary</h3>
            <p>Diagnoses loaded: ${summary.barrierCount}</p>
            <p>Primary barriers: ${summary.primaryBarriers.join(", ") || "-"}</p>
          </div>

          <div class="box">
            <h3>Top blended finance recommendation</h3>
            <p><strong>${topTool?.name ?? "-"}</strong> (fit score: ${topTool?.score?.toFixed(2) ?? "-"})</p>
            <ul>${(topTool?.reasons || []).map((reason) => `<li>${reason}</li>`).join("")}</ul>
          </div>

          <div class="box">
            <h3>Top global expansion recommendation</h3>
            <p><strong>${topExpansion?.name ?? "-"}</strong> (fit score: ${topExpansion?.score?.toFixed(2) ?? "-"})</p>
            <ul>${(topExpansion?.reasons || []).map((reason) => `<li>${reason}</li>`).join("")}</ul>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            RPA Scorecard Dashboard
          </CardTitle>
          <CardDescription>
            Upload the Excel workbook and convert the 5-step workflow into
            structured recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <Label htmlFor="workbook">Upload workbook</Label>
            <Input
              id="workbook"
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={activeCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="button" onClick={downloadPdfReport} variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Download report (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>

      {model && activeCountry ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {getCountryFlag(activeCountry)} {activeCountry}
                </CardTitle>
                <CardDescription>Selected country context</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Primary barriers</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {summary.primaryBarriers.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Diagnoses loaded</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {summary.barrierCount}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="step1" className="space-y-4">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="step1">Country assessment</TabsTrigger>
              <TabsTrigger value="step2">Intermediary mapping</TabsTrigger>
              <TabsTrigger value="step3">Barrier diagnosis</TabsTrigger>
              <TabsTrigger value="tools">Blended finance tools</TabsTrigger>
              <TabsTrigger value="expansion">Global expansion</TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Step 1 - Country assessment details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filtered.step1.map((item, index) => (
                    <div key={`${item.country}-${index}`} className="rounded-xl border p-4 grid gap-3 md:grid-cols-2">
                      <Info label="SDG Goals / NDCs Target" value={item.sdgGoals} />
                      <Info label="Country Challenges" value={item.countryChallenges} />
                      <Info label="Background Information" value={item.backgroundInformation} />
                      <Info label="Development Rationale" value={item.developmentRationale} />
                      <Info label="Expected Results" value={item.expectedResults} />
                      <Info label="Quality / Safeguards" value={item.safeguards} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Step 2 - Intermediary mapping details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filtered.step2.map((item, index) => (
                    <div key={`${item.country}-${index}`} className="rounded-xl border p-4 grid gap-3 md:grid-cols-2">
                      <Info label="Project Context" value={item.projectContext} />
                      <Info label="Intermediary Name" value={item.intermediaryName} />
                      <Info label="Intermediary Description" value={item.intermediaryDescription} />
                      <Info label="Intermediary Role in the Project" value={item.intermediaryRoleInProject} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step3">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Step 3 - Barrier diagnosis details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filtered.step3.map((item, index) => (
                    <div key={`${item.country}-${index}`} className="rounded-xl border p-4 grid gap-3 md:grid-cols-2">
                      <Info label="Project Context" value={item.projectContext} />
                      <Info label="Problem Statement" value={item.problemStatement} />
                      <Info label="Primary Barrier" value={item.primaryBarrier} />
                      <Info label="Secondary Barrier" value={item.secondaryBarrier} />
                      <Info label="Evidence" value={item.evidence} />
                      <Info label="Project Stage" value={item.projectStage} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <WeightEditor
                title="Tool scoring weights"
                icon={<ArrowRightLeft className="h-4 w-4" />}
                labels={toolLabelMap}
                values={toolWeights}
                onChange={setToolWeights}
              />
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowAllTools((v) => !v)}>
                  {showAllTools ? "Show top recommendations" : "See all blended finance tools"}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {displayedTools.map((item, index) => (
                  <Card key={item.id} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-4">
                        <span>
                          {index + 1}. {item.name}
                        </span>
                        <Badge>Fit: {item.score.toFixed(2)}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      {item.reasons.map((reason) => (
                        <div key={reason} className="flex gap-2">
                          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Tool indicator heat map</CardTitle>
                  <CardDescription>Score scale: 0-10 (higher is better fit).</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tool</th>
                        {Object.values(toolLabelMap).map((label) => (
                          <th key={label} className="text-left p-2">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {model.tools.map((tool) => (
                        <tr key={tool.id} className="border-b">
                          <td className="p-2 font-medium">{tool.tool}</td>
                          {Object.keys(toolLabelMap).map((key) => {
                            const score = tool.baseScores[key as ToolIndicatorKey]
                            return (
                              <td key={key} className="p-2">
                                <span className={`px-2 py-1 rounded ${scoreBg(score)}`}>
                                  {score}
                                </span>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Indicators guidance</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {Object.entries(toolIndicatorGuidance).map(([key, text]) => (
                    <div key={key} className="rounded-xl border p-3">
                      <p className="font-medium">{toolLabelMap[key as ToolIndicatorKey]}</p>
                      <p className="text-sm text-muted-foreground mt-1">{text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expansion" className="space-y-4">
              <WeightEditor
                title="Expansion scoring weights"
                icon={<Globe2 className="h-4 w-4" />}
                labels={expansionLabelMap}
                values={expansionWeights}
                onChange={setExpansionWeights}
              />
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowAllExpansions((v) => !v)}>
                  {showAllExpansions ? "Show top options" : "See all global expansion options"}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {displayedExpansions.map((item, index) => (
                  <Card key={item.id} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-4">
                        <span>
                          {index + 1}. {item.name}
                        </span>
                        <Badge>Fit: {item.score.toFixed(2)}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      {item.reasons.map((reason) => (
                        <div key={reason} className="flex gap-2">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Global expansion radar chart</CardTitle>
                </CardHeader>
                <CardContent className="h-[430px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={expansionRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 10]} />
                      <Tooltip />
                      {displayedExpansions.map((option, index) => (
                        <Radar
                          key={option.id}
                          name={option.name}
                          dataKey={option.name}
                          stroke={["#4f46e5", "#0891b2", "#16a34a", "#f59e0b", "#db2777"][index % 5]}
                          fill={["#4f46e5", "#0891b2", "#16a34a", "#f59e0b", "#db2777"][index % 5]}
                          fillOpacity={0.15}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Indicators guidance</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {Object.entries(expansionIndicatorGuidance).map(([key, text]) => (
                    <div key={key} className="rounded-xl border p-3">
                      <p className="font-medium">{expansionLabelMap[key as ExpansionIndicatorKey]}</p>
                      <p className="text-sm text-muted-foreground mt-1">{text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p>Upload the workbook to render the Excel-driven workflow.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function WeightEditor<T extends string>({
  title,
  icon,
  labels,
  values,
  onChange,
}: {
  title: string
  icon: ReactNode
  labels: Record<T, string>
  values: Record<T, number>
  onChange: (value: Record<T, number>) => void
}) {
  const total = Object.values(values).reduce<number>(
    (sum, value) => sum + Number(value),
    0,
  )

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          Tune how strongly each indicator influences recommendation ranking.
          Current total: {total.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {(Object.entries(labels) as [T, string][]).map(([key, label]) => {
          const typedKey = key as T
          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium">
                  {Number(values[typedKey]).toFixed(2)}
                </span>
              </div>
              <Slider
                value={[Number(values[typedKey]) * 100]}
                min={0}
                max={100}
                step={5}
                onValueChange={([next]) =>
                  onChange({
                    ...values,
                    [typedKey]: next / 100,
                  })
                }
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value || "-"}</p>
    </div>
  )
}
