"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { estimateCosts } from "../lib/founder-tools";
import type { CostResult } from "../lib/founder-tools";

const ideaTypes = ["SaaS", "Marketplace", "AI/ML", "Mobile App", "E-commerce"];

export function CostEstimator() {
  const [type, setType] = useState("SaaS"); const [team, setTeam] = useState("1"); const [months, setMonths] = useState("12");
  const [result, setResult] = useState<CostResult | null>(null);

  function handleCalculate() {
    const res = estimateCosts({ ideaType: type, teamSize: parseInt(team) || 1, months: parseInt(months) || 12 });
    setResult(res);
    trackEvent("cost_estimator", { type, teamSize: team, months });
  }

  function formatCost(n: number): string { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n); }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><Calculator className="size-4" />Budget planner</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Startup Cost Estimator</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Get a first-year cost estimate based on your idea type and team size.</p>
      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Your Profile</span></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div><label className="text-[13px] font-medium text-foreground">Idea Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white">{ideaTypes.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label className="text-[13px] font-medium text-foreground">Team Size</label><input type="number" min={1} max={50} value={team} onChange={(e) => setTeam(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Timeframe (months)</label><input type="number" min={1} max={60} value={months} onChange={(e) => setMonths(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
        </div>
        <div className="mt-5 flex justify-end"><button type="button" onClick={handleCalculate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><Calculator className="size-4" />Estimate Costs</button></div>
      </div>
      {result && <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Estimated Total</p><p className="mt-1 text-[32px] font-bold text-foreground">{formatCost(result.total)}</p></div>
        {result.categories.map((cat) => <div key={cat.category} className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">{cat.category}</p><p className="mt-2 text-[20px] font-bold text-foreground">{formatCost(cat.total)}</p><ul className="mt-3 space-y-1.5">{cat.items.map((item) => <li key={item.label} className="flex justify-between text-[14px]"><span className="text-muted">{item.label}</span><span className="font-medium text-foreground">{formatCost(item.cost)}</span></li>)}</ul></div>)}
        <div className="rounded-xl border border-accent-border bg-accent-light p-5"><p className="text-[13px] font-semibold uppercase text-accent-dark">Key Insights</p><ul className="mt-3 space-y-2">{result.breakdown.map((b, i) => <li key={i} className="flex items-center gap-2 text-[14px] text-foreground"><span className="size-1.5 rounded-full bg-accent" />{b}</li>)}</ul></div>
      </div>}
    </div>
  );
}
