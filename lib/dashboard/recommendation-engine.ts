import type { RecommendationProfile, Step5ExpansionReference } from "@/types/dashboard/scorecard"

export function recommendToolByBarrier(barrier: string) {
  const normalized = barrier.toLowerCase()

  if (normalized.includes("early-stage") || normalized.includes("readiness")) {
    return {
      tool: "Technical Assistance / Grants",
      rationale: "Early pipeline strengthening is required before commercial capital can scale.",
    }
  }
  if (normalized.includes("downside") || normalized.includes("investor")) {
    return {
      tool: "Guarantee / Risk-Sharing",
      rationale: "Risk-sharing absorbs part of downside and improves lender confidence.",
    }
  }
  if (normalized.includes("long payback") || normalized.includes("weak economics")) {
    return {
      tool: "Concessional Loan",
      rationale: "Longer tenor and softer pricing improve project viability during early years.",
    }
  }
  if (normalized.includes("fx") || normalized.includes("currency")) {
    return {
      tool: "Hedging / Local-Currency Facility",
      rationale: "Currency risk mitigation protects cash flows and debt sustainability.",
    }
  }
  if (normalized.includes("outcome") || normalized.includes("monetization")) {
    return {
      tool: "Outcome-Based Incentives",
      rationale: "Outcome payments bridge monetization gaps for public-good impact.",
    }
  }

  return {
    tool: "First-Loss / Junior Capital",
    rationale: "A junior tranche can crowd in private investors when risk appetite is low.",
  }
}

export function recommendExpansionModel(
  profile: RecommendationProfile,
  models: Step5ExpansionReference[],
) {
  const scoreModel = (model: Step5ExpansionReference) => {
    const name = model.model.toLowerCase()
    let score = 0
    if (name.includes("deepen") || name.includes("local")) score += profile.localOwnershipNeed
    if (name.includes("new build")) score += profile.scalabilityGoal + profile.speedPriority * 0.3
    if (name.includes("hybrid")) score += profile.scalabilityGoal + profile.regulatoryFeasibilityNeed
    if (name.includes("repurposing")) score += profile.costSensitivity + profile.speedPriority
    score += profile.capacityBuildingNeed * 0.5
    return score
  }

  const best = [...models].sort((a, b) => scoreModel(b) - scoreModel(a))[0]

  return {
    model: best?.model ?? "Local Hybrid",
    rationale:
      "Recommendation balances ownership requirements, speed, cost discipline, scalability, and regulatory feasibility.",
  }
}
