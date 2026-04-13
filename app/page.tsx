"use client"

import { useMemo, useState } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export default function RadarChartDashboard() {
  const [form, setForm] = useState({
    speed: 78,
    cost: 64,
    local_ownership: 71,
    scalability: 82,
    capacity_building: 69,
    regulatory_feasibility: 74,
  })

  const categories = [
    { key: "speed", label: "Speed" },
    { key: "cost", label: "Cost" },
    { key: "local_ownership", label: "Local Ownership" },
    { key: "scalability", label: "Scalability" },
    { key: "capacity_building", label: "Capacity Building" },
    { key: "regulatory_feasibility", label: "Regulatory Feasibility" },
  ]

  const data = useMemo(
    () =>
      categories.map((item) => ({
        subject: item.label,
        score: Number(form[item.key as keyof typeof form]) || 0,
        fullMark: 100,
      })),
    [form]
  )

  const overallScore = useMemo(() => {
    const vals = Object.values(form).map((v) => Number(v) || 0)
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  }, [form])

  const handleChange = (key: string, value: string) => {
    const numeric = Math.max(0, Math.min(100, Number(value) || 0))
    setForm((prev) => ({ ...prev, [key]: numeric }))
  }

  const resetDemo = () => {
    setForm({
      speed: 78,
      cost: 64,
      local_ownership: 71,
      scalability: 82,
      capacity_building: 69,
      regulatory_feasibility: 74,
    })
  }

  const getRiskLabel = (score: number) => {
    if (score >= 75) return "High"
    if (score >= 50) return "Medium"
    return "Low"
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Interactive Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Radar Chart Performance Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Enter values from 0 to 100 and the radar chart will update
                automatically. You can adapt the labels for ESG, climate risk,
                project evaluation, or any custom scoring model.
              </p>
            </div>
            <button
              onClick={resetDemo}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reset Demo Values
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Radar Chart
                </h2>
                <p className="text-sm text-slate-500">
                  Dynamic visualization based on the input panel
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Overall Score
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {overallScore}
                </p>
              </div>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} />
                  <Tooltip />
                  <Radar name="Score" dataKey="score" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Input Panel
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update each dimension manually
              </p>

              <div className="mt-5 space-y-4">
                {categories.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        {item.label}
                      </label>
                      <span className="text-sm text-slate-500">
                        {form[item.key as keyof typeof form]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form[item.key as keyof typeof form]}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form[item.key as keyof typeof form]}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Score Summary
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {categories.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <div className="mt-2 flex items-end justify-between">
                      <p className="text-2xl font-semibold text-slate-900">
                        {form[item.key as keyof typeof form]}
                      </p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {getRiskLabel(form[item.key as keyof typeof form])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
