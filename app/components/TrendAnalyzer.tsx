"use client";

import { TrendingUp, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { assessTrend } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { TrendResult } from "../lib/founder-tools";

export function TrendAnalyzer() {
  const [trend, setTrend] = useState(""); const [result, setResult] = useState<TrendResult | null>(null);
  const [error, setError] = useState(""); const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    startTransition(async () => {
      trackEvent("trend_analyzer", { trend_length: trend.length });
      const res = await assessTrend({ trend: trend.trim() });
      if (!res.ok) { setError(res.error); return; }
      setResult(res.report);
    });
  }

  const verdictColors = { Opportunity: "text-success", Caution: "text-danger", Watch: "text-accent" };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><TrendingUp className="size-4" />Signal scanner</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Trend Analyzer</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Paste a news headline, trend, or market observation. Get a quick opportunity assessment.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Trend / Observation</span></div>
        <textarea value={trend} onChange={(e) => { setTrend(e.target.value); setResult(null); }} placeholder="Paste a trend, news headline, or market observation..." rows={4} className="mt-4 w-full resize-y rounded-lg border border-border bg-surface p-4 text-[15px] leading-6 text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
        {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:bg-muted/40 sm:w-auto">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />} Analyze Trend
          </button>
        </div>
      </form>
      {result && <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[13px] font-semibold uppercase text-muted">Verdict</p><p className={`mt-1 text-[32px] font-bold ${verdictColors[result.verdict]}`}>{result.verdict}</p></div>
            <div className="rounded-lg border border-border bg-surface px-3 py-1.5"><span className="text-[13px] font-semibold text-foreground">Score: {result.score}/10</span></div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-border"><div className={`h-2 rounded-full ${result.verdict === "Opportunity" ? "bg-success" : result.verdict === "Caution" ? "bg-danger" : "bg-accent"}`} style={{ width: `${result.score * 10}%` }} /></div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Summary</p><p className="mt-2 text-[15px] leading-6 text-foreground">{result.summary}</p></div>
        <div className="grid gap-3 sm:grid-cols-2">{result.signals.map((s) => <div key={s.label} className={`rounded-xl border p-4 ${s.type === "positive" ? "border-success-border bg-success-light" : s.type === "negative" ? "border-danger-border bg-danger-light" : "border-border bg-surface"}`}><p className="text-[13px] font-semibold text-foreground">{s.label}</p><p className="mt-1 text-[12px] leading-5 text-muted">{s.detail}</p></div>)}</div>
        <div className="rounded-xl border border-accent-border bg-accent-light p-5"><p className="text-[13px] font-semibold uppercase text-accent-dark">Next Step</p><p className="mt-2 text-[14px] leading-6 text-foreground">{result.recommendation}</p></div>
      </div>}
    </div>
  );
}
