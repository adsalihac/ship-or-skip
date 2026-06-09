"use client";

import { Target } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { sizeMarket } from "../lib/founder-tools";
import type { MarketSizerResult } from "../lib/founder-tools";

export function MarketSizer() {
  const [niche, setNiche] = useState(""); const [result, setResult] = useState<MarketSizerResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = niche.trim();
    if (trimmed.length < 2) return;
    const res = sizeMarket({ niche: trimmed });
    setResult(res);
    trackEvent("market_sizer", { niche: trimmed });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><Target className="size-4" />TAM / SAM / SOM</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Target Market Sizer</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Estimate your total addressable market, serviceable market, and realistic target.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Your Niche</span></div>
        <input type="text" value={niche} onChange={(e) => { setNiche(e.target.value); setResult(null); }} placeholder="e.g. fintech, edtech, AI for healthcare" className="mt-4 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
        <div className="mt-5 flex justify-end">
          <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><Target className="size-4" />Size Market</button>
        </div>
      </form>
      {result && <div className="mt-6 space-y-4">
        {result.breakdown.map((b) => (
          <div key={b.label} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase text-muted">{b.label}</p>
            <p className="mt-2 text-[28px] font-bold text-foreground">{b.value}</p>
          </div>
        ))}
        <div className="rounded-xl border border-border bg-surface p-5"><p className="text-[13px] font-semibold uppercase text-muted">TAM Rationale</p><p className="mt-2 text-[14px] leading-6 text-foreground">{result.tamRationale}</p></div>
        <div className="rounded-xl border border-border bg-surface p-5"><p className="text-[13px] font-semibold uppercase text-muted">SAM Rationale</p><p className="mt-2 text-[14px] leading-6 text-foreground">{result.samRationale}</p></div>
        <div className="rounded-xl border border-border bg-surface p-5"><p className="text-[13px] font-semibold uppercase text-muted">SOM Rationale</p><p className="mt-2 text-[14px] leading-6 text-foreground">{result.somRationale}</p></div>
      </div>}
    </div>
  );
}
