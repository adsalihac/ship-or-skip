"use server";

import { generateReport } from "./lib/analysis";
import type { AnalyzeResult } from "./lib/types";

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
