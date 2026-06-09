"use server";

import { generateReport } from "./lib/analysis";
import {
  generateMvpReport,
  generateCompetitorReport,
  generateMvpReport as generateMvp,
  generateCompetitorReport as generateCompetitor,
} from "./lib/solo-founders";
import { analyzeTrend, generateGtmPlaybook } from "./lib/founder-tools";
import type { AnalyzeResult, MvpResultType, CompetitorResultType } from "./lib/types";
import type { MvpInput, CompetitorInput } from "./lib/solo-founders";
import type { TrendInput, GtmInput } from "./lib/founder-tools";

export async function analyzeIdea(idea: string): Promise<AnalyzeResult> {
  const trimmedIdea = idea.trim();

  if (trimmedIdea.length < 12) {
    return {
      ok: false,
      error: "Describe the idea in at least a sentence so the assessment has enough signal."
    };
  }

  if (trimmedIdea.length > 1600) {
    return {
      ok: false,
      error: "Keep the idea under 1,600 characters for this MVP assessment."
    };
  }

  return {
    ok: true,
    report: generateReport(trimmedIdea)
  };
}

export async function assessMvp(input: MvpInput): Promise<MvpResultType> {
  const trimmedIdea = input.idea.trim();

  if (trimmedIdea.length < 12) {
    return {
      ok: false,
      error: "Describe your idea in at least a sentence so the assessment has enough signal."
    };
  }

  if (trimmedIdea.length > 1600) {
    return {
      ok: false,
      error: "Keep the description under 1,600 characters."
    };
  }

  return {
    ok: true,
    report: generateMvp({ idea: trimmedIdea })
  };
}

export async function assessTrend(input: TrendInput) {
  const trimmed = input.trend.trim();
  if (trimmed.length < 10) return { ok: false as const, error: "Describe the trend in more detail (at least 10 characters)." };
  return { ok: true as const, report: analyzeTrend({ trend: trimmed }) };
}

export async function generateGtm(input: GtmInput) {
  const idea = input.idea.trim();
  const customer = input.targetCustomer.trim();
  if (idea.length < 10) return { ok: false as const, error: "Describe your idea in at least a sentence." };
  if (customer.length < 3) return { ok: false as const, error: "Describe your target customer briefly." };
  return { ok: true as const, report: generateGtmPlaybook({ idea, targetCustomer: customer }) };
}

export async function assessCompetitors(input: CompetitorInput): Promise<CompetitorResultType> {
  const trimmedNiche = input.niche.trim();

  if (trimmedNiche.length < 2) {
    return {
      ok: false,
      error: "Enter the niche or category your idea operates in."
    };
  }

  const competitors = [input.name1, input.name2, input.name3].filter((n) => n.trim().length > 0);
  if (competitors.length < 1) {
    return {
      ok: false,
      error: "Enter at least one competitor name."
    };
  }

  return {
    ok: true,
    report: generateCompetitor({
      name1: input.name1.trim(),
      name2: input.name2.trim(),
      name3: input.name3.trim(),
      niche: trimmedNiche,
    })
  };
}
