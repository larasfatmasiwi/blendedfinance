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

type CountryData = {
  speed: number
  cost: number
  local_ownership: number
  scalability: number
  capacity_building: number
  regulatory_feasibility: number
}

const countriesData: Record<string, CountryData> = {
  "United States": {
    speed: 9,
    cost: 5,
    local_ownership: 8,
    scalability: 9,
    capacity_building: 8,
    regulatory_feasibility: 7,
  },
  "United Kingdom": {
    speed: 8,
    cost: 6,
    local_ownership: 7,
    scalability: 8,
    capacity_building: 8,
    regulatory_feasibility: 8,
  },
  Germany: {
    speed: 7,
    cost: 6,
    local_ownership: 8,
    scalability: 8,
    capacity_building: 9,
    regulatory_feasibility: 7,
  },
  Brazil: {
    speed: 6,
    cost: 7,
    local_ownership: 8,
    scalability: 7,
    capacity_building: 6,
    regulatory_feasibility: 5,
  },
  India: {
    speed: 7,
    cost: 8,
    local_ownership: 7,
    scalability: 9,
    capacity_building: 7,
    regulatory_feasibility: 6,
  },
  China: {
    speed: 9,
    cost: 7,
    local_ownership: 6,
    scalability: 10,
    capacity_building: 8,
    regulatory_feasibility: 5,
  },
  Japan: {
    speed: 7,
    cost: 5,
    local_ownership: 9,
    scalability: 7,
    capacity_building: 9,
    regulatory_feasibility: 8,
  },
  Australia: {
    speed: 8,
    cost: 5,
    local_ownership: 8,
    scalability: 7,
    capacity_building: 8,
    regulatory_feasibility: 9,
  },
  Nigeria: {
    speed: 5,
    cost: 8,
    local_ownership: 9,
    scalability: 6,
    capacity_building: 5,
    regulatory_feasibility: 4,
  },
  "South Africa": {
    speed: 6,
    cost: 7,
    local_ownership: 8,
    scalability: 6,
    capacity_building: 6,
    regulatory_feasibility: 6,
  },
}

const countries = Object.keys(countriesData)

const categories = [
  { key: "speed", label: "Speed" },
  { key: "cost", label: "Cost" },
  { key: "local_ownership", label: "Local Ownership" },
  { key: "scalability", label: "Scalability" },
  { key: "capacity_building", label: "Capacity Building" },
  { key: "regulatory_feasibility", label: "Regulatory Feasibility" },
]

const dimensionExplanations = [
  {
    title: "Speed",
    description:
      "How quickly the model can be launched, staffed, governed, and made operational. A high score means faster execution and shorter time to implementation. A low score means slower setup due to institution-building, governance, or capability constraints.",
  },
  {
    title: "Cost",
    description:
      "Relative resource efficiency, including setup cost, operating cost, and infrastructure burden. A high score means lower cost burden or stronger cost-efficiency. A low score means a resource-heavy model requiring significant systems, people, or capital.",
  },
  {
    title: "Local Ownership",
    description:
      "The extent to which the model embeds local leadership, decision-making, legitimacy, and community agency. A high score means strong local agency and local control. A low score means heavier dependence on external organizations or Global North structures.",
  },
  {
    title: "Scalability",
    description:
      "Potential to replicate, expand geographically, and operate across larger volumes or more jurisdictions. A high score means the model is easier to expand or replicate. A low score means it is limited to one or a few jurisdictions or is difficult to scale operationally.",
  },
  {
    title: "Capacity Building",
    description:
      "Ability of the model to strengthen local institutional capability, talent, and long-term ecosystem development. A high score means strong knowledge transfer and durable capacity creation. A low score means limited local capability development beyond immediate operations.",
  },
  {
    title: "Regulatory Feasibility",
    description:
      "How workable the model is within legal, charitable, fiscal, and governance constraints in the target geography. A high score means it is easier to implement within existing rules and structures. A low score means it is more exposed to regulatory complexity or structural barriers.",
  },
]

const scoreScale = [
  { score: "1", label: "Extremely unfavorable", description: "Very poor fit on the indicator; major structural weakness." },
  { score: "2", label: "Very unfavorable", description: "Only minimal strengths; severe limitations remain." },
  { score: "3", label: "Unfavorable", description: "Below-average performance with clear constraints." },
  { score: "4", label: "Moderately unfavorable", description: "Some usefulness, but notable weaknesses reduce attractiveness." },
  { score: "5", label: "Neutral / mixed", description: "Middle-range position; neither clearly weak nor clearly strong." },
  { score: "6", label: "Moderately favorable", description: "Useful and workable, though not yet a leading option." },
  { score: "7", label: "Favorable", description: "Strong performance on the criterion in most practical cases." },
  { score: "8", label: "Very favorable", description: "Highly attractive position with clear comparative advantage." },
  { score: "9", label: "Exceptional", description: "One of the strongest options on this criterion." },
  { score: "10", label: "Best-in-class", description: "Top-end performance; benchmark position within the option set." },
]

export default function GlobalExpansionDashboard() {
  const [selectedCountry, setSelectedCountry] = useState("United States")
  const [searchQuery, setSearchQuery] = useState("")
  const [form, setForm] = useState<CountryData>(countriesData["United States"])

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const data = useMemo(
    () =>
      categories.map((item) => ({
        subject: item.label,
        score: Number(form[item.key as keyof typeof form]) || 0,
        fullMark: 10,
      })),
    [form]
  )

  const overallScore = useMemo(() => {
    const vals = Object.values(form).map((v) => Number(v) || 0)
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  }, [form])

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setForm(countriesData[country])
    setSearchQuery("")
  }

  const handleChange = (key: string, value: string) => {
    const numeric = Math.max(0, Math.min(10, Number(value) || 0))
    setForm((prev) => ({ ...prev, [key]: numeric }))
  }

  const resetToCountryDefaults = () => {
    setForm(countriesData[selectedCountry])
  }

  const getRiskLabel = (score: number) => {
    if (score >= 7) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Interactive Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Global Expansion Option Matrix
              </h1>
            </div>
            <button
              onClick={resetToCountryDefaults}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reset to Country Defaults
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Radar Chart Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selectedCountry}
                </h2>
                <p className="text-sm text-slate-500">
                  Dynamic visualization based on dimensions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {searchQuery && filteredCountries.length > 0 && (
                    <div className="absolute top-full left-0 z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => handleCountryChange(country)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Overall Score
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {overallScore}
              </p>
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
                  <Tooltip />
                  <Radar name="Score" dataKey="score" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Dimension Input Panel */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Dimension
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
                        max="10"
                        value={form[item.key as keyof typeof form]}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full"
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={form[item.key as keyof typeof form]}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Summary */}
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

        {/* Dimension Explanations */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Global Expansion Indicators and Scales
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dimensionExplanations.map((dim) => (
              <div
                key={dim.title}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <h3 className="font-semibold text-slate-900">{dim.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{dim.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring System */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Scoring System (1-10 Scale)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {scoreScale.map((item) => (
              <div
                key={item.score}
                className="rounded-2xl border border-slate-200 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-900">
                    {item.score}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
