export type JournalEntry = {
  id: string;
  ideaName: string;
  note: string;
  createdAt: string;
};

export type MvpInput = {
  idea: string;
};

export type MvpResult = {
  difficultyScore: number;
  difficultyLabel: string;
  smallestMvp: string;
  reasoning: string;
  timeEstimate: string;
};

export type RevenueInput = {
  pricePerMonth: number;
  targetCustomersPerMonth: number;
  monthlyGrowthRate: number;
};

export type MonthlyProjection = {
  month: number;
  newCustomers: number;
  totalCustomers: number;
  mrr: number;
};

export type RevenueResult = {
  mrr: number;
  arr: number;
  totalCustomers: number;
  projections: MonthlyProjection[];
};

export type CompetitorInput = {
  name1: string;
  name2: string;
  name3: string;
  niche: string;
};

export type CompetitorAnalysis = {
  name: string;
  signal: "High" | "Medium" | "Low";
  reasoning: string;
};

export type CompetitorResult = {
  crowdedness: "Crowded" | "Moderately Crowded" | "Uncrowded";
  crowdednessScore: number;
  analyses: CompetitorAnalysis[];
  summary: string;
  recommendation: string;
};

export type MvpResultType =
  | { ok: true; report: MvpResult }
  | { ok: false; error: string };

export type CompetitorResultType =
  | { ok: true; report: CompetitorResult }
  | { ok: false; error: string };

function countKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw)).length;
}

function mvpKeywordScore(idea: string): number {
  const complexityKeywords = [
    "ai", "machine learning", "ml", "deep learning", "llm", "chatgpt", "gpt",
    "recommendation", "personalized", "real-time", "realtime", "streaming",
    "marketplace", "multi-tenant", "saas", "platform", "api", "integration",
    "sync", "collaboration", "analytics", "dashboard", "reporting",
    "automation", "workflow", "pipeline", "etl", "crawl", "scrape",
    "computer vision", "nlp", "natural language", "speech", "voice",
    "video processing", "image processing", "render", "3d", "ar", "vr",
    "blockchain", "web3", "smart contract", "nft", "crypto",
    "social network", "feed", "notification", "messaging", "chat",
    "payment", "billing", "subscription", "stripe", "checkout",
    "search", "index", "elastic", "database", "postgres", "redis",
    "docker", "kubernetes", "k8s", "deploy", "infrastructure",
  ];

  const featureCount = countKeywords(idea, complexityKeywords);

  if (featureCount >= 6) return 10;
  if (featureCount >= 4) return 8;
  if (featureCount >= 3) return 7;
  if (featureCount >= 2) return 5;
  if (featureCount >= 1) return 3;
  return 1;
}

function estimateTime(difficultyScore: number): string {
  if (difficultyScore <= 2) return "1–3 days";
  if (difficultyScore <= 4) return "3–7 days";
  if (difficultyScore <= 6) return "1–2 weeks";
  if (difficultyScore <= 8) return "2–4 weeks";
  return "4+ weeks";
}

function generateMvpSuggestion(idea: string, score: number): string {
  const lower = idea.toLowerCase();

  if (lower.includes("ai") || lower.includes("ml") || lower.includes("llm")) {
    return "Strip out all AI. Start with a manual/mechanical turk version. Do the work yourself or use a simple rules-based system. Add AI only after you validate demand.";
  }
  if (lower.includes("marketplace")) {
    return "Remove the marketplace. Pick one side and service them directly. Be the concierge, not the platform. Use a spreadsheet and manual matching at first.";
  }
  if (lower.includes("saas") || lower.includes("dashboard") || lower.includes("analytics")) {
    return "Build a single-user version with hardcoded data. No auth, no multi-tenancy, no onboarding flow. Just the core value delivery — a CSV upload + one chart.";
  }
  if (lower.includes("social") || lower.includes("feed") || lower.includes("community")) {
    return "Skip the feed and profiles. Use a mailing list or a shared Google Doc to distribute content. Validate with 10 manual posts before writing any code.";
  }
  if (lower.includes("payment") || lower.includes("checkout") || lower.includes("billing")) {
    return "Use a payment link (Stripe Payment Link or LemonSqueezy). No custom checkout page. Validate with a single buy button and manual fulfillment.";
  }
  if (lower.includes("video") || lower.includes("stream")) {
    return "Use existing tools (Loom, YouTube, Zoom) for delivery. No custom player or transcoding. Validate with manual uploads and shared links.";
  }

  if (score >= 8) {
    return "Cut 80% of features. Keep only the single most valuable action a user can take. Deliver it via the simplest possible interface — a form, a spreadsheet, or even email.";
  }
  if (score >= 5) {
    return "Scope down to one user flow end-to-end. Remove settings, onboarding, teams, permissions, and integrations. Hardcode what you can. No database — use files or localStorage.";
  }

  return "Build a minimum version with the core loop. Remove all secondary features (auth, settings, email). Launch to 5 beta users within a week.";
}

function generateMvpReasoning(idea: string, score: number): string {
  const complexityKeywords = [
    "ai", "machine learning", "marketplace", "saas", "platform",
    "real-time", "analytics", "social", "payment", "video",
  ];

  const found = complexityKeywords.filter((kw) => idea.toLowerCase().includes(kw));

  if (found.length > 0) {
    return `Your idea involves ${found.join(", ")}, which typically requires significant upfront investment. The recommended MVP strips these out to validate demand first.`;
  }
  if (score >= 7) {
    return "This idea scores high on execution complexity. The safest path is to validate with a fake door test or concierge MVP before writing any code.";
  }
  if (score >= 4) {
    return "Moderate complexity. You can build a functional prototype in 1–2 weeks if you aggressively scope down. Focus on the core value prop only.";
  }
  return "Low complexity. You can build and ship a basic version quickly. The main risk is distribution, not development.";
}

