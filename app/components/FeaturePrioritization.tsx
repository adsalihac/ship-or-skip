"use client";

import { ListChecks } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { prioritizeFeatures } from "../lib/founder-tools";
import type { PrioritizationResult } from "../lib/founder-tools";

export function FeaturePrioritization() {
  const [features, setFeatures] = useState([{ name: "", impact: 5, effort: 5 }]);
  const [result, setResult] = useState<PrioritizationResult | null>(null);

  function addFeature() { setFeatures([...features, { name: "", impact: 5, effort: 5 }]); setResult(null); }
  function removeFeature(i: number) { const f = features.filter((_, idx) => idx !== i); setFeatures(f); setResult(null); }
  function updateFeature(i: number, field: string, value: string | number) {
    const f = [...features]; f[i] = { ...f[i], [field]: value }; setFeatures(f); setResult(null);
  }

  function handleCalculate() {
    const valid = features.filter((f) => f.name.trim().length > 0);
    if (valid.length === 0) return;
    const res = prioritizeFeatures({ features: valid });
    setResult(res);
    trackEvent("feature_prioritization", { count: valid.length });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><ListChecks className="size-4" />Build order</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Feature Prioritization</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Score features by impact and effort to get a ranked build order.</p>
      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Features ({features.length})</span><button type="button" onClick={addFeature} className="text-[13px] font-semibold text-foreground hover:text-foreground">+ Add row</button></div>
        <div className="mt-4 space-y-3">{features.map((f, i) => <div key={i} className="flex items-end gap-2"><div className="flex-1"><input type="text" value={f.name} onChange={(e) => updateFeature(i, "name", e.target.value)} placeholder="Feature name" className="w-full rounded-lg border border-border bg-surface p-2.5 text-[14px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" /></div><div className="w-20"><input type="number" min={1} max={10} value={f.impact} onChange={(e) => updateFeature(i, "impact", parseInt(e.target.value) || 1)} className="w-full rounded-lg border border-border bg-surface p-2.5 text-[14px] text-center text-foreground outline-none transition focus:border-foreground focus:bg-white" title="Impact (1-10)" /></div><div className="w-20"><input type="number" min={1} max={10} value={f.effort} onChange={(e) => updateFeature(i, "effort", parseInt(e.target.value) || 1)} className="w-full rounded-lg border border-border bg-surface p-2.5 text-[14px] text-center text-foreground outline-none transition focus:border-foreground focus:bg-white" title="Effort (1-10)" /></div>{features.length > 1 && <button type="button" onClick={() => removeFeature(i)} className="shrink-0 rounded-lg p-2.5 text-muted transition hover:bg-danger-light hover:text-danger"><span className="text-[16px] font-bold">&times;</span></button>}</div>)}</div>
        <div className="mt-4 flex justify-between gap-2 text-[11px] text-muted"><span>Feature</span><span>Impact  Effort</span></div>
        <div className="mt-3 flex justify-end"><button type="button" onClick={handleCalculate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><ListChecks className="size-4" />Prioritize</button></div>
      </div>
      {result && <div className="mt-6 space-y-3">{result.features.map((f) => <div key={f.name} className={`rounded-xl border p-4 shadow-sm ${f.priority === "Now" ? "border-success-border bg-success-light" : f.priority === "Next" ? "border-accent-border bg-accent-light" : "border-border bg-surface"}`}><div className="flex items-center justify-between"><div><span className="text-[13px] font-bold text-foreground">{f.name}</span><div className="mt-1 flex gap-3 text-[12px] text-muted"><span>Impact: {f.impact}/10</span><span>Effort: {f.effort}/10</span><span>Score: {f.score}</span></div></div><span className={`text-[13px] font-bold ${f.priority === "Now" ? "text-success" : f.priority === "Next" ? "text-accent" : "text-muted"}`}>{f.priority}</span></div></div>)}</div>}
    </div>
  );
}
