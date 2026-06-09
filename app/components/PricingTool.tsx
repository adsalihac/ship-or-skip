"use client";

import { DollarSign } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { generatePricing } from "../lib/founder-tools";
import type { PricingResult } from "../lib/founder-tools";

export function PricingTool() {
  const [market, setMarket] = useState("B2B SaaS"); const [low, setLow] = useState("10"); const [high, setHigh] = useState("50");
  const [cost, setCost] = useState("10000"); const [margin, setMargin] = useState("50"); const [result, setResult] = useState<PricingResult | null>(null);

  function handleCalculate() {
    const res = generatePricing({
      targetMarket: market, competitorPriceLow: parseInt(low) || 0, competitorPriceHigh: parseInt(high) || 0,
      monthlyOperatingCost: parseInt(cost) || 0, targetMargin: parseInt(margin) || 0,
    });
    setResult(res);
    trackEvent("pricing_tool", { market });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><DollarSign className="size-4" />Revenue modeling</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Pricing Strategy</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Input your costs and competitor prices to get tier recommendations.</p>
      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Parameters</span></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="text-[13px] font-medium text-foreground">Target Market</label><input type="text" value={market} onChange={(e) => setMarket(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Monthly Operating Cost ($)</label><input type="number" min={1} value={cost} onChange={(e) => setCost(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Competitor Price Low ($/mo)</label><input type="number" min={1} value={low} onChange={(e) => setLow(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Competitor Price High ($/mo)</label><input type="number" min={1} value={high} onChange={(e) => setHigh(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Target Margin (%)</label><input type="number" min={5} max={95} value={margin} onChange={(e) => setMargin(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
        </div>
        <div className="mt-5 flex justify-end"><button type="button" onClick={handleCalculate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><DollarSign className="size-4" />Generate Pricing</button></div>
      </div>
      {result && <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">{result.tiers.map((tier) => <div key={tier.name} className={`rounded-xl border p-5 shadow-sm ${tier.recommended ? "border-foreground bg-foreground" : "border-border bg-white"}`}>{tier.recommended && <span className="mb-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">Recommended</span>}<h3 className={`text-[18px] font-bold ${tier.recommended ? "text-white" : "text-foreground"}`}>{tier.name}</h3><p className={`mt-1 text-[28px] font-bold ${tier.recommended ? "text-white" : "text-foreground"}`}>${tier.price}<span className="text-[14px] font-normal">/mo</span></p><ul className="mt-3 space-y-1.5">{tier.features.map((f) => <li key={f} className={`flex items-center gap-2 text-[13px] ${tier.recommended ? "text-white/80" : "text-muted"}`}><span className="size-1.5 rounded-full bg-current" />{f}</li>)}</ul></div>)}</div>
        <div className="rounded-xl border border-border bg-surface p-5"><p className="text-[13px] font-semibold uppercase text-muted">Analysis</p><ul className="mt-3 space-y-2">{result.analysis.map((a, i) => <li key={i} className="flex items-center gap-2 text-[14px] text-foreground"><span className="size-1.5 rounded-full bg-foreground" />{a}</li>)}</ul></div>
      </div>}
    </div>
  );
}
