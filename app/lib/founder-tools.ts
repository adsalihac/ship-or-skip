import { generateReport } from "./analysis";
import type { AnalysisReport } from "./types";
import { generateMvpReport, calculateRevenue, generateCompetitorReport } from "./solo-founders";

/* ────────── 1. Target Market Sizer ────────── */

export type MarketSizerInput = { niche: string };
export type MarketSizerResult = {
  tam: string; sam: string; som: string;
  tamRationale: string; samRationale: string; somRationale: string;
  breakdown: { label: string; value: string }[];
};

const marketData: Record<string, { tam: [number, number]; samPct: [number, number]; somPct: [number, number] }> = {
  fintech: { tam: [150, 300], samPct: [15, 25], somPct: [3, 8] },
  edtech: { tam: [100, 250], samPct: [12, 20], somPct: [2, 5] },
  health: { tam: [200, 400], samPct: [10, 18], somPct: [1, 4] },
  saas: { tam: [200, 500], samPct: [15, 30], somPct: [3, 7] },
  ai: { tam: [150, 350], samPct: [10, 20], somPct: [2, 5] },
  marketplace: { tam: [100, 300], samPct: [10, 15], somPct: [1, 3] },
  ecommerce: { tam: [300, 600], samPct: [10, 20], somPct: [2, 5] },
  proptech: { tam: [80, 200], samPct: [10, 15], somPct: [1, 3] },
  legaltech: { tam: [20, 50], samPct: [15, 25], somPct: [3, 8] },
  climate: { tam: [100, 250], samPct: [8, 15], somPct: [1, 3] },
};

