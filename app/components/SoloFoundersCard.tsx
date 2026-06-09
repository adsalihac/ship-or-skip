"use client";

import { ArrowRight, BarChart3, Compass, Lightbulb, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: Target, label: "Market & Discovery", count: 4 },
  { icon: BarChart3, label: "Financial Planning", count: 3 },
  { icon: TrendingUp, label: "Growth & Strategy", count: 3 },
  { icon: Lightbulb, label: "Idea & Fit", count: 4 }
];

export function SoloFoundersCard() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-8">
      <div className="group relative overflow-hidden rounded-2xl border-2 border-foreground/10 bg-white shadow-sm transition-all duration-300 hover:border-foreground/25 hover:shadow-md">
        {/* angled accent stripe */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-32 rotate-12 bg-foreground/5 sm:size-48"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-6 -left-6 size-24 -rotate-6 bg-foreground/[0.03] sm:size-36"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Compass className="size-3" aria-hidden="true" />
              <span>14 free tools</span>
            </div>
            <h2 className="text-[28px] font-bold leading-tight text-foreground sm:text-[34px]">
              Solo Founders Toolkit
            </h2>
            <p className="mt-2 max-w-lg text-[15px] leading-6 text-muted">
              Validate, plan, and launch your startup idea with 14 free tools built for independent builders.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {categories.map((cat) => (
                <div
                  key={cat.label}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <cat.icon className="size-3.5 shrink-0 text-foreground" aria-hidden="true" />
                  <span className="whitespace-nowrap text-[13px] font-medium text-muted">
                    {cat.label}
                  </span>
                  <span className="ml-auto text-[11px] font-semibold text-muted/50">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/solo-founders"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Browse tools
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
