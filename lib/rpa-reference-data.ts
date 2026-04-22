import type {
  BarrierReference,
  ExpansionReference,
  ToolReference,
} from "@/types/rpa"

export const BARRIER_REFERENCES: BarrierReference[] = [
  {
    category: "Weak regulation / corruption risk",
    description:
      "Rules are unclear, enforcement is weak, governance is low, or accountability is not strong enough for investors or donors.",
    evidence:
      "Permitting delays; procurement risk; weak contract enforceability; large governance premium; high perceived misuse risk.",
    projectStage: "Early-stage to financing",
    bestFitBlendedFinanceTools: ["Technical assistance / grants"],
    bestFitGlobalExpansionOptions: [],
    source:
      "https://www.oecd.org/content/dam/oecd/en/events/2022/5/cefim_blended-finance-guidance-for-clean-energy---2nd-workshop/Guidance-note-OECD-DAC-Principle-2.pdf",
  },
  {
    category: "Project too early-stage / not investable",
    description:
      "The project is still too early; feasibility, structuring, sponsor readiness, or due diligence is not yet sufficient to attract investors.",
    evidence:
      "No feasibility study; weak financial model; unclear offtake/revenue logic; no clear financial close pathway.",
    projectStage: "Early-stage / pre-bankable",
    bestFitBlendedFinanceTools: ["Technical assistance / grants"],
    bestFitGlobalExpansionOptions: [],
    source:
      "https://www.oecd.org/content/dam/oecd/en/events/2022/5/cefim_blended-finance-guidance-for-clean-energy---2nd-workshop/Guidance-note-OECD-DAC-Principle-2.pdf",
  },
  {
    category: "Weak local implementing capacity",
    description:
      "Local actors are not yet strong enough to execute, govern, report, procure, or maintain implementation quality.",
    evidence:
      "Weak sponsor; weak institutional capacity; weak reporting; weak procurement; weak operating systems.",
    projectStage: "Early-stage to implementation",
    bestFitBlendedFinanceTools: ["Technical assistance / grants"],
    bestFitGlobalExpansionOptions: ["Hybrid", "Local Hybrid", "Local Repurposing"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/events/2022/5/cefim_blended-finance-guidance-for-clean-energy---2nd-workshop/Guidance-note-OECD-DAC-Principle-2.pdf",
  },
  {
    category: "No investable pipeline",
    description:
      "The problem is not only one project; the wider market or system lacks a reliable pipeline of investable opportunities.",
    evidence:
      "Very few projects reach investment committee; high origination costs; repeated transaction failure; weak pipeline continuity.",
    projectStage: "System / pre-market stage",
    bestFitBlendedFinanceTools: ["Technical assistance / grants"],
    bestFitGlobalExpansionOptions: ["Hybrid", "New Build"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/events/2022/5/cefim_blended-finance-guidance-for-clean-energy---2nd-workshop/Guidance-note-OECD-DAC-Principle-2.pdf",
  },
  {
    category: "Private investors fear downside loss",
    description:
      "Investors are interested, but downside risk remains too high relative to expected returns.",
    evidence:
      "Excess collateral demands; short tenor; guarantee demands; deal fails because of risk appetite.",
    projectStage: "Near-bankable / financing stage",
    bestFitBlendedFinanceTools: ["Guarantee / risk-sharing", "First-loss / junior capital"],
    bestFitGlobalExpansionOptions: ["Hybrid", "Deepen Local"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/06/the-role-of-guarantees-in-blended-finance_cef700a2/730e1498-en.pdf",
  },
  {
    category: "Returns too low / payback too long",
    description:
      "The project is useful but the economics are too weak or the payback period is too long.",
    evidence:
      "IRR too low; tariff too low; weak DSCR; affordability constraints; mismatch between returns and investor expectations.",
    projectStage: "Financing / scale-up stage",
    bestFitBlendedFinanceTools: ["Concessional loan"],
    bestFitGlobalExpansionOptions: ["Hybrid", "Deepen Local"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/08/evaluating-blended-finance-instruments-and-mechanisms_c995f112/f1574c10-en.pdf",
  },
  {
    category: "FX risk too high",
    description:
      "Currency risk is too large for the borrower or investor.",
    evidence:
      "Local-currency revenues with hard-currency debt; failed FX stress tests; volatility undermines bankability.",
    projectStage: "Financing stage",
    bestFitBlendedFinanceTools: ["Hedging / local-currency facility"],
    bestFitGlobalExpansionOptions: ["Hybrid"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/02/unlocking-local-currency-financing-in-emerging-markets-and-developing-economies_af15df6a/bc84fde7-en.pdf",
  },
  {
    category: "Outcome is social and hard to monetize",
    description:
      "The main benefit is social or public, but direct revenue capture is weak or the payer is unclear.",
    evidence:
      "Strong outcome logic but weak willingness-to-pay; public savings are dispersed; social value not reflected in cash flow.",
    projectStage: "Social systems / service delivery stage",
    bestFitBlendedFinanceTools: ["Outcome-based incentives"],
    bestFitGlobalExpansionOptions: ["Deepen Local", "Local Hybrid"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/08/evaluating-blended-finance-instruments-and-mechanisms_c995f112/f1574c10-en.pdf",
  },
]

export const TOOL_REFERENCES: ToolReference[] = [
  {
    id: "technical-assistance-grants",
    tool: "Technical assistance / grants",
    description:
      "Grant or TA support for feasibility, structuring, transaction preparation, sponsor strengthening, and pipeline development.",
    bestWhen:
      "Projects are still early-stage, not yet bankable, or need readiness support.",
    strengths: [
      "Strong fit for early-stage opportunities",
      "Improves project readiness and sponsor capacity",
      "Flexible and adaptable across sectors",
    ],
    weaknesses: [
      "Does not always mobilize capital quickly",
      "Financial impact is indirect at first",
      "Can be too soft if the real barrier is already beyond readiness",
    ],
    riskMethodologies: ["Regulatory risk", "Expected loss"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/events/2022/5/cefim_blended-finance-guidance-for-clean-energy---2nd-workshop/Guidance-note-OECD-DAC-Principle-2.pdf",
    baseScores: {
      barrierFit: 8,
      mobilizationPotential: 5,
      financialAdditionality: 7,
      developmentAdditionality: 9,
      concessionalityDiscipline: 7,
      implementationFeasibility: 8,
      resultsImpactMeasurability: 6,
    },
  },
  {
    id: "guarantee-risk-sharing",
    tool: "Guarantee / risk-sharing",
    description:
      "Instrument that absorbs part of losses or default risk to protect lenders or investors.",
    bestWhen:
      "Investors are interested but remain constrained by downside risk.",
    strengths: [
      "Strong mobilization potential",
      "Can crowd in lenders effectively",
      "Targets risk perception directly",
    ],
    weaknesses: [
      "Poor fit if the project is still immature",
      "Can be over-engineered",
      "Requires clear governance, pricing, and claims discipline",
    ],
    riskMethodologies: ["Expected loss"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/06/the-role-of-guarantees-in-blended-finance_cef700a2/730e1498-en.pdf",
    baseScores: {
      barrierFit: 8,
      mobilizationPotential: 9,
      financialAdditionality: 8,
      developmentAdditionality: 6,
      concessionalityDiscipline: 8,
      implementationFeasibility: 6,
      resultsImpactMeasurability: 7,
    },
  },
  {
    id: "first-loss-junior-capital",
    tool: "First-loss / junior capital",
    description:
      "Capital layer that takes the first losses to protect senior investors.",
    bestWhen:
      "The project is viable but still too risky for commercial capital on its own.",
    strengths: [
      "Strong risk absorption",
      "Can unlock more senior capital",
      "Useful for difficult blended structures",
    ],
    weaknesses: [
      "High risk for catalytic funders",
      "Can over-subsidize if barrier diagnosis is wrong",
      "Structuring can be complex",
    ],
    riskMethodologies: ["Expected loss", "Value-at-risk"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/08/evaluating-blended-finance-instruments-and-mechanisms_c995f112/f1574c10-en.pdf",
    baseScores: {
      barrierFit: 8,
      mobilizationPotential: 8,
      financialAdditionality: 9,
      developmentAdditionality: 6,
      concessionalityDiscipline: 6,
      implementationFeasibility: 5,
      resultsImpactMeasurability: 6,
    },
  },
  {
    id: "concessional-loan",
    tool: "Concessional loan",
    description:
      "Below-market financing that improves economics, tenor, or affordability.",
    bestWhen:
      "Returns are too low, payback is too long, or affordability is the main constraint.",
    strengths: [
      "Helps improve financial viability",
      "Useful for affordability and tenor gaps",
      "Can support scale-up once a project is ready",
    ],
    weaknesses: [
      "Can distort markets if too concessional",
      "Needs strong discipline on subsidy sizing",
      "Not ideal if the real problem is still readiness",
    ],
    riskMethodologies: [
      "Expected loss",
      "Discounted cash flow",
      "Public-private partnership risk allocation",
    ],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/08/evaluating-blended-finance-instruments-and-mechanisms_c995f112/f1574c10-en.pdf",
    baseScores: {
      barrierFit: 8,
      mobilizationPotential: 7,
      financialAdditionality: 8,
      developmentAdditionality: 7,
      concessionalityDiscipline: 6,
      implementationFeasibility: 8,
      resultsImpactMeasurability: 7,
    },
  },
  {
    id: "hedging-local-currency-facility",
    tool: "Hedging / local-currency facility",
    description:
      "Instrument that reduces FX risk or provides local-currency financing.",
    bestWhen:
      "The project has local-currency revenues but hard-currency liabilities.",
    strengths: [
      "Highly targeted to FX barriers",
      "Protects borrowers and investors from volatility",
      "Can make otherwise viable deals financeable",
    ],
    weaknesses: [
      "Technical and potentially costly",
      "Does not solve weak pipeline or poor governance",
      "May be unavailable in some markets",
    ],
    riskMethodologies: ["Political risk"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/02/unlocking-local-currency-financing-in-emerging-markets-and-developing-economies_af15df6a/bc84fde7-en.pdf",
    baseScores: {
      barrierFit: 9,
      mobilizationPotential: 7,
      financialAdditionality: 8,
      developmentAdditionality: 5,
      concessionalityDiscipline: 8,
      implementationFeasibility: 5,
      resultsImpactMeasurability: 6,
    },
  },
  {
    id: "outcome-based-incentives",
    tool: "Outcome-based incentives",
    description:
      "Payment structure where disbursement is tied to verified results rather than only inputs.",
    bestWhen:
      "Outcomes are highly social and difficult to monetize through normal revenue.",
    strengths: [
      "Strong accountability and measurement logic",
      "Useful for social systems and public-good outcomes",
      "Can align funding with verified results",
    ],
    weaknesses: [
      "Complex to structure",
      "Requires a credible evaluator and clear outcome payer",
      "Often involves long time lags before outcomes are verified",
    ],
    riskMethodologies: ["Rating agency methodologies"],
    source:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/08/evaluating-blended-finance-instruments-and-mechanisms_c995f112/f1574c10-en.pdf",
    baseScores: {
      barrierFit: 9,
      mobilizationPotential: 6,
      financialAdditionality: 8,
      developmentAdditionality: 9,
      concessionalityDiscipline: 7,
      implementationFeasibility: 5,
      resultsImpactMeasurability: 9,
    },
  },
]

export const EXPANSION_REFERENCES: ExpansionReference[] = [
  {
    id: "deepen-local",
    model: "Deepen Local",
    description:
      "Enhance the capacity of existing local fiscal sponsors and help build regional fiscal sponsorship capability.",
    pros: [
      "Strongest local ownership where capable partners already exist",
      "Builds local legitimacy and ecosystem strength",
      "Good fit for community-based social programs",
    ],
    cons: [
      "Depends on finding capable existing local sponsors",
      "Coverage may stay limited to one or a few jurisdictions",
    ],
    baseScores: {
      speed: 6,
      cost: 6,
      localOwnership: 10,
      scalability: 5,
      capabilityTransfer: 8,
      implementationRisk: 7,
    },
  },
  {
    id: "local-repurposing",
    model: "Local Repurposing",
    description:
      "Support local re-granters to add or adapt fiscal sponsorship functions.",
    pros: [
      "Builds local capacity from existing institutions",
      "More local agency than a purely foreign-led model",
      "Can fit places with grantmaking actors but weak sponsorship infrastructure",
    ],
    cons: [
      "Takes time to adapt systems and governance",
      "May require talent development and process redesign",
      "Geographic coverage can remain limited",
    ],
    baseScores: {
      speed: 5,
      cost: 6,
      localOwnership: 9,
      scalability: 6,
      capabilityTransfer: 9,
      implementationRisk: 6,
    },
  },
  {
    id: "new-build",
    model: "New Build",
    description:
      "Create new fiscal sponsorship capacity from scratch in the target geography.",
    pros: [
      "Maximum control over mission design and local structure",
      "Strong long-term capacity-building potential",
      "Can be tailored to high-priority geographies",
    ],
    cons: [
      "Slowest route to launch",
      "Highest cost and systems burden",
      "Hardest execution risk in legal, operational, and staffing terms",
    ],
    baseScores: {
      speed: 2,
      cost: 2,
      localOwnership: 9,
      scalability: 7,
      capabilityTransfer: 10,
      implementationRisk: 3,
    },
  },
  {
    id: "local-hybrid",
    model: "Local Hybrid",
    description:
      "Set up a local organization with local governance and regranting capability, while using RPA or fiscal-sponsor support contractually to accelerate execution.",
    pros: [
      "Balances local legitimacy with faster execution support",
      "Strong for knowledge transfer and institution building",
      "Closer to local communities than a pure external model",
    ],
    cons: [
      "Still requires some local entity-building from scratch",
      "Not as fast or cheap as a pure hybrid",
      "Coverage may remain selective at first",
    ],
    baseScores: {
      speed: 5,
      cost: 5,
      localOwnership: 8,
      scalability: 7,
      capabilityTransfer: 9,
      implementationRisk: 6,
    },
  },
  {
    id: "hybrid",
    model: "Hybrid",
    description:
      "Operate through RPA’s existing 501(c)(3) or external platform while adding local advisory and operational capacity in the target geography.",
    pros: [
      "Fastest practical launch route",
      "Lower setup cost and stronger resource efficiency",
      "Easier to scale across multiple places",
      "Useful when testing a new geography first",
    ],
    cons: [
      "Weaker local ownership than locally anchored models",
      "Can create Global North perception risk",
      "Requires deliberate safeguards to keep local leadership meaningful",
    ],
    baseScores: {
      speed: 9,
      cost: 8,
      localOwnership: 5,
      scalability: 9,
      capabilityTransfer: 6,
      implementationRisk: 8,
    },
  },
]
