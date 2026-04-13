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
  const reportRef = useRef<HTMLDivElement>(null)

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

  const parseUploadedRows = (rows: string[][]) => {
    const parsed: Record<string, WebStrategy[]> = {}
    const colorMap: Record<string, string> = {
      "Deepen Local": "#4f46e5",
      "Local Repurposing": "#10b981",
      "New Build": "#f59e0b",
      "Local Hybrid": "#ec4899",
      "Hybrid": "#8b5cf6",
    }

    // Skip header row and filter valid rows
    const dataRows = rows.slice(1).filter((row) => row.length >= 8 && row[0])

    dataRows.forEach((row) => {
      const country = String(row[0]).trim()
      const strategyName = String(row[1]).trim()
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

    return parsed
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileName = file.name.toLowerCase()
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls")

    try {
      let rows: string[][] = []

      if (isExcel) {
        // Dynamic import xlsx library for Excel files
        const XLSX = await import("xlsx")
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]
      } else {
        // CSV parsing
        const text = await file.text()
        rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim()))
      }

      const parsed = parseUploadedRows(rows)

      if (Object.keys(parsed).length === 0) {
        alert("No valid data found. Please check the file format.")
        return
      }

      setUploadedData(parsed)
      const firstCountry = Object.keys(parsed)[0]
      if (firstCountry) {
        setSelectedCountry(firstCountry)
        setSelectedStrategies([parsed[firstCountry][0]?.name || "Deepen Local"])
      }
      alert("Data uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error parsing file. Please ensure it's a valid Excel or CSV format.")
    }
  }

  const clearUploadedData = () => {
    setUploadedData(null)
    setStrategies(defaultStrategies)
    setSelectedStrategies(["Deepen Local"])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getRiskLabel = (score: number) => {
    if (score >= 7) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  const generateExcelXML = (headers: string[], rows: string[][]) => {
    const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>`
    
    const headerRow = `<Row>${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join("")}</Row>`
    const dataRows = rows.map(row => `<Row>${row.map(cell => `<Cell><Data ss:Type="${isNaN(Number(cell)) ? "String" : "Number"}">${cell}</Data></Cell>`).join("")}</Row>`).join("\n")
    
    const xmlFooter = `</Table>
  </Worksheet>
</Workbook>`
    
    return `${xmlHeader}\n${headerRow}\n${dataRows}\n${xmlFooter}`
  }

  const downloadExcel = () => {
    const headers = ["Country", "Strategy", "Speed", "Cost", "Local Ownership", "Scalability", "Capacity Building", "Regulatory Feasibility"]
    const rows: string[][] = []
    
    if (uploadedData) {
      Object.entries(uploadedData).forEach(([country, strats]) => {
        strats.forEach((strategy) => {
          rows.push([
            country,
            strategy.name,
            String(strategy.scores.speed),
            String(strategy.scores.cost),
            String(strategy.scores.local_ownership),
            String(strategy.scores.scalability),
            String(strategy.scores.capacity_building),
            String(strategy.scores.regulatory_feasibility),
          ])
        })
      })
    } else {
      currentStrategies.forEach((strategy) => {
        rows.push([
          selectedCountry,
          strategy.name,
          String(strategy.scores.speed),
          String(strategy.scores.cost),
          String(strategy.scores.local_ownership),
          String(strategy.scores.scalability),
          String(strategy.scores.capacity_building),
          String(strategy.scores.regulatory_feasibility),
        ])
      })
    }
    
    const excelContent = generateExcelXML(headers, rows)
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `global_expansion_matrix_${selectedCountry.replace(/\s+/g, "_")}.xls`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadTemplate = () => {
    const headers = ["Country", "Strategy", "Speed", "Cost", "Local Ownership", "Scalability", "Capacity Building", "Regulatory Feasibility"]
    const exampleRows = [
      ["United States", "Deepen Local", "6", "7", "9", "4", "8", "7"],
      ["United States", "Local Repurposing", "7", "8", "8", "5", "7", "6"],
      ["United States", "New Build", "4", "3", "7", "8", "9", "5"],
      ["United States", "Local Hybrid", "5", "6", "8", "6", "8", "6"],
      ["United States", "Hybrid", "7", "5", "6", "7", "6", "7"],
    ]
    
    const excelContent = generateExcelXML(headers, exampleRows)
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "global_expansion_template.xls")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateSummaryAnalysis = () => {
    const selectedStrategyData = currentStrategies.filter((s) => selectedStrategies.includes(s.name))
    
    // Calculate averages for each strategy
    const strategyAverages = selectedStrategyData.map((strategy) => {
      const scores = Object.values(strategy.scores)
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return { name: strategy.name, average: avg, scores: strategy.scores }
    })
    
    // Find best strategy
    const bestStrategy = strategyAverages.reduce((best, current) => 
      current.average > best.average ? current : best, strategyAverages[0])
    
    // Find strengths and weaknesses for each strategy
    const analysis = strategyAverages.map((strategy) => {
      const sortedDimensions = categories.map((cat) => ({
        label: cat.label,
        score: strategy.scores[cat.key as keyof DimensionScores],
      })).sort((a, b) => b.score - a.score)
      
      const strengths = sortedDimensions.slice(0, 2).filter((d) => d.score >= 7)
      const weaknesses = sortedDimensions.slice(-2).filter((d) => d.score <= 4)
      
      return {
        name: strategy.name,
        average: strategy.average,
        strengths,
        weaknesses,
      }
    })
    
    return { bestStrategy, analysis }
  }

  const downloadPDF = () => {
    if (!reportRef.current) return
    
    const { bestStrategy, analysis } = generateSummaryAnalysis()
    const chartSvg = reportRef.current.querySelector(".recharts-wrapper svg")
    let chartDataUrl = ""
    
    if (chartSvg) {
      const svgData = new XMLSerializer().serializeToString(chartSvg)
      chartDataUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    }
    
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to download the report as PDF.")
      return
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Global Expansion Report - ${selectedCountry}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; max-width: 900px; margin: 0 auto; color: #1e293b; }
            h1 { font-size: 28px; margin-bottom: 8px; }
            h2 { font-size: 20px; color: #475569; margin-top: 32px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            h3 { font-size: 16px; color: #334155; }
            .header { text-align: center; margin-bottom: 40px; }
            .header p { color: #64748b; }
            .chart-container { text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .chart-container img { max-width: 100%; height: auto; max-height: 400px; }
            .summary-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 24px 0; }
            .summary-box h3 { color: #1e40af; margin: 0 0 12px 0; }
            .strategy-item { margin-bottom: 20px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; }
            .strategy-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
            .strategy-dot { width: 12px; height: 12px; border-radius: 50%; }
            .indicator-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .indicator-box { padding: 10px; background: #f8fafc; border-radius: 8px; text-align: center; }
            .indicator-box .label { font-size: 11px; color: #64748b; }
            .indicator-box .score { font-size: 20px; font-weight: 600; color: #1e293b; }
            .analysis-section { margin-top: 24px; }
            .strength { color: #059669; }
            .weakness { color: #dc2626; }
            .guidance-section { margin-top: 32px; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .dimension-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; }
            .dimension-item { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; }
            .dimension-item h4 { margin: 0 0 8px 0; font-size: 14px; }
            .dimension-item p { margin: 0; font-size: 12px; color: #64748b; }
            @media print { 
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Global Expansion Option Matrix Report</h1>
            <p><strong>Country:</strong> ${selectedCountry}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${chartDataUrl ? `
          <div class="chart-container">
            <h2 style="border: none; margin-top: 0;">Strategy Comparison Chart</h2>
            <img src="${chartDataUrl}" alt="Radar Chart" />
          </div>
          ` : ""}
          
          <div class="summary-box">
            <h3>Executive Summary</h3>
            <p>This analysis compares <strong>${selectedStrategies.length} expansion ${selectedStrategies.length === 1 ? "strategy" : "strategies"}</strong> for <strong>${selectedCountry}</strong>.</p>
            ${bestStrategy ? `<p><strong>Recommended Strategy:</strong> ${bestStrategy.name} (Average Score: ${bestStrategy.average.toFixed(1)}/10)</p>` : ""}
          </div>
          
          <h2>Strategy Analysis</h2>
          ${analysis.map((strat) => {
            const strategy = currentStrategies.find((s) => s.name === strat.name)
            if (!strategy) return ""
            return `
              <div class="strategy-item">
                <div class="strategy-header">
                  <span class="strategy-dot" style="background-color: ${strategy.color};"></span>
                  <h3 style="margin: 0;">${strategy.name}</h3>
                  <span style="margin-left: auto; font-size: 14px; color: #64748b;">Avg: ${strat.average.toFixed(1)}/10</span>
                </div>
                <div class="indicator-grid">
                  ${categories.map((item) => `
                    <div class="indicator-box">
                      <div class="label">${item.label}</div>
                      <div class="score">${strategy.scores[item.key as keyof DimensionScores]}</div>
                    </div>
                  `).join("")}
                </div>
                <div class="analysis-section">
                  ${strat.strengths.length > 0 ? `<p class="strength"><strong>Strengths:</strong> ${strat.strengths.map((s) => s.label).join(", ")}</p>` : ""}
                  ${strat.weaknesses.length > 0 ? `<p class="weakness"><strong>Areas for Improvement:</strong> ${strat.weaknesses.map((w) => w.label).join(", ")}</p>` : ""}
                </div>
              </div>
            `
          }).join("")}
          
          <div class="guidance-section page-break">
            <h2 style="margin-top: 0; border: none;">Indicator Definitions</h2>
            <div class="dimension-grid">
              ${dimensionExplanations.map((dim) => `
                <div class="dimension-item">
                  <h4>${dim.title}</h4>
                  <p>${dim.description}</p>
                </div>
              `).join("")}
            </div>
          </div>
          
          <div class="guidance-section">
            <h3>Scoring Scale Reference</h3>
            <p style="margin: 12px 0; font-size: 13px;">
              <strong>1-2:</strong> Extremely unfavorable | 
              <strong>3-4:</strong> Below average | 
              <strong>5-6:</strong> Moderate | 
              <strong>7-8:</strong> Favorable | 
              <strong>9-10:</strong> Best-in-class
            </p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
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
              <button
                onClick={downloadTemplate}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Download Template
              </button>
              <button
                onClick={downloadExcel}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Download Excel
              </button>
              <button
                onClick={downloadPDF}
                className="rounded-2xl border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                Download Report (PDF)
              </button>
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
            <p className="font-medium text-slate-700">Excel Format:</p>
            <p className="mt-1 font-mono text-xs">
              Country, Strategy, Speed, Cost, Local Ownership, Scalability, Capacity Building, Regulatory Feasibility
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">
              Example: United States, Deepen Local, 6, 7, 9, 4, 8, 7
            </p>
          </div>
        </div>

        {/* Country and Strategy Selection - Same Row */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* Select Country */}
            <div className="flex-shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Select Country</h2>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full lg:w-64 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                {(uploadedData ? Object.keys(uploadedData) : allCountries).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Strategies */}
            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
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
          </div>
        </div>

        {/* Report Section for PDF */}
        <div ref={reportRef} className="space-y-6 bg-slate-50">
          {/* Radar Chart Section - Centered */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedCountry}
              </h2>
              <p className="text-sm text-slate-500">
                Comparing {selectedStrategies.length} {selectedStrategies.length === 1 ? "strategy" : "strategies"}
              </p>
            </div>

            <div className="h-[500px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={data}>
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

          {/* Indicators Score - Below Radar Chart */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Indicators Score
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
                  <div className="flex flex-wrap gap-2">
                    {categories.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-xl border border-slate-200 p-3 min-w-[140px] flex-1"
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

          {/* Guidance Section - Combined */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Guidance
            </h2>
            
            {/* Dimension Explanations */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Global Expansion Indicators and Scales</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dimensionExplanations.map((dim) => (
                  <div
                    key={dim.title}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <h4 className="font-semibold text-slate-900">{dim.title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{dim.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring System */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Scoring System (1-10 Scale)</h3>
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
      </div>
    </div>
  )
}
