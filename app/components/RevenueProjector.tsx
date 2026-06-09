"use client";

import { DollarSign } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { calculateRevenue } from "../lib/solo-founders";
import type { RevenueResult } from "../lib/solo-founders";

export function RevenueProjector() {
  const [price, setPrice] = useState("29");
  const [customers, setCustomers] = useState("50");
  const [growth, setGrowth] = useState("5");
  const [result, setResult] = useState<RevenueResult | null>(null);

  function handleCalculate() {
    const p = parseFloat(price) || 0;
    const c = parseInt(customers) || 0;
    const g = parseFloat(growth) || 0;

    if (p <= 0 || c <= 0) return;

    const res = calculateRevenue({
      pricePerMonth: p,
      targetCustomersPerMonth: c,
      monthlyGrowthRate: g,
    });
    setResult(res);

    trackEvent("revenue_projection_calculated", {
      price: p,
      targetCustomers: c,
      growthRate: g,
      projectedArr: res.arr,
    });
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground">
        <DollarSign className="size-4" aria-hidden="true" />
        Rough annual run-rate
      </div>

      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">
        Revenue Projector
      </h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">
        Input a price and target customers to get a rough annual run-rate estimate with monthly projections.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <span className="text-[13px] font-semibold uppercase text-muted">Parameters</span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className="text-[13px] font-medium text-foreground">
              Price per month ($)
            </label>
            <input
              id="price"
              type="number"
              min={1}
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setResult(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="customers" className="text-[13px] font-medium text-foreground">
              New customers / month
            </label>
            <input
              id="customers"
              type="number"
              min={1}
              value={customers}
              onChange={(e) => {
                setCustomers(e.target.value);
                setResult(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="growth" className="text-[13px] font-medium text-foreground">
              Monthly growth (%)
            </label>
            <input
              id="growth"
              type="number"
              min={0}
              max={100}
              value={growth}
              onChange={(e) => {
                setGrowth(e.target.value);
                setResult(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"
          >
            <DollarSign className="size-4" aria-hidden="true" />
            Project Revenue
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-muted">Month 12 MRR</p>
              <p className="mt-1 text-[28px] font-bold text-foreground">
                {formatCurrency(result.mrr)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-muted">Annual Run-Rate</p>
              <p className="mt-1 text-[28px] font-bold text-success">
                {formatCurrency(result.arr)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-muted">Total Customers</p>
              <p className="mt-1 text-[28px] font-bold text-foreground">
                {result.totalCustomers.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase text-muted">12-Month Projection</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 font-semibold text-muted">Month</th>
                    <th className="pb-2 font-semibold text-muted">New Customers</th>
                    <th className="pb-2 font-semibold text-muted">Total Customers</th>
                    <th className="pb-2 font-semibold text-muted text-right">MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projections.map((proj) => (
                    <tr key={proj.month} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-medium text-foreground">{proj.month}</td>
                      <td className="py-2.5 text-muted">{proj.newCustomers}</td>
                      <td className="py-2.5 text-muted">{proj.totalCustomers}</td>
                      <td className="py-2.5 text-right font-semibold text-foreground">
                        {formatCurrency(proj.mrr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
