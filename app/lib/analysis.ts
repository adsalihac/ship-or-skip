import type {
  AnalysisReport,
  AnalysisSection,
  Decision,
  DifficultyLevel,
  MonetizationLevel,
  ScoreMetric,
  SignalLevel
} from "./types";

const DEMAND_KEYWORDS = [
  "expense",
  "invoice",
  "tax",
  "accounting",
  "release",
  "compliance",
  "workflow",
  "hiring",
  "resume",
  "sales",
  "crm",
  "analytics",
  "security",
  "health",
  "education",
  "tutor",
  "freelancer",
  "developer",
  "customer",
  "team"
];

const SATURATED_KEYWORDS = [
  "resume builder",
  "fitness",
  "expense tracker",
  "marketplace",
  "events",
  "social",
  "dating",
  "habit",
  "productivity",
  "ai",
  "chatbot",
  "notes",
  "calendar"
];

const B2B_KEYWORDS = [
  "saas",
  "developer",
  "team",
  "company",
  "business",
  "workflow",
  "release",
  "compliance",
  "finance",
  "sales",
  "crm",
  "ops",
  "freelancer",
  "agency"
];

const COMPLEXITY_KEYWORDS = [
  "marketplace",
  "ai",
  "video",
  "youtube",
  "realtime",
  "real-time",
  "mobile",
  "native",
  "hardware",
  "payments",
  "compliance",
  "health",
  "fintech"
];

const CONSUMER_KEYWORDS = [
  "fitness",
  "events",
  "social",
  "dating",
  "habit",
  "consumer",
  "friends",
  "local"
];

const EXAMPLE_OVERRIDES: Record<string, Partial<AnalysisReport>> = {};

function clamp(value: number, min = 1, max = 10) {
  return Math.min(max, Math.max(min, value));
}

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((total, keyword) => (text.includes(keyword) ? total + 1 : total), 0);
}

