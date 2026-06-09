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
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-600">
        <DollarSign className="size-4 text-gray-700" aria-hidden="true" />
        Rough annual run-rate
      </div>

      <h1 className="text-[40px] font-semibold leading-[1.05] text-gray-950 md:text-[48px]">
        Revenue Projector
      </h1>
      <p className="mt-4 text-[15px] leading-6 text-gray-600">
        Input a price and target customers to get a rough annual run-rate estimate with monthly projections.
      </p>

      <div className="mt-8 rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <span className="text-[13px] font-semibold uppercase text-gray-500">Parameters</span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className="text-[13px] font-medium text-gray-700">
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
              className="mt-1.5 w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="customers" className="text-[13px] font-medium text-gray-700">
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
              className="mt-1.5 w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="growth" className="text-[13px] font-medium text-gray-700">
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
              className="mt-1.5 w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-gray-950 px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
          >
            <DollarSign className="size-4" aria-hidden="true" />
            Project Revenue
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-gray-500">Month 12 MRR</p>
              <p className="mt-1 text-[28px] font-semibold text-gray-950">
                {formatCurrency(result.mrr)}
              </p>
            </div>
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-gray-500">Annual Run-Rate</p>
              <p className="mt-1 text-[28px] font-semibold text-green-600">
                {formatCurrency(result.arr)}
              </p>
            </div>
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold uppercase text-gray-500">Total Customers</p>
              <p className="mt-1 text-[28px] font-semibold text-gray-950">
                {result.totalCustomers.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase text-gray-500">12-Month Projection</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 font-semibold text-gray-500">Month</th>
                    <th className="pb-2 font-semibold text-gray-500">New Customers</th>
                    <th className="pb-2 font-semibold text-gray-500">Total Customers</th>
                    <th className="pb-2 font-semibold text-gray-500 text-right">MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projections.map((proj) => (
                    <tr key={proj.month} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 font-medium text-gray-700">{proj.month}</td>
                      <td className="py-2.5 text-gray-600">{proj.newCustomers}</td>
                      <td className="py-2.5 text-gray-600">{proj.totalCustomers}</td>
                      <td className="py-2.5 text-right font-medium text-gray-900">
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