function formatB(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}T` : `$${n}B`;
}

export function sizeMarket(input: MarketSizerInput): MarketSizerResult {
  const lower = input.niche.toLowerCase();
  let matched: { tam: [number, number]; samPct: [number, number]; somPct: [number, number] } | undefined;
  let matchedKey = "";
  for (const [key, data] of Object.entries(marketData)) {
    if (lower.includes(key)) { matched = data; matchedKey = key; break; }
  }
  if (!matched) {
    matched = { tam: [50, 150], samPct: [10, 20], somPct: [2, 5] };
    matchedKey = "general software";
  }
  const tamLow = matched.tam[0], tamHigh = matched.tam[1];
  const tamMid = Math.round((tamLow + tamHigh) / 2);
  const samLow = Math.round(tamMid * matched.samPct[0] / 100);
  const samHigh = Math.round(tamMid * matched.samPct[1] / 100);
  const somLow = Math.round(tamMid * matched.somPct[0] / 100);
  const somHigh = Math.round(tamMid * matched.somPct[1] / 100);

  return {
    tam: `${formatB(tamLow)} – ${formatB(tamHigh)}`,
    sam: `${formatB(samLow)} – ${formatB(samHigh)}`,
    som: `${formatB(somLow)} – ${formatB(somHigh)}`,
    tamRationale: `The global ${matchedKey} market is estimated between ${formatB(tamLow)} and ${formatB(tamHigh)} based on industry analyst reports.`,
    samRationale: `Your serviceable market (niche-addressable segment) is approximately ${matched.samPct[0]}–${matched.samPct[1]}% of TAM: ${formatB(samLow)} to ${formatB(samHigh)}.`,
    somRationale: `A realistic 12-month target is ${matched.somPct[0]}–${matched.somPct[1]}% of SAM: ${formatB(somLow)} to ${formatB(somHigh)} with focused distribution.`,
    breakdown: [
      { label: "Total Addressable Market (TAM)", value: `${formatB(tamLow)} – ${formatB(tamHigh)}` },
      { label: "Serviceable Addressable Market (SAM)", value: `${formatB(samLow)} – ${formatB(samHigh)}` },
      { label: "Serviceable Obtainable Market (SOM)", value: `${formatB(somLow)} – ${formatB(somHigh)}` },
    ],
  };
}

/* ────────── 2. Customer Discovery Questions ────────── */

export type DiscoveryInput = { idea: string };
export type DiscoveryResult = { questions: { category: string; questions: string[] }[] };

export function generateDiscoveryQuestions(input: DiscoveryInput): DiscoveryResult {
  const lower = input.idea.toLowerCase();
  const categoryKeywords: Record<string, string[]> = {
    "Problem Validation": ["problem", "pain", "struggle", "waste", "hard", "difficult", "frustrat"],
    "Solution Fit": ["solution", "solve", "fix", "build", "create", "app", "tool", "platform"],
    "Willingness to Pay": ["price", "pay", "cost", "money", "pricing", "subscription", "freemium"],
    "Behavior & Habits": ["daily", "habit", "currently", "use", "manage", "track", "organize"],
    "Alternatives": ["currently", "use", "alternative", "instead", "spreadsheet", "manual", "excel"],
  };

  const allQuestions: Record<string, string[]> = {
    "Problem Validation": [
      "What is the single biggest frustration you face with [topic] today?",
      "How much time do you waste on [topic] each week?",
      "Have you tried solving this before? What happened?",
      "On a scale of 1–10, how painful is this problem?",
      "What would happen if you ignored this problem for another year?",
    ],
    "Solution Fit": [
      "If I told you a tool could solve [problem], what would it absolutely need to do?",
      "What features would make you try it immediately?",
      "What would make you stop using it after the first week?",
      "Have you used anything similar? What did you like or hate?",
      "Would you trust a new solution from an unknown founder?",
    ],
    "Willingness to Pay": [
      "How much would you pay per month for a solution?",
      "Would you pay annually for a discount?",
      "Does your company have a budget for tools like this?",
      "What is the most you&apos;ve personally paid for a software tool?",
      "Would you pay before or after trying a free version?",
    ],
    "Behavior & Habits": [
      "Walk me through how you handle [topic] today step by step.",
      "How often does this problem come up?",
      "Who else in your team/company deals with this?",
      "What tools do you already use daily?",
      "What would need to change for you to adopt a new workflow?",
    ],
    "Alternatives": [
      "What are you using right now instead of this?",
      "What don&apos;t you like about your current solution?",
      "Have you evaluated other tools in the past 6 months?",
      "What would it take to switch from your current setup?",
      "Is your current solution free or paid?",
    ],
  };

  const matchedCategories = new Set<string>();
  for (const [cat, kws] of Object.entries(categoryKeywords)) {
    if (kws.some((kw) => lower.includes(kw))) matchedCategories.add(cat);
  }
  if (matchedCategories.size === 0) {
    ["Problem Validation", "Solution Fit", "Willingness to Pay", "Behavior & Habits", "Alternatives"].forEach((c) => matchedCategories.add(c));
  }

  const questions = Array.from(matchedCategories).slice(0, 5).map((cat) => ({
    category: cat,
    questions: allQuestions[cat] || [],
  }));

  return { questions };
}

/* ────────── 3. Trend Analyzer ────────── */

export type TrendInput = { trend: string };
export type TrendResult = {
  verdict: "Opportunity" | "Caution" | "Watch";
  score: number;
  summary: string;
  signals: { label: string; type: "positive" | "negative" | "neutral"; detail: string }[];
  recommendation: string;
};

export function analyzeTrend(input: TrendInput): TrendResult {
  const lower = input.trend.toLowerCase();
  const positive = ["growing", "increasing", "rising", "surge", "boom", "adoption", "innovation", "funding", "investment", "record", "demand", "shortage", "new regulation", "mandate", "shift", "remote", "ai", "ml", "automation", "sustainability", "green", "digital transformation"];
  const negative = ["decline", "shrinking", "saturation", "bubble", "crash", "slowdown", "regulation risk", "ban", "lawsuit", "backlash", "privacy concern", "layoff", "downturn", "recession", "overhyped"];

  const posCount = positive.filter((w) => lower.includes(w)).length;
  const negCount = negative.filter((w) => lower.includes(w)).length;

  const signals: TrendResult["signals"] = [];
  if (posCount >= 2) signals.push({ label: "Strong tailwind", type: "positive", detail: `${posCount} positive signals detected — the trend has momentum.` });
  else signals.push({ label: "Limited tailwind", type: "neutral", detail: "Few strong positive signals. Verify the trend direction independently." });
  if (negCount >= 1) signals.push({ label: "Risk detected", type: "negative", detail: `${negCount} risk signal${negCount > 1 ? "s" : ""} present. Proceed with caution.` });
  else signals.push({ label: "No major risks", type: "positive", detail: "No immediate negative signals detected in your input." });

  const score = Math.min(10, Math.max(1, 5 + (posCount - negCount) * 1.5));
  let verdict: TrendResult["verdict"] = "Watch";
  if (score >= 7) verdict = "Opportunity";
  else if (score <= 3) verdict = "Caution";

  const summary = verdict === "Opportunity"
    ? "The trend shows strong positive signals with growing momentum. This could be a good time to enter with a focused offering."
    : verdict === "Caution"
      ? "The trend has concerning signals. Consider waiting for more clarity or validating demand before committing resources."
      : "Mixed signals. The trend is developing but unclear. Monitor closely and validate with customer interviews.";

  return { verdict, score: Math.round(score * 10) / 10, summary, signals, recommendation: "Talk to 10 people actively following this trend before building anything." };
}

/* ────────── 4. Burn Rate Calculator ────────── */

export type BurnRateInput = {
  monthlyExpenses: number; currentCash: number; monthlyRevenue: number;
};
export type BurnRateResult = {
  burnRate: number; runwayMonths: number; isProfitable: boolean;
  monthsToProfit: number | null; advice: string;
};

export function calculateBurnRate(input: BurnRateInput): BurnRateResult {
  const burnRate = input.monthlyExpenses - input.monthlyRevenue;
  const runwayMonths = burnRate <= 0 ? 999 : Math.floor(input.currentCash / burnRate);
  const isProfitable = input.monthlyRevenue >= input.monthlyExpenses;
  const monthsToProfit = isProfitable ? 0 : burnRate <= 0 ? 0 : Math.ceil(input.currentCash / burnRate);

  let advice: string;
  if (isProfitable) advice = "You are profitable. Focus on growth — your runway is infinite.";
  else if (runwayMonths >= 18) advice = `${runwayMonths} months of runway is healthy. Focus on growth and reaching product-market fit.`;
  else if (runwayMonths >= 12) advice = `${runwayMonths} months of runway. Start planning your next fundraising round or path to revenue.`;
  else if (runwayMonths >= 6) advice = `${runwayMonths} months of runway. Reduce burn or generate revenue urgently. Consider part-time consulting.`;
  else advice = `${runwayMonths} months of runway — critical. Cut expenses immediately or raise a bridge round.`;

  return { burnRate: Math.max(0, burnRate), runwayMonths, isProfitable, monthsToProfit: isProfitable ? 0 : monthsToProfit, advice };
}

/* ────────── 5. Pricing Strategy Tool ────────── */

export type PricingInput = {
  targetMarket: string; competitorPriceLow: number; competitorPriceHigh: number;
  monthlyOperatingCost: number; targetMargin: number;
};
export type PricingTier = { name: string; price: number; features: string[]; recommended: boolean };
export type PricingResult = { tiers: PricingTier[]; analysis: string[] };

export function generatePricing(input: PricingInput): PricingResult {
  const mid = Math.round((input.competitorPriceLow + input.competitorPriceHigh) / 2);
  const baseline = Math.max(mid, Math.round(input.monthlyOperatingCost / 100 * (1 + input.targetMargin / 100)));
  const tiers: PricingTier[] = [
    { name: "Starter", price: Math.round(baseline * 0.6), features: ["Core features", "Up to 100 users", "Email support", "Community access"], recommended: false },
    { name: "Pro", price: Math.round(baseline), features: ["All Starter features", "Unlimited users", "Priority support", "API access", "Integrations"], recommended: true },
    { name: "Enterprise", price: Math.round(baseline * 2.5), features: ["All Pro features", "Dedicated support", "Custom integrations", "SLA", "On-premise option"], recommended: false },
  ];

  const analysis = [
    `Competitor range: $${input.competitorPriceLow}–$${input.competitorPriceHigh}/mo`,
    `Your breakeven per customer: ~$${Math.round(input.monthlyOperatingCost / 100)}/mo (at 100 customers)`,
    `Pro tier at $${tiers[1].price}/mo positions you ${tiers[1].price > mid ? "above" : "below"} market median`,
    `At 100 customers, monthly revenue: $${(100 * tiers[1].price).toLocaleString()}`,
  ];

  return { tiers, analysis };
}

/* ────────── 6. Startup Cost Estimator ────────── */

export type CostInput = { ideaType: string; teamSize: number; months: number };
export type CostCategory = { category: string; items: { label: string; cost: number }[]; total: number };
export type CostResult = { total: number; categories: CostCategory[]; breakdown: string[] };

const costProfiles: Record<string, Record<string, number>> = {
  saas: { hosting: 150, tools: 200, payroll: 8000, legal: 500, marketing: 1000, misc: 300 },
  marketplace: { hosting: 300, tools: 150, payroll: 10000, legal: 1000, marketing: 1500, misc: 400 },
  ai: { hosting: 500, tools: 300, payroll: 12000, legal: 500, marketing: 800, misc: 500 },
  mobile: { hosting: 100, tools: 200, payroll: 9000, legal: 500, marketing: 1200, misc: 300 },
  ecommerce: { hosting: 200, tools: 150, payroll: 7000, legal: 800, marketing: 2000, misc: 400 },
};

export function estimateCosts(input: CostInput): CostResult {
  const profileKey = Object.keys(costProfiles).find((k) => input.ideaType.toLowerCase().includes(k)) || "saas";
  const profile = costProfiles[profileKey];

  const monthlyTotal = Object.entries(profile).reduce((sum, [k, v]) => {
    if (k === "payroll") return sum + v * Math.max(1, input.teamSize) / 1;
    return sum + v;
  }, 0);

  const grandTotal = monthlyTotal * input.months;

  const categories: CostCategory[] = [
    {
      category: "Infrastructure", items: [
        { label: "Hosting & Cloud", cost: profile.hosting * input.months },
        { label: "Tools & Subscriptions", cost: profile.tools * input.months },
      ], total: (profile.hosting + profile.tools) * input.months,
    },
    {
      category: "Team", items: [
        { label: `Payroll (${input.teamSize} ${input.teamSize === 1 ? "person" : "people"})`, cost: profile.payroll * input.teamSize * input.months },
      ], total: profile.payroll * input.teamSize * input.months,
    },
    {
      category: "Operations", items: [
        { label: "Legal & Accounting", cost: profile.legal * input.months },
        { label: "Marketing", cost: profile.marketing * input.months },
        { label: "Miscellaneous", cost: profile.misc * input.months },
      ], total: (profile.legal + profile.marketing + profile.misc) * input.months,
    },
  ];

  return {
    total: grandTotal,
    categories,
    breakdown: [
      `Estimated monthly burn: ~$${Math.round(monthlyTotal).toLocaleString()}`,
      `Total over ${input.months} month${input.months > 1 ? "s" : ""}: ~$${Math.round(grandTotal).toLocaleString()}`,
      `Biggest cost driver: ${input.teamSize > 1 ? "Team payroll" : "Your time (payroll)"}`,
      `Recommended runway: ${input.months + 6} months (add 6 months buffer)`,
    ],
  };
}

/* ────────── 7. Go-to-Market Playbook ────────── */

export type GtmInput = { idea: string; targetCustomer: string };
export type GtmChannel = { channel: string; effort: "Low" | "Medium" | "High"; expectedImpact: "Low" | "Medium" | "High"; tactics: string[] };
export type GtmResult = { channels: GtmChannel[]; recommendation: string };

export function generateGtmPlaybook(input: GtmInput): GtmResult {
  const lower = (input.idea + " " + input.targetCustomer).toLowerCase();
  const isB2b = ["saas", "b2b", "enterprise", "business", "company", "team", "workplace"].some((w) => lower.includes(w));
  const isB2c = ["consumer", "b2c", "mobile", "app", "personal"].some((w) => lower.includes(w));

  const channels: GtmChannel[] = [
    {
      channel: "Content Marketing",
      effort: "High",
      expectedImpact: isB2b ? "High" : "Medium",
      tactics: isB2b
        ? ["Write LinkedIn thought leadership posts", "Publish case studies with early users", "Create comparison guides vs competitors"]
        : ["Start a TikTok/IG sharing tips related to your niche", "Write blog posts ranking for long-tail keywords", "Create free templates/tools as lead magnets"],
    },
    {
      channel: "Community & Events",
      effort: "Medium",
      expectedImpact: "High",
      tactics: isB2b
        ? ["Join Slack/Discord communities in your niche", "Speak at industry meetups (virtual or local)", "Run a free workshop or webinar"]
        : ["Post in Reddit/niche forums daily", "Host Twitter Spaces or live Q&As", "Collaborate with micro-influencers"],
    },
    {
      channel: "Cold Outreach",
      effort: "High",
      expectedImpact: isB2b ? "High" : "Low",
      tactics: isB2b
        ? ["Send 20 personalized emails/day to ideal customer profiles", "Follow up on LinkedIn with value-first messages", "Offer free audits or consultations"]
        : ["Direct message power users on social platforms", "Comment on popular posts in your niche", "Offer beta access in exchange for feedback"],
    },
    {
      channel: "Paid Acquisition",
      effort: "Medium",
      expectedImpact: "Medium",
      tactics: isB2b
        ? ["LinkedIn ads targeting specific job titles", "Google Ads on high-intent keywords", "Sponsor industry newsletters"]
        : ["Meta/Instagram ads with video creative", "TikTok Spark ads with creators", "Apple Search Ads if mobile app"],
    },
    {
      channel: "Direct Sales",
      effort: "High",
      expectedImpact: isB2b ? "High" : "Low",
      tactics: isB2b
        ? ["Book demos with decision-makers", "Offer a limited-time founder discount", "Build relationships with champions inside target companies"]
        : ["Set up a Stripe payment link and test pricing", "Offer lifetime deal to first 100 users", "Run a pre-sale campaign"],
    },
  ];

  const primary = isB2b ? "Direct Sales" : "Community & Events";
  const recommendation = `Start with ${isB2b ? "outbound" : "community-driven"} channels. Focus on ${primary} and Content Marketing in the first 30 days. Choose 2 channels, go deep, measure CAC before scaling.`;

  return { channels, recommendation };
}

/* ────────── 8. Feature Prioritization Matrix ────────── */

export type FeatureInput = { features: { name: string; impact: number; effort: number }[] };
export type ScoredFeature = { name: string; impact: number; effort: number; score: number; priority: "Now" | "Next" | "Later" };
export type PrioritizationResult = { features: ScoredFeature[] };

export function prioritizeFeatures(input: FeatureInput): PrioritizationResult {
  const scored = input.features.map((f) => {
    const score = f.effort > 0 ? f.impact / f.effort : 10;
    const priority: ScoredFeature["priority"] = score >= 3 ? "Now" : score >= 1.5 ? "Next" : "Later";
    return { ...f, score: Math.round(score * 10) / 10, priority };
  });
  scored.sort((a, b) => b.score - a.score);
  return { features: scored };
}

/* ────────── 9. Idea Comparison ────────── */

export type ComparisonInput = { ideas: string[] };
export type ComparisonResult = { reports: AnalysisReport[] };

export function compareIdeas(input: ComparisonInput): ComparisonResult {
  const reports = input.ideas.filter((i) => i.trim().length >= 12).map((idea) => generateReport(idea));
  return { reports };
}

/* ────────── 10. Founder Fit Assessment ────────── */

export type FounderFitInput = {
  skills: string; experience: string; network: string;
  riskTolerance: "Low" | "Medium" | "High"; industryDomain: string;
  ideaType: string;
};
export type FounderFitResult = {
  overallScore: number; overallLabel: string;
  dimensions: { label: string; score: number; detail: string }[];
  gaps: string[];
  recommendation: string;
};

export function assessFounderFit(input: FounderFitInput): FounderFitResult {
  const skillKeywords = input.skills.toLowerCase();
  const domainKeywords = input.industryDomain.toLowerCase();
  const ideaLower = input.ideaType.toLowerCase();

  const hasTech = ["code", "developer", "engineer", "technical", "software", "full-stack", "backend", "frontend"].some((w) => skillKeywords.includes(w));
  const hasDomain = domainKeywords.length > 0 && ideaLower.includes(domainKeywords);
  const hasSales = ["sales", "marketing", "growth", "business development", "bd", "partnership"].some((w) => skillKeywords.includes(w));
  const hasNetwork = input.network.length > 20;

  const dimensions = [
    { label: "Technical Ability", score: hasTech ? 8 : 3, detail: hasTech ? "You can build — a major advantage for solo founders." : "Consider a technical co-founder or no-code tools." },
    { label: "Domain Expertise", score: hasDomain ? 8 : 4, detail: hasDomain ? "Deep domain knowledge reduces learning curve." : "You&apos;ll need extra time to learn the industry." },
    { label: "Go-to-Market Fit", score: hasSales ? 7 : 4, detail: hasSales ? "Sales/marketing experience helps you find early customers." : "Distribution will be your biggest challenge." },
    { label: "Network Strength", score: hasNetwork ? 7 : 3, detail: hasNetwork ? "Strong network for early adopter access." : "Build your network before or during building." },
    { label: "Risk Alignment", score: input.riskTolerance === "High" ? 8 : input.riskTolerance === "Medium" ? 5 : 3, detail: input.riskTolerance === "High" ? "Comfortable with uncertainty — essential for startups." : "Consider a side project approach to reduce risk." },
    { label: "Experience Level", score: input.experience.length > 30 ? 7 : 4, detail: input.experience.length > 30 ? "Relevant experience signals founder-market fit." : "Consider starting with a smaller, lower-risk idea." },
  ];

  const overallScore = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length * 10) / 10;
  const overallLabel = overallScore >= 7 ? "Strong Fit" : overallScore >= 4 ? "Moderate Fit" : "Stretch";

  const gaps: string[] = [];
  if (!hasTech) gaps.push("Technical skills — learn to build or find a technical co-founder");
  if (!hasDomain) gaps.push("Domain knowledge — spend 2 weeks immersed in the industry");
  if (!hasSales) gaps.push("Sales & marketing skills — your biggest risk after building");
  if (!hasNetwork) gaps.push("Professional network — start attending events and engaging online");

  let recommendation: string;
  if (overallScore >= 7) recommendation = "Strong founder-idea fit. Your background aligns well with what this idea demands. Focus on execution.";
  else if (overallScore >= 5) recommendation = "Moderate fit. Address your key gaps before going full-time. Consider a co-founder who complements your weaknesses.";
  else recommendation = "This idea stretches beyond your current profile. Choose a simpler idea that better matches your skills, or partner with someone who fills the gaps.";

  return { overallScore, overallLabel, dimensions, gaps, recommendation };
}