function levelFromScore(score: number): SignalLevel {
  if (score >= 7.5) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function difficultyFromScore(score: number): DifficultyLevel {
  if (score >= 7.5) return "Easy";
  if (score >= 5) return "Medium";
  return "Hard";
}

function monetizationFromScore(score: number): MonetizationLevel {
  if (score >= 7.5) return "Easy";
  if (score >= 5) return "Moderate";
  return "Difficult";
}

function decisionFromScore(score: number): Decision {
  if (score >= 75) return "SHIP";
  if (score >= 55) return "VALIDATE MORE";
  return "SKIP";
}

function stableId(idea: string) {
  let hash = 0;

  for (let index = 0; index < idea.length; index += 1) {
    hash = (hash << 5) - hash + idea.charCodeAt(index);
    hash |= 0;
  }

  return `sos-${Math.abs(hash).toString(36)}`;
}

function containsAudience(text: string) {
  return /\bfor\s+[a-z0-9\s-]{3,50}/.test(text) || text.includes("freelancer") || text.includes("developer");
}

function buildMetric(name: string, score: number, label: string, rationale: string): ScoreMetric {
  return {
    name,
    score: clamp(Math.round(score)),
    label,
    rationale
  };
}

function section(
  title: string,
  verdict: AnalysisSection["verdict"],
  rationale: string,
  bullets: string[]
): AnalysisSection {
  return {
    title,
    verdict,
    rationale,
    bullets
  };
}

function buildRisks(
  text: string,
  competitionRisk: SignalLevel,
  distribution: DifficultyLevel,
  buildDifficulty: DifficultyLevel
) {
  const risks: string[] = [];

  if (competitionRisk === "High") {
    risks.push("Crowded category with many established alternatives.");
  }

  if (distribution === "Hard") {
    risks.push("Customer acquisition may require sustained content, community, or partnerships.");
  }

  if (buildDifficulty === "Hard") {
    risks.push("The MVP could expand into infrastructure-heavy work before demand is proven.");
  }

  if (text.includes("marketplace")) {
    risks.push("Two-sided liquidity is hard to create without a narrow wedge.");
  }

  if (text.includes("ai")) {
    risks.push("AI output quality and data access may become the main trust constraint.");
  }

  if (risks.length < 3) {
    risks.push("The buyer pain may be real but not urgent enough to trigger paid adoption.");
  }

  if (risks.length < 3) {
    risks.push("Differentiation needs to be sharper than a better interface.");
  }

  if (risks.length < 3) {
    risks.push("The first acquisition channel is not proven yet.");
  }

  return risks.slice(0, 3);
}

function buildOpportunities(text: string, demand: SignalLevel, monetization: MonetizationLevel) {
  const opportunities: string[] = [];

  if (demand === "High") {
    opportunities.push("The problem maps to visible demand signals and repeated workflow pain.");
  }

  if (monetization === "Easy") {
    opportunities.push("A subscription or usage-based price can be tested early.");
  }

  if (containsAudience(text)) {
    opportunities.push("The audience is specific enough to target with focused messaging.");
  }

  if (text.includes("developer") || text.includes("react native") || text.includes("release")) {
    opportunities.push("Developer-led distribution can compound through demos, docs, and templates.");
  }

  if (text.includes("local")) {
    opportunities.push("A constrained geography can make early supply and demand easier to validate.");
  }

  if (opportunities.length < 3) {
    opportunities.push("A narrow landing page test can validate intent before product work.");
  }

  if (opportunities.length < 3) {
    opportunities.push("Manual service delivery can simulate the product and reveal the strongest wedge.");
  }

  return opportunities.slice(0, 3);
}

function buildRecommendation(decision: Decision, text: string, score: number) {
  if (decision === "SHIP") {
    return [
      "Build a narrow MVP around the highest-frequency workflow, not the full platform.",
      "Publish a landing page with pricing and collect 100 qualified emails before expanding scope.",
      "Run 12 customer interviews and ask buyers to rank the problem against their current priorities."
    ];
  }

  if (decision === "VALIDATE MORE") {
    const marketAdvice = text.includes("marketplace")
      ? "Validate one side of the marketplace manually before building matching or payments."
      : "Test willingness to pay with a concierge prototype before writing production code.";

    return [
      marketAdvice,
      "Define one target segment and one painful job to be done; avoid broad consumer positioning.",
      `Do not start a full build until the idea can earn at least ${score >= 65 ? "10" : "5"} strong buyer commitments.`
    ];
  }

  return [
    "Skip the full product for now and search for a sharper wedge with more urgent demand.",
    "Interview the intended audience to find a painful, frequent, budget-backed problem.",
    "Re-score the idea after narrowing the customer, workflow, and monetization path."
  ];
}

export function generateReport(rawIdea: string): AnalysisReport {
  const idea = rawIdea.trim();
  const text = idea.toLowerCase();
  const demandMatches = countMatches(text, DEMAND_KEYWORDS);
  const saturatedMatches = countMatches(text, SATURATED_KEYWORDS);
  const b2bMatches = countMatches(text, B2B_KEYWORDS);
  const complexityMatches = countMatches(text, COMPLEXITY_KEYWORDS);
  const consumerMatches = countMatches(text, CONSUMER_KEYWORDS);
  const hasAudience = containsAudience(text);
  const wordCount = idea.split(/\s+/).filter(Boolean).length;

  const marketScore = clamp(4 + demandMatches * 0.85 + (hasAudience ? 1 : 0) + (wordCount > 12 ? 0.8 : 0));
  const competitionRiskRaw = clamp(3 + saturatedMatches * 1.15 + (text.includes("ai") ? 0.75 : 0), 1, 10);
  const competitionScore = clamp(11 - competitionRiskRaw + (hasAudience ? 0.7 : 0));
  const monetizationScore = clamp(4.5 + b2bMatches * 0.75 - consumerMatches * 0.45 + (text.includes("marketplace") ? -0.7 : 0));
  const executionScore = clamp(8.5 - complexityMatches * 0.8 + (text.includes("no-code") ? 0.5 : 0));
  const distributionScore = clamp(6.5 + (hasAudience ? 1 : 0) + b2bMatches * 0.35 - consumerMatches * 0.75 - (text.includes("marketplace") ? 1.1 : 0));
  const founderAdvantageScore = clamp(4.8 + (hasAudience ? 1.4 : 0) + (text.includes("developer") ? 1 : 0) + (text.includes("react native") ? 1.2 : 0) + (wordCount > 18 ? 0.8 : 0));

  const overall = Math.round(
    marketScore * 9.8 +
      competitionScore * 8.4 +
      monetizationScore * 9.2 +
      executionScore * 7.2 +
      distributionScore * 8.1 +
      founderAdvantageScore * 7.3
  );
  const score = Math.min(96, Math.max(28, Math.round(overall / 5.0)));
  const decision = decisionFromScore(score);
  const demandLevel = levelFromScore(marketScore);
  const competitionRisk = levelFromScore(competitionRiskRaw);
  const monetizationLevel = monetizationFromScore(monetizationScore);
  const buildDifficulty = difficultyFromScore(executionScore);
  const distributionLevel = difficultyFromScore(distributionScore);

  const metrics = [
    buildMetric(
      "Market Demand",
      marketScore,
      demandLevel,
      "Measures pain severity, audience clarity, and evidence of existing buyer demand."
    ),
    buildMetric(
      "Competition",
      competitionScore,
      `${competitionRisk} risk`,
      "Higher score means the category leaves more room for a differentiated entrant."
    ),
    buildMetric(
      "Monetization",
      monetizationScore,
      monetizationLevel,
      "Assesses pricing clarity, recurring revenue potential, and budget ownership."
    ),
    buildMetric(
      "Execution Difficulty",
      executionScore,
      buildDifficulty,
      "Higher score means the first version can be built without excessive infrastructure."
    ),
    buildMetric(
      "Distribution Difficulty",
      distributionScore,
      distributionLevel,
      "Higher score means the audience is reachable through focused channels."
    ),
    buildMetric(
      "Founder Advantage",
      founderAdvantageScore,
      founderAdvantageScore >= 7 ? "Strong" : founderAdvantageScore >= 5 ? "Emerging" : "Unclear",
      "Rewards narrow customer insight, domain specificity, and credible unfair advantage."
    )
  ];

  const summaryByDecision: Record<Decision, string> = {
    SHIP:
      "This idea has enough demand, monetization clarity, and reachable audience definition to justify a narrow MVP. The main task is keeping scope disciplined while validating buyer urgency.",
    "VALIDATE MORE":
      "This idea shows promise, but it needs sharper evidence before a serious build. Validate demand, pricing, and the first acquisition channel before committing months of product work.",
    SKIP:
      "This idea currently lacks enough urgency, differentiation, or distribution clarity to justify a full build. A narrower customer segment or more painful workflow is needed first."
  };

  const sections = {
    marketDemand: section(
      "Market Demand",
      demandLevel,
      `${demandLevel} demand based on problem specificity, audience clarity, and visible workflow pain.`,
      [
        hasAudience ? "The idea names a reachable customer segment." : "The target buyer needs sharper definition.",
        demandMatches > 1 ? "Several terms point to recurring, operational demand." : "Demand signals are present but still broad.",
        wordCount > 12 ? "The idea includes enough context for a first validation test." : "More detail would improve confidence."
      ]
    ),
    competition: section(
      "Competition Analysis",
      competitionRisk,
      `${competitionRisk} competitive risk based on category saturation and expected substitutes.`,
      [
        saturatedMatches > 0 ? "The market likely contains polished incumbents or many AI-first entrants." : "The category appears less obviously saturated.",
        hasAudience ? "A narrow segment can create a defensible wedge." : "Broad positioning increases substitution risk.",
        "Differentiation should be expressed as a measurable workflow outcome."
      ]
    ),
    monetization: section(
      "Monetization Analysis",
      monetizationLevel,
      `${monetizationLevel} monetization path based on budget ownership and pricing expectations.`,
      [
        b2bMatches > 0 ? "Business or professional users improve willingness to pay." : "Budget ownership is not yet obvious.",
        text.includes("marketplace") ? "Marketplace take-rate economics require transaction density." : "Subscription pricing can be tested with a lightweight offer.",
        "Pricing should be validated before broad feature development."
      ]
    ),
    buildComplexity: section(
      "Build Complexity",
      buildDifficulty,
      `${buildDifficulty} first-version complexity based on technical surface area and dependencies.`,
      [
        complexityMatches > 1 ? "The concept includes multiple hard product surfaces." : "A constrained MVP appears realistic.",
        text.includes("ai") ? "AI quality should be tested with a manual benchmark before automation." : "Core workflow can likely be prototyped without specialized infrastructure.",
        "The MVP should avoid account systems, dashboards, and secondary workflows."
      ]
    ),
    distribution: section(
      "Distribution Analysis",
      distributionLevel,
      `${distributionLevel} distribution difficulty based on audience concentration and channel clarity.`,
      [
        hasAudience ? "The audience can be reached with targeted content and direct outreach." : "The acquisition channel is still under-specified.",
        consumerMatches > 0 ? "Consumer adoption may depend on trust, habit formation, or network effects." : "A focused professional segment can support direct sales validation.",
        "The first channel should be proven before product expansion."
      ]
    )
  };

  const risks = buildRisks(text, competitionRisk, distributionLevel, buildDifficulty);
  const opportunities = buildOpportunities(text, demandLevel, monetizationLevel);
  const recommendation = buildRecommendation(decision, text, score);
  const shareText = `My startup idea scored ${score}/100 on ShipOrSkip.\n\nVerdict: ${decision}\n\nTry your idea at shiporskip.com`;
  const report = {
    id: stableId(idea),
    idea,
    decision,
    score,
    summary: summaryByDecision[decision],
    metrics,
    sections,
    risks,
    opportunities,
    recommendation,
    shareText
  };

  return {
    ...report,
    ...EXAMPLE_OVERRIDES[idea]
  };
}
