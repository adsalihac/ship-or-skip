export type Decision = "SHIP" | "VALIDATE MORE" | "SKIP";

export type SignalLevel = "Low" | "Medium" | "High";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type MonetizationLevel = "Easy" | "Moderate" | "Difficult";

export type ScoreMetric = {
  name: string;
  score: number;
  label: string;
  rationale: string;
};

export type AnalysisSection = {
  title: string;
  verdict: SignalLevel | DifficultyLevel | MonetizationLevel;
  rationale: string;
  bullets: string[];
};

export type AnalysisReport = {
  id: string;
  idea: string;
  decision: Decision;
  score: number;
  summary: string;
  metrics: ScoreMetric[];
  sections: {
    marketDemand: AnalysisSection;
    competition: AnalysisSection;
    monetization: AnalysisSection;
    buildComplexity: AnalysisSection;
    distribution: AnalysisSection;
  };
  risks: string[];
  opportunities: string[];
  recommendation: string[];
  shareText: string;
};

export type AnalyzeResult =
  | {
      ok: true;
      report: AnalysisReport;
    }
  | {
      ok: false;
      error: string;
    };

export type MvpResultType =
  | { ok: true; report: import("./solo-founders").MvpResult }
  | { ok: false; error: string };

export type CompetitorResultType =
  | { ok: true; report: import("./solo-founders").CompetitorResult }
  | { ok: false; error: string };
