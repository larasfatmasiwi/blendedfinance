"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Download, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockWorkbook } from "@/lib/dashboard/mock-data"
import { buildOverviewCharts, buildOverviewMetrics } from "@/lib/dashboard/analytics"
import { recommendExpansionModel, recommendToolByBarrier } from "@/lib/dashboard/recommendation-engine"
import type { CaseRecord } from "@/types/dashboard/scorecard"
import { CaseDetailDrawer } from "@/components/dashboard/case-detail-drawer"
import { CaseTable } from "@/components/dashboard/case-table"
import { ChartCard } from "@/components/dashboard/chart-card"
import { FilterBar, type ExplorerFilters } from "@/components/dashboard/filter-bar"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { RecommendationPanel } from "@/components/dashboard/recommendation-panel"
import { ReferenceCard } from "@/components/dashboard/reference-card"

const pieColors = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1"]

export function BlendedFinanceDashboard() {
  const [isLoading] = useState(false)
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<ExplorerFilters>({
    search: "",
    country: "all",
    barrier: "all",
    stage: "all",
    tool: "all",
    expansion: "all",
  })

  const metrics = useMemo(() => buildOverviewMetrics(mockWorkbook), [])
  const charts = useMemo(() => buildOverviewCharts(mockWorkbook), [])

  const filterOptions = useMemo(
    () => ({
      countries: [...new Set(mockWorkbook.cases.map((item) => item.country.country))],
      barriers: [...new Set(mockWorkbook.cases.map((item) => item.barrier.primaryBarrier))],
      stages: [...new Set(mockWorkbook.cases.map((item) => item.barrier.projectStage))],
      tools: [...new Set(mockWorkbook.cases.map((item) => item.barrier.recommendedTool))],
      expansions: [...new Set(mockWorkbook.cases.map((item) => item.expansionModel.model))],
    }),
    [],
  )

  const filteredCases = useMemo(() => {
    return mockWorkbook.cases.filter((item) => {
      const normalizedSearch = filters.search.toLowerCase()
      const searchMatch = !normalizedSearch ||
        [
          item.country.country,
          item.country.countryChallenges,
          item.country.existingProject,
          item.intermediary.intermediary,
          item.barrier.primaryBarrier,
          item.expansionModel.model,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)

      return (
        searchMatch &&
        (filters.country === "all" || item.country.country === filters.country) &&
        (filters.barrier === "all" || item.barrier.primaryBarrier === filters.barrier) &&
        (filters.stage === "all" || item.barrier.projectStage === filters.stage) &&
        (filters.tool === "all" || item.barrier.recommendedTool === filters.tool) &&
        (filters.expansion === "all" || item.expansionModel.model === filters.expansion)
      )
    })
  }, [filters])

  const activeCase = selectedCase ?? mockWorkbook.cases[0]
  const toolSuggestion = recommendToolByBarrier(activeCase.barrier.primaryBarrier)
  const expansionSuggestion = recommendExpansionModel(activeCase.recommendationProfile, mockWorkbook.step5)

  const openCase = (value: CaseRecord) => {
    setSelectedCase(value)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
        <header className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Blended Finance Strategy Platform</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Strategic Scorecard Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{mockWorkbook.instruction}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><FileUp className="mr-2 h-4 w-4" />Upload Excel (Placeholder)</Button>
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export PDF / CSV (Placeholder)</Button>
            </div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-xl bg-white p-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cases">Case Explorer</TabsTrigger>
            <TabsTrigger value="detail">Case Detail</TabsTrigger>
            <TabsTrigger value="tools">Tools Reference</TabsTrigger>
            <TabsTrigger value="expansion">Expansion Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {isLoading ? <LoadingState /> : (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                  <KpiCard title="Countries analyzed" value={metrics.countriesAnalyzed} />
                  <KpiCard title="Existing projects" value={metrics.existingProjects} />
                  <KpiCard title="Intermediaries" value={metrics.intermediariesMapped} />
                  <KpiCard title="Barrier categories" value={metrics.barrierCategories} />
                  <KpiCard title="Tool recommendations" value={metrics.toolRecommendations} />
                  <KpiCard title="Expansion models" value={metrics.expansionModels} />
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                  <ChartCard title="Most common project barriers" description="Frequency across diagnosed cases.">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.barrierFrequency}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#1e293b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Recommended blended finance tools" description="Donut chart of tool recommendations.">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={charts.toolFrequency} dataKey="value" nameKey="name" innerRadius={56} outerRadius={90} label>
                          {charts.toolFrequency.map((item, index) => (
                            <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Expansion option frequency" description="Most selected global expansion pathways.">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.expansionFrequency}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#475569" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Pipeline by project stage" description="Distribution of project maturity stage.">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.stagePipeline}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <FilterBar filters={filters} options={filterOptions} onChange={setFilters} />
            <CaseTable rows={filteredCases} onRowClick={openCase} />
          </TabsContent>

          <TabsContent value="detail" className="space-y-4">
            <RecommendationPanel
              barrier={activeCase.barrier.primaryBarrier}
              tool={toolSuggestion.tool}
              toolRationale={toolSuggestion.rationale}
              expansion={expansionSuggestion.model}
              expansionRationale={expansionSuggestion.rationale}
            />
            <Card className="border-dashed">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Select a row in Case Explorer to open the structured deep-dive panel.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mockWorkbook.step4.map((item) => (
                <ReferenceCard
                  key={item.id}
                  title={item.tool}
                  description={item.description}
                  bestWhen={item.bestWhen}
                  pointsA={item.strengths}
                  pointsB={item.weaknesses}
                  pointALabel="Strengths"
                  pointBLabel="Weaknesses"
                  footer={item.riskMethodologies.join("; ") + ` | Source: ${item.source}`}
                  footerLabel="Risk methodologies"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="expansion">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mockWorkbook.step5.map((item) => (
                <ReferenceCard
                  key={item.id}
                  title={item.model}
                  description={item.description}
                  bestWhen={item.bestWhen}
                  pointsA={item.pros}
                  pointsB={item.cons}
                  pointALabel="Pros"
                  pointBLabel="Cons"
                  footer={item.implementationImplications}
                  footerLabel="Implementation implications"
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>

      <CaseDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedCase={selectedCase}
        toolRationale={toolSuggestion.rationale}
        expansionRationale={expansionSuggestion.rationale}
      />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Skeleton className="h-28 rounded-xl" key={idx} />
      ))}
    </div>
  )
}
