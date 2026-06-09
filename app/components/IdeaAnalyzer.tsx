"use client";

import { BarChart3, FileText, Loader2, Search } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { analyzeIdea } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { AnalysisReport } from "../lib/types";
import { ReportView } from "./ReportView";

const ideaExamples = [
  "AI expense tracker for freelancers",
  "Marketplace for local tutors",
  "App that converts YouTube videos into flashcards",
  "SaaS platform for React Native release management"
];

export function IdeaAnalyzer() {
  const [idea, setIdea] = useState("");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState("");
  const [shouldScrollToReport, setShouldScrollToReport] = useState(false);
  const [isPending, startTransition] = useTransition();
  const characterCount = idea.trim().length;

  useEffect(() => {
    if (!shouldScrollToReport || !report) {
      return;
    }

    document.getElementById("analysis")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    setShouldScrollToReport(false);
  }, [report, shouldScrollToReport]);

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
      setShouldScrollToReport(true);
      trackEvent("report_generation", {
        decision: result.report.decision,
        score: result.report.score
      });
    });
  }

  function selectExample(example: string) {
    setIdea(example);
    setReport(null);
    setError("");
    trackEvent("conversion_event", {
      action: "idea_example_selected",
      example
    });
  }

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground">
            <BarChart3 className="size-4" aria-hidden="true" />
            Startup due diligence for builders
          </div>
          <h1 className="mx-auto max-w-2xl text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">
            Stop building products nobody wants.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-6 text-muted">
            Get an objective evaluation of your startup idea before investing months into development.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <label htmlFor="idea" className="text-[13px] font-semibold uppercase text-muted">
                Idea Input
              </label>
            </div>
            <span className="text-[13px] font-medium text-muted">{characterCount}/1600</span>
          </div>

          <textarea
            id="idea"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="Describe your startup idea..."
            maxLength={1600}
            rows={6}
            className="mt-4 min-h-40 w-full resize-y rounded-lg border border-border bg-surface p-4 text-[15px] leading-6 text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white"
          />

          <div className="mt-3 flex min-w-0 flex-wrap gap-2">
            {ideaExamples.map((example) => (
              <button
                type="button"
                key={example}
                onClick={() => selectExample(example)}
                className="min-w-0 max-w-full truncate rounded-full border border-border bg-white px-3 py-1.5 text-[13px] font-medium text-muted transition hover:border-foreground hover:bg-gray-100 hover:text-foreground"
                title={example}
              >
                {example}
              </button>
            ))}
          </div>

          {error ? <p className="mt-3 text-[13px] font-medium text-danger">{error}</p> : null}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:bg-muted/40 sm:w-auto"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Search className="size-4" aria-hidden="true" />}
              Analyze Idea
            </button>
          </div>
        </form>

        <div id="analysis" className="mt-6 min-w-0 scroll-mt-20">
          {report ? (
            <ReportView report={report} />
          ) : (
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase text-muted">Analysis Preview</p>
                  <h2 className="mt-2 text-[24px] font-bold text-foreground">Structured founder report</h2>
                  <p className="mt-2 max-w-2xl text-[15px] leading-6 text-muted">
                    One decision score, six evaluation dimensions, and a practical recommendation.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface px-4 py-3 text-right">
                  <div className="text-[32px] font-bold text-muted/40">-- / 100</div>
                  <div className="text-[13px] font-medium text-muted">Awaiting idea</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {["Market Demand", "Competition", "Monetization", "Execution Difficulty", "Distribution Difficulty", "Founder Advantage"].map((metric, index) => (
                  <div key={metric} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-muted">{metric}</span>
                      <span className="text-[13px] font-semibold text-muted/60">0/10</span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-border">
                      <div className="h-2 rounded-full bg-foreground/30" style={{ width: `${18 + index * 9}%` }} />
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
                  <div key={title} className="rounded-xl border border-border bg-white p-4">
                    <FileText className="mb-3 size-4 text-muted" aria-hidden="true" />
                    <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-muted">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
