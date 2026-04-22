"use client"

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react"
import {
  Upload,
  FileSpreadsheet,
  ArrowRightLeft,
  Lightbulb,
  Globe2,
  ShieldCheck,
} from "lucide-react"
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
  capabilityTransfer: "Capability transfer",
  implementationRisk: "Implementation risk",
}

function weightsToMap<T extends string>(items: { key: T; weight: number }[]) {
  return items.reduce((acc, item) => {
    acc[item.key] = item.weight
    return acc
  }, {} as WeightMap<T>)
}

function mapToWeights<T extends string>(value: WeightMap<T>) {
  return Object.entries(value).map(([key, weight]) => ({ key: key as T, weight }))
}

export function RpaScorecardDashboard() {
  const [model, setModel] = useState<ScorecardModel | null>(null)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [toolWeights, setToolWeights] = useState<WeightMap<ToolIndicatorKey>>(
    weightsToMap(DEFAULT_TOOL_WEIGHTS),
  )
  const [expansionWeights, setExpansionWeights] = useState<
    WeightMap<ExpansionIndicatorKey>
  >(weightsToMap(DEFAULT_EXPANSION_WEIGHTS))

  const countries = useMemo(() => {
    if (!model) return []
    return Array.from(
      new Set([
        ...model.step1.map((item) => item.country),
        ...model.step2.map((item) => item.country),
        ...model.step3.map((item) => item.country),
      ].filter(Boolean)),
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

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const arrayBuffer = await file.arrayBuffer()
    const parsed = parseRpaScorecardWorkbook(arrayBuffer)
    setModel(parsed)
    setSelectedCountry(parsed.step1[0]?.country ?? parsed.step3[0]?.country ?? "")
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
        </CardContent>
      </Card>

      {model && activeCountry ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
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
                <CardTitle>Observed stages</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {summary.stages.map((item) => (
                  <Badge key={item} variant="outline">
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

          <Tabs defaultValue="tools" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tools">Blended finance tools</TabsTrigger>
              <TabsTrigger value="expansion">Global expansion</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4">
              <WeightEditor
                title="Tool scoring weights"
                icon={<ArrowRightLeft className="h-4 w-4" />}
                labels={toolLabelMap}
                values={toolWeights}
                onChange={setToolWeights}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {toolRecommendations.map((item, index) => (
                  <Card key={item.id} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-4">
                        <span>
                          {index + 1}. {item.name}
                        </span>
                        <Badge>{item.score.toFixed(2)}</Badge>
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
            </TabsContent>

            <TabsContent value="expansion" className="space-y-4">
              <WeightEditor
                title="Expansion scoring weights"
                icon={<Globe2 className="h-4 w-4" />}
                labels={expansionLabelMap}
                values={expansionWeights}
                onChange={setExpansionWeights}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {expansionRecommendations.map((item, index) => (
                  <Card key={item.id} className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-4">
                        <span>
                          {index + 1}. {item.name}
                        </span>
                        <Badge>{item.score.toFixed(2)}</Badge>
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
            </TabsContent>

            <TabsContent value="evidence">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Step 3 evidence log</CardTitle>
                  <CardDescription>
                    Keep the narrative from the Excel workbook visible instead of
                    flattening it away.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filtered.step3.map((item, index) => (
                    <div
                      key={`${item.country}-${index}`}
                      className="rounded-xl border p-4"
                    >
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">{item.primaryBarrier}</Badge>
                        {item.projectStage ? (
                          <Badge variant="outline">{item.projectStage}</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium">{item.projectContext}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.problemStatement}
                      </p>
                      <p className="mt-3 text-sm">{item.evidence}</p>
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
  const total = Object.values(values).reduce((sum, value) => sum + value, 0)

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
        {Object.entries(labels).map(([key, label]) => {
          const typedKey = key as T
          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium">{values[typedKey].toFixed(2)}</span>
              </div>
              <Slider
                value={[values[typedKey] * 100]}
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
