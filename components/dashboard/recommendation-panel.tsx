import { Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecommendationPanelProps {
  barrier: string
  tool: string
  toolRationale: string
  expansion: string
  expansionRationale: string
}

export function RecommendationPanel({
  barrier,
  tool,
  toolRationale,
  expansion,
  expansionRationale,
}: RecommendationPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4" /> Recommendation Engine Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Barrier: {barrier}</Badge>
          <Badge>Tool: {tool}</Badge>
          <Badge variant="outline">Expansion: {expansion}</Badge>
        </div>
        <p>
          <span className="font-medium">Tool rationale: </span>
          {toolRationale}
        </p>
        <p>
          <span className="font-medium">Expansion rationale: </span>
          {expansionRationale}
        </p>
      </CardContent>
    </Card>
  )
}
