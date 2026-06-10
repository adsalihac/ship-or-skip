"use client";

import { ArrowRight, DollarSign, Target, Timer, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    icon: Target,
    title: "Market Sizer",
    description: "Calculate TAM, SAM, and SOM for your target market.",
    href: "/solo-founders/market-sizer" as const
  },
  {
    icon: DollarSign,
    title: "Revenue Projector",
    description: "Forecast monthly and annual revenue based on realistic assumptions.",
    href: "/solo-founders/revenue-projector" as const
  },
  {
    icon: Timer,
    title: "Burn Rate Calculator",
    description: "Track your monthly spend and estimate runway.",
    href: "/solo-founders/burn-rate" as const
  },
  {
    icon: TrendingUp,
    title: "Trend Analyzer",
    description: "Score market opportunities against your skills and timing.",
    href: "/solo-founders/trend-analyzer" as const
  },
  {
    icon: Users,
    title: "GTM Playbook",
    description: "Generate a channel-by-channel go-to-market plan.",
    href: "/solo-founders/gtm-playbook" as const
  },
  {
    icon: ArrowRight,
    title: "Feature Prioritization",
    description: "Score feature ideas by impact and effort to decide what to build first.",
    href: "/solo-founders/feature-prioritization" as const
  }
];

export function FeaturedTools() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-[13px] font-semibold text-white">
          <TrendingUp className="size-4" aria-hidden="true" />
          Featured tools
        </div>
        <h2 className="text-[32px] font-bold leading-tight text-foreground sm:text-[40px]">
          Everything a solo founder needs
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-6 text-muted">
          From sizing your market to planning your launch — 14 free tools for every stage.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-foreground/5 transition-colors group-hover:bg-foreground/10">
              <tool.icon className="size-4 text-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground">{tool.title}</h3>
            <p className="mt-1 text-[13px] leading-5 text-muted">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/solo-founders"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-[14px] font-semibold text-foreground shadow-sm transition hover:bg-surface"
        >
          View all 14 tools
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
