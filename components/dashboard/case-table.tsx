import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CaseRecord } from "@/types/dashboard/scorecard"

interface CaseTableProps {
  rows: CaseRecord[]
  onRowClick: (value: CaseRecord) => void
}

export function CaseTable({ rows, onRowClick }: CaseTableProps) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        No cases match the selected filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>SDG / NDC</TableHead>
            <TableHead>Key challenge</TableHead>
            <TableHead>Existing project</TableHead>
            <TableHead>Intermediary</TableHead>
            <TableHead>Barrier</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Tool</TableHead>
            <TableHead>Expansion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="cursor-pointer" onClick={() => onRowClick(row)}>
              <TableCell className="font-medium">{row.country.country}</TableCell>
              <TableCell>{row.country.sdgTarget}</TableCell>
              <TableCell>{row.country.countryChallenges}</TableCell>
              <TableCell>{row.country.existingProject}</TableCell>
              <TableCell>{row.intermediary.intermediary}</TableCell>
              <TableCell>
                <Badge variant="secondary">{row.barrier.primaryBarrier}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{row.barrier.projectStage}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{row.barrier.recommendedTool}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{row.expansionModel.model}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