export function generateMvpReport(input: MvpInput): MvpResult {
  const score = mvpKeywordScore(input.idea);
  const difficultyLabel =
    score <= 3 ? "Easy" : score <= 6 ? "Medium" : "Hard";

  return {
    difficultyScore: score,
    difficultyLabel,
    smallestMvp: generateMvpSuggestion(input.idea, score),
    reasoning: generateMvpReasoning(input.idea, score),
    timeEstimate: estimateTime(score),
  };
}

export function calculateRevenue(input: RevenueInput): RevenueResult {
  const { pricePerMonth, targetCustomersPerMonth, monthlyGrowthRate } = input;
  const projections: MonthlyProjection[] = [];

  let totalCustomers = 0;
  let currentNewCustomers = targetCustomersPerMonth;

  for (let month = 1; month <= 12; month++) {
    if (month > 1) {
      currentNewCustomers = Math.round(
        targetCustomersPerMonth * Math.pow(1 + monthlyGrowthRate / 100, month - 1)
      );
    }
    totalCustomers += currentNewCustomers;
    const mrr = totalCustomers * pricePerMonth;

    projections.push({
      month,
      newCustomers: currentNewCustomers,
      totalCustomers,
      mrr,
    });
  }

  return {
    mrr: projections[11].mrr,
    arr: projections[11].mrr * 12,
    totalCustomers,
    projections,
  };
}

function analyzeCompetitorCrowdedness(competitors: string[], niche: string): number {
  const allText = [...competitors, niche].join(" ").toLowerCase();

  const crowdedSignals = [
    "saas", "platform", "software", "app", "cloud", "enterprise",
    "ai", "ml", "data", "analytics", "marketplace", "social",
    "fintech", "health", "edtech", "proptech", "legaltech",
    "crm", "erp", "hr", "payroll", "accounting", "marketing",
    "sales", "support", "customer", "engagement", "automation",
    "subscription", "b2b", "b2c", "mobile", "web", "api",
  ];

  const cleanCompetitors = competitors.map((c) =>
    c.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim()
  );

  const crowdedSignalCount = countKeywords(allText, crowdedSignals);

  const score = Math.min(
    10,
    Math.max(
      1,
      Math.round(
        cleanCompetitors.filter((c) => c.length > 0).length * 1.5 +
        crowdedSignalCount * 1.2
      )
    )
  );

  return score;
}

function analyzeCompetitorName(name: string, niche: string): CompetitorAnalysis {
  const lower = name.toLowerCase();

  const fundedSignals = [
    "hub", "cloud", "io", "ai", "labs", "technologies", "tech",
    "global", "solutions", "systems", "group", "capital", "ventures",
    "series", "funded", "backed",
  ];

  const smallSignals = [
    "hq", "beta", "early", "mvp", "app", "co", "xyz",
  ];

  const fundedScore = countKeywords(lower, fundedSignals);
  const smallScore = countKeywords(lower, smallSignals);

  if (fundedScore > smallScore) {
    return {
      name,
      signal: "High",
      reasoning: `"${name}" has characteristics of a well-funded or established player in the ${niche} space.`,
    };
  }

  if (smallScore > fundedScore) {
    return {
      name,
      signal: "Low",
      reasoning: `"${name}" appears to be an early-stage or smaller player in the ${niche} space.`,
    };
  }

  return {
    name,
    signal: "Medium",
    reasoning: `"${name}" has characteristics common among active competitors in the ${niche} space.`,
  };
}

export function generateCompetitorReport(input: CompetitorInput): CompetitorResult {
  const competitors = [input.name1, input.name2, input.name3].filter(Boolean);
  const analyses = competitors.map((name) =>
    analyzeCompetitorName(name, input.niche)
  );
  const crowdednessScore = analyzeCompetitorCrowdedness(competitors, input.niche);

  const crowdedness =
    crowdednessScore >= 7
      ? "Crowded"
      : crowdednessScore >= 4
        ? "Moderately Crowded"
        : "Uncrowded";

  const highSignals = analyses.filter((a) => a.signal === "High").length;

  let summary: string;
  if (crowdedness === "Crowded") {
    summary = `The ${input.niche} space appears crowded with ${competitors.length} notable competitors. ${highSignals} of them show signals of established players. Differentiate with a strong unique value proposition.`;
  } else if (crowdedness === "Moderately Crowded") {
    summary = `The ${input.niche} space has some competition but is not saturated. There is room for a well-executed entrant with a differentiated approach.`;
  } else {
    summary = `The ${input.niche} space appears relatively uncrowded based on the competitors entered. This could indicate a blue ocean opportunity — or limited proven demand. Validate carefully.`;
  }

  let recommendation: string;
  if (crowdedness === "Crowded") {
    recommendation = "Focus on a specific underserved sub-niche. Competing broadly will require significant resources. Consider a distribution-first strategy rather than a feature-first strategy.";
  } else if (crowdedness === "Moderately Crowded") {
    recommendation = "You can compete by focusing on a strong user experience and targeted distribution. Study competitors' weaknesses and build specifically to address them.";
  } else {
    recommendation = "This could be a greenfield opportunity. Prioritize demand validation — low competition may mean low demand. Talk to 20 potential customers before building.";
  }

  return {
    crowdedness,
    crowdednessScore,
    analyses,
    summary,
    recommendation,
  };
}
