import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface ExplorerFilters {
  search: string
  country: string
  barrier: string
  stage: string
  tool: string
  expansion: string
}

interface FilterBarProps {
  filters: ExplorerFilters
  options: {
    countries: string[]
    barriers: string[]
    stages: string[]
    tools: string[]
    expansions: string[]
  }
  onChange: (next: ExplorerFilters) => void
}

export function FilterBar({ filters, options, onChange }: FilterBarProps) {
  const update = <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-3 shadow-sm md:grid-cols-2 xl:grid-cols-6">
      <Input
        placeholder="Search country, challenge, project..."
        value={filters.search}
        onChange={(event) => update("search", event.target.value)}
      />
      <FilterSelect value={filters.country} onValueChange={(value) => update("country", value)} placeholder="Country" options={options.countries} />
      <FilterSelect value={filters.barrier} onValueChange={(value) => update("barrier", value)} placeholder="Barrier" options={options.barriers} />
      <FilterSelect value={filters.stage} onValueChange={(value) => update("stage", value)} placeholder="Stage" options={options.stages} />
      <FilterSelect value={filters.tool} onValueChange={(value) => update("tool", value)} placeholder="Tool" options={options.tools} />
      <FilterSelect value={filters.expansion} onValueChange={(value) => update("expansion", value)} placeholder="Expansion" options={options.expansions} />
    </div>
  )
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: string[]
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
