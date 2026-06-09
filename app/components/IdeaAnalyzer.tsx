"use client";

import { ArrowRight, BarChart3, FileText, Loader2, Search, Target } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { analyzeIdea } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { AnalysisReport } from "../lib/types";
import { ReportView } from "./ReportView";

type IdeaAnalyzerProps = {
  exampleReports: AnalysisReport[];
};

const placeholders = [
  "AI expense tracker for freelancers",
  "Marketplace for local tutors",
  "App that converts YouTube videos into flashcards",
  "SaaS platform for React Native release management"
];

export function IdeaAnalyzer({ exampleReports }: IdeaAnalyzerProps) {
  const [idea, setIdea] = useState("");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const characterCount = idea.trim().length;
  const currentPlaceholder = useMemo(() => placeholders[0], []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      trackEvent("idea_submission", {
        idea_length: idea.length
      });

      const result = await analyzeIdea(idea);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setReport(result.report);
      trackEvent("report_generation", {
        decision: result.report.decision,
        score: result.report.score
      });
    });
  }

  function loadExample(exampleReport: AnalysisReport) {
    setIdea(exampleReport.idea);
    setReport(exampleReport);
    setError("");
    trackEvent("conversion_event", {
      action: "example_report_preview",
      example: exampleReport.idea,
      decision: exampleReport.decision,
      score: exampleReport.score
    });
  }

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-600">
              <BarChart3 className="size-4 text-gray-700" aria-hidden="true" />
              Startup due diligence for builders
            </div>
            <h1 className="max-w-2xl text-[40px] font-semibold leading-[1.05] text-gray-950 md:text-[48px]">
              Stop building products nobody wants.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-6 text-gray-600">
              Get an objective evaluation of your startup idea before investing months into development.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <label htmlFor="idea" className="text-[13px] font-semibold uppercase text-gray-500">
                Idea Input
              </label>
              <span className="text-[13px] font-medium text-gray-500">{characterCount}/1600</span>
            </div>
            <textarea
              id="idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder={`Describe your startup idea... e.g. ${currentPlaceholder}`}
              rows={8}
              className="mt-4 min-h-48 w-full resize-none rounded-[8px] border border-gray-200 bg-gray-50 p-4 text-[15px] leading-6 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
            {error ? <p className="mt-3 text-[13px] font-medium text-red-600">{error}</p> : null}
            <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-wrap gap-2 pb-1 xl:flex-nowrap xl:overflow-hidden xl:pb-0">
                {placeholders.slice(1).map((sample) => (
                  <button
                    type="button"
                    key={sample}
                    onClick={() => setIdea(sample)}
                    className="min-w-0 max-w-full truncate rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50 xl:max-w-[230px] xl:shrink-0"
                    title={sample}
                  >
                    {sample}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-gray-950 px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Search className="size-4" aria-hidden="true" />}
                Analyze Idea
              </button>
            </div>
          </form>
        </div>

        <div id="analysis" className="mt-6 min-w-0">
          {report ? (
            <ReportView report={report} />
          ) : (
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase text-gray-500">Analysis Preview</p>
                  <h2 className="mt-2 text-[24px] font-semibold text-gray-950">Structured founder report</h2>
                  <p className="mt-2 max-w-2xl text-[15px] leading-6 text-gray-600">
                    One decision score, six evaluation dimensions, and a practical recommendation.
                  </p>
                </div>
                <div className="rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3 text-right">
                  <div className="text-[32px] font-semibold text-gray-300">-- / 100</div>
                  <div className="text-[13px] font-medium text-gray-500">Awaiting idea</div>
                </div>
              </div>

              <div className="mt-6 grid report-grid gap-3">
                {["Market Demand", "Competition", "Monetization", "Execution Difficulty", "Distribution Difficulty", "Founder Advantage"].map((metric, index) => (
                  <div key={metric} className="rounded-[12px] border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-gray-700">{metric}</span>
                      <span className="text-[13px] font-semibold text-gray-400">0/10</span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-gray-300" style={{ width: `${18 + index * 9}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ["Key Risks", "Three biggest risks before build"],
                  ["Key Opportunities", "Three strongest market openings"],
                  ["Founder Recommendation", "Concrete next action"]
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-[12px] border border-gray-200 bg-white p-4">
                    <FileText className="mb-3 size-4 text-gray-500" aria-hidden="true" />
                    <h3 className="text-[15px] font-semibold text-gray-950">{title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-gray-600">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Step 1", "Describe your idea.", "Start with the customer, pain, and product concept."],
            ["Step 2", "Evaluate the fundamentals.", "ShipOrSkip scores market, competition, monetization, execution, and distribution."],
            ["Step 3", "Receive the decision report.", "Use the verdict to ship, validate more, or skip with confidence."]
          ].map(([step, title, copy]) => (
            <div key={step} className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-gray-500">{step}</p>
              <h2 className="mt-3 text-[18px] font-semibold text-gray-950">{title}</h2>
              <p className="mt-2 text-[13px] leading-5 text-gray-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="examples" className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase text-gray-500">Example Reports</p>
            <h2 className="mt-2 text-[24px] font-semibold text-gray-950">Preview report quality</h2>
          </div>
          <p className="max-w-lg text-[13px] leading-5 text-gray-600">
            Sample assessments show how different startup categories score across the same framework.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {exampleReports.map((exampleReport) => (
            <article key={exampleReport.id} className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-semibold text-gray-950">{exampleReport.idea}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-gray-600">{exampleReport.summary}</p>
                </div>
                <span className="shrink-0 text-[24px] font-semibold text-gray-950">{exampleReport.score}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[13px] font-semibold text-gray-700">
                  {exampleReport.decision}
                </span>
                <button
                  type="button"
                  onClick={() => loadExample(exampleReport)}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-950 transition hover:bg-gray-50"
                >
                  Preview
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-10 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-[13px] font-semibold uppercase text-gray-500">About</p>
            <h2 className="mt-2 text-[24px] font-semibold text-gray-950">Built for pre-build due diligence</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["One Input", "Describe the idea once with enough context to evaluate."],
              ["One Analysis", "Review a consistent framework instead of a conversational answer."],
              ["One Decision", "Leave with a build, validate, or skip recommendation."],
              ["Low Overhead", "No accounts, database, or dashboard required for the MVP."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex size-9 items-center justify-center rounded-[8px] border border-gray-200 bg-gray-50">
                  <Target className="size-4 text-gray-700" aria-hidden="true" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-950">{title}</h3>
                <p className="mt-1 text-[13px] leading-5 text-gray-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
