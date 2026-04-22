import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReferenceCardProps {
  title: string
  description: string
  bestWhen: string
  pointsA: string[]
  pointsB: string[]
  pointALabel: string
  pointBLabel: string
  footer: string
  footerLabel: string
}

export function ReferenceCard({
  title,
  description,
  bestWhen,
  pointsA,
  pointsB,
  pointALabel,
  pointBLabel,
  footer,
  footerLabel,
}: ReferenceCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">{description}</p>
        <p>
          <span className="font-medium">Best when: </span>
          {bestWhen}
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger>View details</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <List label={pointALabel} points={pointsA} />
              <List label={pointBLabel} points={pointsB} />
              <p>
                <span className="font-medium">{footerLabel}: </span>
                {footer}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

function List({ label, points }: { label: string; points: string[] }) {
  return (
    <div>
      <p className="mb-1 font-medium">{label}</p>
      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
        {points.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
