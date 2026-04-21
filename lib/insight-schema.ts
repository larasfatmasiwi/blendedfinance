import { z } from "zod"

const nonEmptyString = z.string().trim().min(1)

export const countryInsightSchema = z
  .object({
    country: nonEmptyString,
    problem_in_country: z.object({
      title: nonEmptyString,
      summary: nonEmptyString,
      evidence_from_file: z.array(nonEmptyString),
    }),
    development_ideas: z.array(
      z.object({
        title: nonEmptyString,
        rationale: nonEmptyString,
        expected_result: nonEmptyString,
      }),
    ),
    existing_projects: z.array(
      z.object({
        name: nonEmptyString,
        description: nonEmptyString,
        relevance: nonEmptyString,
      }),
    ),
    intermediaries: z.array(
      z.object({
        name: nonEmptyString,
        role: nonEmptyString,
        why_relevant: nonEmptyString,
      }),
    ),
    project_barrier_and_stage: z.object({
      barrier: nonEmptyString,
      stage: nonEmptyString,
      explanation: nonEmptyString,
    }),
    recommended_blended_finance_tool: z.object({
      tool: nonEmptyString,
      justification: nonEmptyString,
    }),
    recommended_global_expansion_option: z.object({
      option: nonEmptyString,
      justification: nonEmptyString,
    }),
    executive_summary: nonEmptyString,
    confidence_note: nonEmptyString,
  })
  .strict()

export type CountryInsightResult = z.infer<typeof countryInsightSchema>

export const countryInsightJsonSchema = {
  name: "country_insight_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "country",
      "problem_in_country",
      "development_ideas",
      "existing_projects",
      "intermediaries",
      "project_barrier_and_stage",
      "recommended_blended_finance_tool",
      "recommended_global_expansion_option",
      "executive_summary",
      "confidence_note",
    ],
    properties: {
      country: { type: "string" },
      problem_in_country: {
        type: "object",
        additionalProperties: false,
        required: ["title", "summary", "evidence_from_file"],
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          evidence_from_file: { type: "array", items: { type: "string" } },
        },
      },
      development_ideas: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "rationale", "expected_result"],
          properties: {
            title: { type: "string" },
            rationale: { type: "string" },
            expected_result: { type: "string" },
          },
        },
      },
      existing_projects: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "description", "relevance"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            relevance: { type: "string" },
          },
        },
      },
      intermediaries: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "role", "why_relevant"],
          properties: {
            name: { type: "string" },
            role: { type: "string" },
            why_relevant: { type: "string" },
          },
        },
      },
      project_barrier_and_stage: {
        type: "object",
        additionalProperties: false,
        required: ["barrier", "stage", "explanation"],
        properties: {
          barrier: { type: "string" },
          stage: { type: "string" },
          explanation: { type: "string" },
        },
      },
      recommended_blended_finance_tool: {
        type: "object",
        additionalProperties: false,
        required: ["tool", "justification"],
        properties: {
          tool: { type: "string" },
          justification: { type: "string" },
        },
      },
      recommended_global_expansion_option: {
        type: "object",
        additionalProperties: false,
        required: ["option", "justification"],
        properties: {
          option: { type: "string" },
          justification: { type: "string" },
        },
      },
      executive_summary: { type: "string" },
      confidence_note: { type: "string" },
    },
  },
  strict: true,
} as const
