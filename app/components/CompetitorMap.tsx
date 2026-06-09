"use client";

import { Loader2, Map } from "lucide-react";
import { useState, useTransition } from "react";
import { assessCompetitors } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { CompetitorResult } from "../lib/solo-founders";

function crowdednessColor(result: CompetitorResult): string {
  if (result.crowdedness === "Crowded") return "text-red-600";
  if (result.crowdedness === "Moderately Crowded") return "text-amber-600";
  return "text-green-600";
}

function crowdednessBg(result: CompetitorResult): string {
  if (result.crowdedness === "Crowded") return "bg-red-50 border-red-200";
  if (result.crowdedness === "Moderately Crowded") return "bg-amber-50 border-amber-200";
  return "bg-green-50 border-green-200";
}

function signalColor(signal: string): string {
  switch (signal) {
    case "High": return "text-red-600";
    case "Medium": return "text-amber-600";
    default: return "text-green-600";
  }
}

function signalBg(signal: string): string {
  switch (signal) {
    case "High": return "bg-red-50";
    case "Medium": return "bg-amber-50";
    default: return "bg-green-50";
  }
}

export function CompetitorMap() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [name3, setName3] = useState("");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState<CompetitorResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      trackEvent("competitor_map_submission", { niche });

      const res = await assessCompetitors({
        name1: name1.trim(),
        name2: name2.trim(),
        name3: name3.trim(),
        niche: niche.trim(),
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      setResult(res.report);
      trackEvent("competitor_map_result", {
        crowdedness: res.report.crowdedness,
        score: res.report.crowdednessScore,
      });
    });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-600">
        <Map className="size-4 text-gray-700" aria-hidden="true" />
        Niche density estimator
      </div>

      <h1 className="text-[40px] font-semibold leading-[1.05] text-gray-950 md:text-[48px]">
        Competitor Map
      </h1>
      <p className="mt-4 text-[15px] leading-6 text-gray-600">
        Enter up to 3 competitors and your niche to estimate how crowded the space is.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <span className="text-[13px] font-semibold uppercase text-gray-500">Competitors</span>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <input
              type="text"
              value={name1}
              onChange={(e) => {
                setName1(e.target.value);
                setResult(null);
              }}
              placeholder="Competitor 1 (e.g. Notion)"
              className="w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
          </div>
          <div>
            <input
              type="text"
              value={name2}
              onChange={(e) => {
                setName2(e.target.value);
                setResult(null);
              }}
              placeholder="Competitor 2 (e.g. Coda)"
              className="w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
          </div>
          <div>
            <input
              type="text"
              value={name3}
              onChange={(e) => {
                setName3(e.target.value);
                setResult(null);
              }}
              placeholder="Competitor 3 (optional)"
              className="w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="niche" className="text-[13px] font-medium text-gray-700">
            Niche / Category
          </label>
          <input
            id="niche"
            type="text"
            value={niche}
            onChange={(e) => {
              setNiche(e.target.value);
              setResult(null);
            }}
            placeholder="e.g. productivity software, fintech, edtech"
            className="mt-1.5 w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />
        </div>

        {error && <p className="mt-3 text-[13px] font-medium text-red-600">{error}</p>}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-gray-950 px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400 sm:w-auto"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Map className="size-4" aria-hidden="true" />
            )}
            Map Competitors
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase text-gray-500">Crowdedness</p>
                <p className={`mt-1 text-[32px] font-semibold ${crowdednessColor(result)}`}>
                  {result.crowdedness}
                </p>
              </div>
              <div className={`rounded-[8px] border px-3 py-1.5 ${crowdednessBg(result)}`}>
                <span className={`text-[13px] font-semibold ${crowdednessColor(result)}`}>
                  Score: {result.crowdednessScore}/10
                </span>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${
                  result.crowdednessScore >= 7
                    ? "bg-red-500"
                    : result.crowdednessScore >= 4
                      ? "bg-amber-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${result.crowdednessScore * 10}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {result.analyses.map((a) => (
              <div
                key={a.name}
                className={`rounded-[12px] border border-gray-200 p-4 ${signalBg(a.signal)}`}
              >
                <p className="text-[13px] font-medium text-gray-700">{a.name}</p>
                <p className={`mt-1 text-[13px] font-semibold ${signalColor(a.signal)}`}>
                  {a.signal} Signal
                </p>
                <p className="mt-2 text-[12px] leading-5 text-gray-600">{a.reasoning}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase text-gray-500">Summary</p>
            <p className="mt-2 text-[15px] leading-6 text-gray-700">{result.summary}</p>
          </div>

          <div className="rounded-[12px] border border-amber-200 bg-amber-50 p-5">
            <p className="text-[13px] font-semibold uppercase text-amber-800">Recommendation</p>
            <p className="mt-2 text-[15px] leading-6 text-amber-900">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
