"use client";

import { Hammer, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { assessMvp } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { MvpResult } from "../lib/solo-founders";

const exampleIdeas = [
  "AI expense tracker for freelancers",
  "Marketplace for local tutors",
  "SaaS dashboard for social media analytics",
  "Video course platform for creators",
];

function difficultyColor(score: number): string {
  if (score <= 3) return "text-green-600";
  if (score <= 6) return "text-amber-600";
  return "text-red-600";
}

function difficultyBg(score: number): string {
  if (score <= 3) return "bg-green-50 border-green-200";
  if (score <= 6) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export function MvpCalculator() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<MvpResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      trackEvent("mvp_calculator_submission", { idea_length: idea.length });

      const res = await assessMvp({ idea });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setResult(res.report);
      trackEvent("mvp_calculator_result", {
        difficulty: res.report.difficultyScore,
      });
    });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-600">
        <Hammer className="size-4 text-gray-700" aria-hidden="true" />
        Scope your build
      </div>

      <h1 className="text-[40px] font-semibold leading-[1.05] text-gray-950 md:text-[48px]">
        MVP Scope Calculator
      </h1>
      <p className="mt-4 text-[15px] leading-6 text-gray-600">
        What&apos;s the smallest thing you can build in 2 weeks? Describe your idea and get a
        tailored scoping recommendation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <span className="text-[13px] font-semibold uppercase text-gray-500">Describe Your Idea</span>
        </div>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe what you want to build..."
          rows={5}
          className="mt-4 min-h-32 w-full resize-y rounded-[8px] border border-gray-200 bg-gray-50 p-4 text-[15px] leading-6 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
        />

        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          {exampleIdeas.map((example) => (
            <button
              type="button"
              key={example}
              onClick={() => {
                setIdea(example);
                setResult(null);
                setError("");
              }}
              className="min-w-0 max-w-full truncate rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
            >
              {example}
            </button>
          ))}
        </div>

        {error && <p className="mt-3 text-[13px] font-medium text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-gray-950 px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400 sm:w-auto"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Hammer className="size-4" aria-hidden="true" />
            )}
            Scope MVP
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase text-gray-500">Execution Difficulty</p>
                <p className={`mt-1 text-[32px] font-semibold ${difficultyColor(result.difficultyScore)}`}>
                  {result.difficultyScore}/10
                </p>
              </div>
              <div className={`rounded-[8px] border px-3 py-1.5 ${difficultyBg(result.difficultyScore)}`}>
                <span className={`text-[13px] font-semibold ${difficultyColor(result.difficultyScore)}`}>
                  {result.difficultyLabel}
                </span>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${
                  result.difficultyScore <= 3
                    ? "bg-green-500"
                    : result.difficultyScore <= 6
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${result.difficultyScore * 10}%` }}
              />
            </div>
          </div>

          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase text-gray-500">Time Estimate</p>
            <p className="mt-1 text-[24px] font-semibold text-gray-950">{result.timeEstimate}</p>
          </div>

          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase text-gray-500">Smallest MVP</p>
            <p className="mt-3 text-[15px] leading-6 text-gray-700">{result.smallestMvp}</p>
          </div>

          <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-5">
            <p className="text-[13px] font-semibold uppercase text-gray-500">Why</p>
            <p className="mt-3 text-[15px] leading-6 text-gray-700">{result.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}
