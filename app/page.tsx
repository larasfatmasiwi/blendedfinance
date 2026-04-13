"use client"

import { useMemo, useState, useRef } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

type DimensionScores = {
  speed: number
  cost: number
  local_ownership: number
  scalability: number
  capacity_building: number
  regulatory_feasibility: number
}

type WebStrategy = {
  name: string
  color: string
  scores: DimensionScores
}

// All countries in the world
const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (DRC)", "Congo (Republic)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

// Default strategies with their scores (these can be overridden by uploaded data)
const defaultStrategies: WebStrategy[] = [
  {
    name: "Deepen Local",
    color: "#4f46e5",
    scores: { speed: 6, cost: 7, local_ownership: 9, scalability: 4, capacity_building: 8, regulatory_feasibility: 7 },
  },
  {
    name: "Local Repurposing",
    color: "#10b981",
    scores: { speed: 7, cost: 8, local_ownership: 8, scalability: 5, capacity_building: 7, regulatory_feasibility: 6 },
  },
  {
    name: "New Build",
    color: "#f59e0b",
    scores: { speed: 4, cost: 3, local_ownership: 7, scalability: 8, capacity_building: 9, regulatory_feasibility: 5 },
  },
  {
    name: "Local Hybrid",
    color: "#ec4899",
    scores: { speed: 5, cost: 6, local_ownership: 8, scalability: 6, capacity_building: 8, regulatory_feasibility: 6 },
  },
  {
    name: "Hybrid",
    color: "#8b5cf6",
    scores: { speed: 7, cost: 5, local_ownership: 6, scalability: 7, capacity_building: 6, regulatory_feasibility: 7 },
  },
]

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
  const [strategies, setStrategies] = useState<WebStrategy[]>(defaultStrategies)
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(["Deepen Local"])
  const [uploadedData, setUploadedData] = useState<Record<string, WebStrategy[]> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentStrategies = useMemo(() => {
    if (uploadedData && uploadedData[selectedCountry]) {
      return uploadedData[selectedCountry]
    }
    return strategies
  }, [uploadedData, selectedCountry, strategies])

  const data = useMemo(() => {
    return categories.map((item) => {
      const dataPoint: Record<string, string | number> = { subject: item.label }
      currentStrategies.forEach((strategy) => {
        if (selectedStrategies.includes(strategy.name)) {
          dataPoint[strategy.name] = strategy.scores[item.key as keyof DimensionScores]
        }
      })
      return dataPoint
    })
  }, [currentStrategies, selectedStrategies])

  const toggleStrategy = (strategyName: string) => {
    setSelectedStrategies((prev) => {
      if (prev.includes(strategyName)) {
        if (prev.length === 1) return prev // Keep at least one selected
        return prev.filter((s) => s !== strategyName)
      }
      return [...prev, strategyName]
    })
  }

  const selectAllStrategies = () => {
    setSelectedStrategies(currentStrategies.map((s) => s.name))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim()))
        
        // Expected format: Country, Strategy, Speed, Cost, Local Ownership, Scalability, Capacity Building, Regulatory Feasibility
        const header = rows[0]
        const dataRows = rows.slice(1).filter((row) => row.length >= 8 && row[0])

        const parsed: Record<string, WebStrategy[]> = {}
        const colorMap: Record<string, string> = {
          "Deepen Local": "#4f46e5",
          "Local Repurposing": "#10b981",
          "New Build": "#f59e0b",
          "Local Hybrid": "#ec4899",
          "Hybrid": "#8b5cf6",
        }

        dataRows.forEach((row) => {
          const country = row[0]
          const strategyName = row[1]
          const scores: DimensionScores = {
            speed: Number(row[2]) || 5,
            cost: Number(row[3]) || 5,
            local_ownership: Number(row[4]) || 5,
            scalability: Number(row[5]) || 5,
            capacity_building: Number(row[6]) || 5,
            regulatory_feasibility: Number(row[7]) || 5,
          }

          if (!parsed[country]) {
            parsed[country] = []
          }

          parsed[country].push({
            name: strategyName,
            color: colorMap[strategyName] || "#6b7280",
            scores,
          })
        })

        setUploadedData(parsed)
        const firstCountry = Object.keys(parsed)[0]
        if (firstCountry) {
          setSelectedCountry(firstCountry)
          setSelectedStrategies([parsed[firstCountry][0]?.name || "Deepen Local"])
        }
        alert("Data uploaded successfully!")
      } catch {
        alert("Error parsing file. Please ensure it's a valid CSV format.")
      }
    }
    reader.readAsText(file)
  }

  const clearUploadedData = () => {
    setUploadedData(null)
    setStrategies(defaultStrategies)
    setSelectedStrategies(["Deepen Local"])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const updateStrategyScore = (strategyName: string, key: string, value: number) => {
    if (uploadedData) {
      setUploadedData((prev) => {
        if (!prev) return prev
        const updated = { ...prev }
        if (updated[selectedCountry]) {
          updated[selectedCountry] = updated[selectedCountry].map((s) =>
            s.name === strategyName
              ? { ...s, scores: { ...s.scores, [key]: value } }
              : s
          )
        }
        return updated
      })
    } else {
      setStrategies((prev) =>
        prev.map((s) =>
          s.name === strategyName
            ? { ...s, scores: { ...s.scores, [key]: value } }
            : s
        )
      )
    }
  }

  const getRiskLabel = (score: number) => {
    if (score >= 7) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  const activeStrategy = currentStrategies.find((s) => selectedStrategies.includes(s.name))

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
            <div className="flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Upload Excel/CSV
              </label>
              {uploadedData && (
                <button
                  onClick={clearUploadedData}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Clear Uploaded Data
                </button>
              )}
            </div>
          </div>

          {/* Upload Instructions */}
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">CSV Format:</p>
            <p className="mt-1 font-mono text-xs">
              Country, Strategy, Speed, Cost, Local Ownership, Scalability, Capacity Building, Regulatory Feasibility
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">
              Example: United States, Deepen Local, 6, 7, 9, 4, 8, 7
            </p>
          </div>
        </div>

        {/* Country Selection */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Country</h2>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full md:w-96 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
          >
            {(uploadedData ? Object.keys(uploadedData) : allCountries).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Strategy Selection */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Select Strategies to Display</h2>
            <button
              onClick={selectAllStrategies}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Show All
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {currentStrategies.map((strategy) => (
              <button
                key={strategy.name}
                onClick={() => toggleStrategy(strategy.name)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  selectedStrategies.includes(strategy.name)
                    ? "ring-2 ring-offset-2"
                    : "opacity-50 hover:opacity-75"
                }`}
                style={{
                  backgroundColor: selectedStrategies.includes(strategy.name)
                    ? `${strategy.color}20`
                    : "#f1f5f9",
                  color: strategy.color,
                  ringColor: strategy.color,
                }}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: strategy.color }}
                />
                {strategy.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Radar Chart Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedCountry}
              </h2>
              <p className="text-sm text-slate-500">
                Comparing {selectedStrategies.length} {selectedStrategies.length === 1 ? "strategy" : "strategies"}
              </p>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="65%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
                  <Tooltip />
                  <Legend />
                  {currentStrategies
                    .filter((s) => selectedStrategies.includes(s.name))
                    .map((strategy) => (
                      <Radar
                        key={strategy.name}
                        name={strategy.name}
                        dataKey={strategy.name}
                        stroke={strategy.color}
                        fill={strategy.color}
                        fillOpacity={0.25}
                      />
                    ))}
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
                Update each dimension for the selected strategy
              </p>

              {selectedStrategies.length === 1 && activeStrategy && (
                <div className="mt-5 space-y-4">
                  {categories.map((item) => (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                          {item.label}
                        </label>
                        <span className="text-sm text-slate-500">
                          {activeStrategy.scores[item.key as keyof DimensionScores]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={activeStrategy.scores[item.key as keyof DimensionScores]}
                          onChange={(e) =>
                            updateStrategyScore(activeStrategy.name, item.key, Number(e.target.value))
                          }
                          className="w-full"
                        />
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={activeStrategy.scores[item.key as keyof DimensionScores]}
                          onChange={(e) =>
                            updateStrategyScore(activeStrategy.name, item.key, Math.max(0, Math.min(10, Number(e.target.value) || 0)))
                          }
                          className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedStrategies.length > 1 && (
                <p className="mt-4 text-sm text-slate-500 italic">
                  Select a single strategy to edit its dimensions.
                </p>
              )}
            </div>

            {/* Score Summary */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Score Summary
              </h2>
              {selectedStrategies.map((strategyName) => {
                const strategy = currentStrategies.find((s) => s.name === strategyName)
                if (!strategy) return null
                return (
                  <div key={strategy.name} className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: strategy.color }}
                      />
                      <span className="font-medium text-slate-700">{strategy.name}</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {categories.map((item) => (
                        <div
                          key={item.key}
                          className="rounded-xl border border-slate-200 p-3"
                        >
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <div className="mt-1 flex items-end justify-between">
                            <p className="text-lg font-semibold text-slate-900">
                              {strategy.scores[item.key as keyof DimensionScores]}
                            </p>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {getRiskLabel(strategy.scores[item.key as keyof DimensionScores])}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
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
