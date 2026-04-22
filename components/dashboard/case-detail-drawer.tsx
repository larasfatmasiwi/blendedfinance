import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { CaseRecord } from "@/types/dashboard/scorecard"

interface CaseDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCase: CaseRecord | null
  toolRationale: string
  expansionRationale: string
}

export function CaseDetailDrawer({
  open,
  onOpenChange,
  selectedCase,
  toolRationale,
  expansionRationale,
}: CaseDetailDrawerProps) {
  if (!selectedCase) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{selectedCase.country.country} Case Detail</SheetTitle>
          <SheetDescription>
            Structured multi-step strategic analysis aligned with the workbook framework.
          </SheetDescription>
        </SheetHeader>
        <section className="mt-6 space-y-4 text-sm">
          <h3 className="font-semibold">A. Country and challenge</h3>
          <Info label="SDG / NDC target" value={selectedCase.country.sdgTarget} />
          <Info label="Country challenges" value={selectedCase.country.countryChallenges} />
          <Info label="Background problem" value={selectedCase.country.backgroundProblem} />
          <Info label="Existing projects / initiatives" value={selectedCase.country.existingProject} />
          <Info label="Development rationale" value={selectedCase.country.developmentRationale} />
          <Info label="Objectives / expected results" value={selectedCase.country.expectedResults} />
          <Info label="Quality considerations / safeguards" value={selectedCase.country.safeguards} />
          <Info label="Sources" value={selectedCase.country.sources.join("; ")} />
        </section>

        <Separator className="my-6" />
        <section className="space-y-3 text-sm">
          <h3 className="font-semibold">B. Intermediary mapping</h3>
          <Info label="Intermediary name" value={selectedCase.intermediary.intermediary} />
          <Info label="Type" value={selectedCase.intermediary.type} />
          <Info label="Role in ecosystem" value={selectedCase.intermediary.role} />
          <Info label="Why relevant" value={selectedCase.intermediary.whyRelevant} />
          <Info label="Geographic level" value={selectedCase.intermediary.geography} />
          <Info label="Relationship status" value={selectedCase.intermediary.relationshipStatus} />
        </section>

        <Separator className="my-6" />
        <section className="space-y-3 text-sm">
          <h3 className="font-semibold">C. Barrier assessment</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{selectedCase.barrier.primaryBarrier}</Badge>
            <Badge variant="outline">{selectedCase.barrier.projectStage}</Badge>
            <Badge>{selectedCase.barrier.recommendedTool}</Badge>
          </div>
          <Info label="Barrier explanation" value={selectedCase.barrier.barrierDescription} />
          <Info label="Observable signs" value={selectedCase.barrier.observableSigns} />
          <Info label="Why that tool fits" value={toolRationale} />
        </section>

        <Separator className="my-6" />
        <section className="space-y-3 text-sm pb-6">
          <h3 className="font-semibold">D. Expansion recommendation</h3>
          <Info label="Recommended expansion model" value={selectedCase.expansionModel.model} />
          <Info label="Why it fits" value={expansionRationale} />
          <Info label="Pros" value={selectedCase.expansionModel.pros.join("; ")} />
          <Info label="Cons" value={selectedCase.expansionModel.cons.join("; ")} />
          <Info label="Feasibility notes" value={selectedCase.expansionModel.implementationImplications} />
        </section>
      </SheetContent>
    </Sheet>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 leading-relaxed text-foreground">{value}</p>
    </div>
  )
}
