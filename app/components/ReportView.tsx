"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCopy,
  Gauge,
  LineChart,
  Share2,
  ShieldCheck,
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
  SHIP: "border-green-200 bg-green-50 text-green-700",
  "VALIDATE MORE": "border-amber-200 bg-amber-50 text-amber-700",
  SKIP: "border-red-200 bg-red-50 text-red-700"
};

const decisionCopy: Record<Decision, string> = {
  SHIP: "Build a narrow MVP",
  "VALIDATE MORE": "Validate before building",
  SKIP: "Do not build yet"
};

const sectionIcons = {
  "Market Demand": TrendingUp,
  "Competition Analysis": ShieldCheck,
  "Monetization Analysis": BarChart3,
  "Build Complexity": Gauge,
  "Distribution Analysis": Target
};

function getScoreTone(score: number) {
  if (score >= 75) return "text-green-700";
  if (score >= 55) return "text-amber-700";
  return "text-red-700";
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
      <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-semibold ${decisionStyles[report.decision]}`}>
                {report.decision}
              </span>
              <span className="text-[13px] font-medium text-gray-500">{decisionCopy[report.decision]}</span>
            </div>
            <h2 className="text-[24px] font-semibold text-gray-950">Decision Report</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-6 text-gray-600">{report.summary}</p>
          </div>
          <div className="shrink-0 rounded-[12px] border border-gray-200 bg-gray-50 px-5 py-4 text-left sm:text-right">
            <div className={`text-[32px] font-semibold ${getScoreTone(report.score)}`}>{report.score} / 100</div>
            <div className="text-[13px] font-medium text-gray-500">Founder decision score</div>
          </div>
        </div>
      </div>

      <div className="grid report-grid gap-3">
        {report.metrics.map((metric) => (
          <div key={metric.name} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-950">{metric.name}</h3>
                <p className="mt-1 text-[13px] font-medium text-gray-500">{metric.label}</p>
              </div>
              <span className="text-[18px] font-semibold text-gray-950">{metric.score}/10</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-950"
                style={{ width: `${metric.score * 10}%` }}
              />
            </div>
            {!compact ? <p className="mt-3 text-[13px] leading-5 text-gray-600">{metric.rationale}</p> : null}
          </div>
        ))}
      </div>

      {!compact ? (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {Object.values(report.sections).map((section) => {
              const Icon = sectionIcons[section.title as keyof typeof sectionIcons] ?? LineChart;

              return (
                <section key={section.title} className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-gray-200 bg-gray-50">
                      <Icon className="size-4 text-gray-700" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-semibold text-gray-950">{section.title}</h3>
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[13px] font-medium text-gray-700">
                          {section.verdict}
                        </span>
                      </div>
                      <p className="mt-2 text-[15px] leading-6 text-gray-600">{section.rationale}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-[13px] leading-5 text-gray-600">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <section className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-700" aria-hidden="true" />
                <h3 className="text-[18px] font-semibold text-gray-950">Key Risks</h3>
              </div>
              <ol className="space-y-3">
                {report.risks.map((risk, index) => (
                  <li key={risk} className="flex gap-3 text-[13px] leading-5 text-gray-600">
                    <span className="font-semibold text-gray-950">{index + 1}</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-4 text-green-700" aria-hidden="true" />
                <h3 className="text-[18px] font-semibold text-gray-950">Key Opportunities</h3>
              </div>
              <ol className="space-y-3">
                {report.opportunities.map((opportunity, index) => (
                  <li key={opportunity} className="flex gap-3 text-[13px] leading-5 text-gray-600">
                    <span className="font-semibold text-gray-950">{index + 1}</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardCopy className="size-4 text-gray-700" aria-hidden="true" />
                <h3 className="text-[18px] font-semibold text-gray-950">Founder Recommendation</h3>
              </div>
              <ol className="space-y-3">
                {report.recommendation.map((item, index) => (
                  <li key={item} className="flex gap-3 text-[13px] leading-5 text-gray-600">
                    <span className="font-semibold text-gray-950">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="flex flex-col gap-3 rounded-[12px] border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-medium text-gray-600">{report.shareText.split("\n")[0]}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void copyReport(report)}
                className="inline-flex items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-950 transition hover:bg-gray-50"
              >
                <ClipboardCopy className="size-4" aria-hidden="true" />
                Copy Result
              </button>
              <button
                type="button"
                onClick={() => void shareReport(report)}
                className="inline-flex items-center gap-2 rounded-[8px] bg-gray-950 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-gray-800"
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
