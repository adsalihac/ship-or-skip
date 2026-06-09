"use client";

import { Globe, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { assessCompetitors } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { CompetitorResult } from "../lib/solo-founders";

function crowdednessColor(result: CompetitorResult): string {
  if (result.crowdedness === "Crowded") return "text-danger";
  if (result.crowdedness === "Moderately Crowded") return "text-accent";
  return "text-success";
}
function crowdednessBg(result: CompetitorResult): string {
  if (result.crowdedness === "Crowded") return "bg-danger-light border-danger-border";
  if (result.crowdedness === "Moderately Crowded") return "bg-accent-light border-accent-border";
  return "bg-success-light border-success-border";
}
function signalColor(signal: string): string {
  switch (signal) { case "High": return "text-danger"; case "Medium": return "text-accent"; default: return "text-success"; }
}
function signalBg(signal: string): string {
  switch (signal) { case "High": return "bg-danger-light"; case "Medium": return "bg-accent-light"; default: return "bg-success-light"; }
}

export function CompetitorMap() {
  const [name1, setName1] = useState(""); const [name2, setName2] = useState(""); const [name3, setName3] = useState("");
  const [niche, setNiche] = useState(""); const [result, setResult] = useState<CompetitorResult | null>(null);
  const [error, setError] = useState(""); const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    startTransition(async () => {
      trackEvent("competitor_map_submission", { niche });
      const res = await assessCompetitors({ name1: name1.trim(), name2: name2.trim(), name3: name3.trim(), niche: niche.trim() });
      if (!res.ok) { setError(res.error); return; }
      setResult(res.report);
      trackEvent("competitor_map_result", { crowdedness: res.report.crowdedness, score: res.report.crowdednessScore });
    });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><Globe className="size-4" aria-hidden="true" />Niche density estimator</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Competitor Map</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Enter up to 3 competitors and your niche to estimate how crowded the space is.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Competitors</span></div>
        <div className="mt-4 space-y-3">
          <input type="text" value={name1} onChange={(e) => { setName1(e.target.value); setResult(null); }} placeholder="Competitor 1 (e.g. Notion)" className="w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
          <input type="text" value={name2} onChange={(e) => { setName2(e.target.value); setResult(null); }} placeholder="Competitor 2 (e.g. Coda)" className="w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
          <input type="text" value={name3} onChange={(e) => { setName3(e.target.value); setResult(null); }} placeholder="Competitor 3 (optional)" className="w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
        </div>
        <div className="mt-4">
          <label className="text-[13px] font-medium text-foreground">Niche / Category</label>
          <input type="text" value={niche} onChange={(e) => { setNiche(e.target.value); setResult(null); }} placeholder="e.g. productivity software, fintech" className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
        </div>
        {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:bg-muted/40 sm:w-auto">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />} Map Competitors
          </button>
        </div>
      </form>
      {result && <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[13px] font-semibold uppercase text-muted">Crowdedness</p><p className={`mt-1 text-[32px] font-bold ${crowdednessColor(result)}`}>{result.crowdedness}</p></div>
            <div className={`rounded-lg border px-3 py-1.5 ${crowdednessBg(result)}`}><span className={`text-[13px] font-semibold ${crowdednessColor(result)}`}>Score: {result.crowdednessScore}/10</span></div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-border"><div className={`h-2 rounded-full ${result.crowdednessScore >= 7 ? "bg-danger" : result.crowdednessScore >= 4 ? "bg-accent" : "bg-success"}`} style={{ width: `${result.crowdednessScore * 10}%` }} /></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">{result.analyses.map((a) => <div key={a.name} className={`rounded-xl border border-border p-4 ${signalBg(a.signal)}`}><p className="text-[13px] font-medium text-foreground">{a.name}</p><p className={`mt-1 text-[13px] font-semibold ${signalColor(a.signal)}`}>{a.signal} Signal</p><p className="mt-2 text-[12px] leading-5 text-muted">{a.reasoning}</p></div>)}</div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Summary</p><p className="mt-2 text-[15px] leading-6 text-foreground">{result.summary}</p></div>
        <div className="rounded-xl border border-accent-border bg-accent-light p-5"><p className="text-[13px] font-semibold uppercase text-accent-dark">Recommendation</p><p className="mt-2 text-[15px] leading-6 text-foreground">{result.recommendation}</p></div>
      </div>}
    </div>
  );
}
