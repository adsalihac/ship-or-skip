"use client";

import { Flame } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { calculateBurnRate } from "../lib/founder-tools";
import type { BurnRateResult } from "../lib/founder-tools";

export function BurnRateCalculator() {
  const [expenses, setExpenses] = useState("5000"); const [cash, setCash] = useState("50000");
  const [revenue, setRevenue] = useState("0"); const [result, setResult] = useState<BurnRateResult | null>(null);

  function handleCalculate() {
    const e = parseInt(expenses) || 0; const c = parseInt(cash) || 0; const r = parseInt(revenue) || 0;
    if (e <= 0 || c <= 0) return;
    const res = calculateBurnRate({ monthlyExpenses: e, currentCash: c, monthlyRevenue: r });
    setResult(res);
    trackEvent("burn_rate_calculated", { expenses: e, cash: c, revenue: r, runway: res.runwayMonths });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><Flame className="size-4" />Runway tracker</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Burn Rate Calculator</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">See how long your cash will last and when you need to raise or reach revenue.</p>
      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Your Numbers</span></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div><label className="text-[13px] font-medium text-foreground">Monthly Expenses ($)</label><input type="number" min={1} value={expenses} onChange={(e) => { setExpenses(e.target.value); setResult(null); }} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Cash in Bank ($)</label><input type="number" min={1} value={cash} onChange={(e) => { setCash(e.target.value); setResult(null); }} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
          <div><label className="text-[13px] font-medium text-foreground">Monthly Revenue ($)</label><input type="number" min={0} value={revenue} onChange={(e) => { setRevenue(e.target.value); setResult(null); }} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white" /></div>
        </div>
        <div className="mt-5 flex justify-end"><button type="button" onClick={handleCalculate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><Flame className="size-4" />Calculate</button></div>
      </div>
      {result && <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Monthly Burn</p><p className="mt-1 text-[28px] font-bold text-foreground">${result.burnRate.toLocaleString()}</p></div>
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Runway</p><p className={`mt-1 text-[28px] font-bold ${result.runwayMonths >= 12 ? "text-success" : result.runwayMonths >= 6 ? "text-accent" : "text-danger"}`}>{result.runwayMonths >= 999 ? "Infinite" : `${result.runwayMonths} months`}</p></div>
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Profitable?</p><p className={`mt-1 text-[28px] font-bold ${result.isProfitable ? "text-success" : "text-danger"}`}>{result.isProfitable ? "Yes" : "No"}</p></div>
        </div>
        <div className={`rounded-xl border p-5 ${result.runwayMonths >= 12 ? "border-success-border bg-success-light" : result.runwayMonths >= 6 ? "border-accent-border bg-accent-light" : "border-danger-border bg-danger-light"}`}><p className="text-[13px] font-semibold uppercase text-foreground">Advice</p><p className="mt-2 text-[15px] leading-6 text-foreground">{result.advice}</p></div>
      </div>}
    </div>
  );
}
