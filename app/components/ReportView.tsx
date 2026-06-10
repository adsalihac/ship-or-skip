"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCopy,
  Gauge,
  LineChart,
  Rocket,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import type { AnalysisReport, Decision } from "../lib/types";
import { trackEvent } from "../lib/analytics-client";

type ReportViewProps = {
  report: AnalysisReport;
  compact?: boolean;
};

const decisionStyles: Record<Decision, string> = {
  SHIP: "border-success-border bg-success-light text-success",
  "VALIDATE MORE": "border-accent-border bg-accent-light text-accent-dark",
  SKIP: "border-danger-border bg-danger-light text-danger"
};

const decisionCopy: Record<Decision, string> = {
  SHIP: "Build a narrow MVP",
  "VALIDATE MORE": "Validate before building",
  SKIP: "Do not build yet"
};

const sectionIcons: Record<string, typeof Target> = {
  "Market Demand": TrendingUp,
  "Competition Analysis": ShieldCheck,
  "Monetization Analysis": BarChart3,
  "Build Complexity": Gauge,
  "Distribution Analysis": Target,
  "Growth Potential": Rocket,
  "Timeline Fit": Sparkles
};

function getScoreTone(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 55) return "text-accent-dark";
  return "text-danger";
}

async function copyReport(report: AnalysisReport) {
  await navigator.clipboard.writeText(report.shareText);
  trackEvent("share_action", {
    action: "copy_result",
    decision: report.decision,
    score: report.score
  });
}

async function shareReport(report: AnalysisReport) {
  trackEvent("share_action", {
    action: "share_result",
    decision: report.decision,
    score: report.score
  });

  if (navigator.share) {
    await navigator.share({
      title: "ShipOrSkip result",
      text: report.shareText,
      url: "https://shiporskip.com"
    });
    return;
  }

  await navigator.clipboard.writeText(report.shareText);
}

export function ReportView({ report, compact = false }: ReportViewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-semibold ${decisionStyles[report.decision]}`}>
                {report.decision}
              </span>
              <span className="text-[13px] font-medium text-muted">{decisionCopy[report.decision]}</span>
            </div>
            <h2 className="text-[24px] font-bold text-foreground">Decision Report</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-border bg-surface px-5 py-4 text-left sm:text-right">
            <div className={`text-[32px] font-bold ${getScoreTone(report.score)}`}>{report.score} / 100</div>
            <div className="text-[13px] font-medium text-muted">Founder decision score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {report.metrics.map((metric) => (
          <div key={metric.name} className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold text-foreground">{metric.name}</h3>
                <p className="mt-0.5 text-[12px] font-medium text-muted">{metric.label}</p>
              </div>
              <span className="text-[18px] font-bold text-foreground">{metric.score}/10</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-foreground"
                style={{ width: `${metric.score * 10}%` }}
              />
            </div>
            {!compact ? <p className="mt-2 text-[12px] leading-5 text-muted">{metric.rationale}</p> : null}
          </div>
        ))}
      </div>

      {!compact ? (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {Object.values(report.sections).map((section) => {
              const Icon = sectionIcons[section.title as keyof typeof sectionIcons] ?? LineChart;

              return (
                <section key={section.title} className="rounded-xl border border-border bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                      <Icon className="size-4 text-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-bold text-foreground">{section.title}</h3>
                        <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-muted">
                          {section.verdict}
                        </span>
                      </div>
                      <p className="mt-1 text-[14px] leading-6 text-muted">{section.rationale}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-[13px] leading-5 text-muted">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="size-4 text-accent" aria-hidden="true" />
                <h3 className="text-[15px] font-bold text-foreground">Key Risks</h3>
              </div>
              <ol className="space-y-3">
                {report.risks.map((risk, index) => (
                  <li key={risk} className="flex gap-3 text-[13px] leading-5 text-muted">
                    <span className="font-semibold text-foreground">{index + 1}</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-4 text-success" aria-hidden="true" />
                <h3 className="text-[15px] font-bold text-foreground">Key Opportunities</h3>
              </div>
              <ol className="space-y-3">
                {report.opportunities.map((opportunity, index) => (
                  <li key={opportunity} className="flex gap-3 text-[13px] leading-5 text-muted">
                    <span className="font-semibold text-foreground">{index + 1}</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardCopy className="size-4 text-foreground" aria-hidden="true" />
                <h3 className="text-[15px] font-bold text-foreground">Founder Recommendation</h3>
              </div>
              <ol className="space-y-3">
                {report.recommendation.map((item, index) => (
                  <li key={item} className="flex gap-3 text-[13px] leading-5 text-muted">
                    <span className="font-semibold text-foreground">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-medium text-muted">{report.shareText.split("\n")[0]}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void copyReport(report)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-[13px] font-semibold text-foreground shadow-sm transition hover:bg-surface"
              >
                <ClipboardCopy className="size-4" aria-hidden="true" />
                Copy Result
              </button>
              <button
                type="button"
                onClick={() => void shareReport(report)}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                <Share2 className="size-4" aria-hidden="true" />
                Share Result
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
