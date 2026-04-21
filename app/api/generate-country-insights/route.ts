import { NextResponse } from "next/server"

import { buildWorkbookContext, type WorkbookContext } from "@/lib/build-workbook-context"
import {
  countryInsightJsonSchema,
  countryInsightSchema,
} from "@/lib/insight-schema"
import { z } from "zod"

const requestSchema = z.object({
  country: z.string().trim().min(1),
  workbookContext: z
    .object({
      fileName: z.string(),
      sheets: z.array(
        z.object({
          name: z.string(),
          rows: z.array(z.array(z.unknown())),
        }),
      ),
    })
    .optional(),
  prebuiltWorkbookContext: z.custom<WorkbookContext>().optional(),
})

const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini"

const extractOutputText = (responseJson: Record<string, unknown>): string | null => {
  const direct = responseJson.output_text
  if (typeof direct === "string" && direct.trim().length > 0) return direct

  const output = responseJson.output
  if (!Array.isArray(output)) return null

  for (const item of output) {
    if (!item || typeof item !== "object") continue
    const content = (item as { content?: unknown }).content
    if (!Array.isArray(content)) continue

    for (const part of content) {
      if (!part || typeof part !== "object") continue
      const text = (part as { text?: unknown }).text
      if (typeof text === "string" && text.trim().length > 0) {
        return text
      }
    }
  }

  return null
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const body = requestSchema.parse(await req.json())

    const workbookContext =
      body.prebuiltWorkbookContext ??
      buildWorkbookContext(body.workbookContext?.fileName ?? "uploaded-file", body.workbookContext?.sheets ?? [])

    if (workbookContext.sheets.length === 0) {
      return NextResponse.json(
        { error: "Workbook context is empty. Please upload a valid workbook first." },
        { status: 400 },
      )
    }

    const prompt = [
      "You are a development-finance analyst producing practical blended-finance insights.",
      `Target country: ${body.country}.`,
      "Use only evidence from the workbook payload. Do not fabricate facts.",
      "If evidence is incomplete or ambiguous, keep recommendations cautious and explicitly state this in confidence_note.",
      "Recommendations must be practical for blended finance structuring and international expansion.",
      "For evidence_from_file include direct snippets or compact references from workbook records.",
      "Return only valid JSON that follows the provided schema.",
      "Workbook payload:",
      JSON.stringify(workbookContext),
    ].join("\n")

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: countryInsightJsonSchema.name,
            strict: true,
            schema: countryInsightJsonSchema.schema,
          },
        },
      }),
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text()
      return NextResponse.json(
        { error: `OpenAI request failed: ${openAiResponse.status} ${errorText}` },
        { status: 502 },
      )
    }

    const responseJson = (await openAiResponse.json()) as Record<string, unknown>
    const outputText = extractOutputText(responseJson)

    if (!outputText) {
      return NextResponse.json(
        { error: "Model returned no structured output." },
        { status: 502 },
      )
    }

    const parsedOutput = JSON.parse(outputText)
    const insight = countryInsightSchema.parse(parsedOutput)

    return NextResponse.json({ insight })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          details: error.issues,
        },
        { status: 400 },
      )
    }

    const message = error instanceof Error ? error.message : "Unexpected server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
