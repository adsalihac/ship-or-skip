"use client";

import { BarChart3, Lightbulb, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Describe your idea",
    description: "Write a few sentences about your startup idea — the problem you're solving and who it's for."
  },
  {
    icon: BarChart3,
    title: "AI evaluates 6 dimensions",
    description: "Our engine scores market demand, competition, monetization, execution difficulty, distribution, and founder advantage."
  },
  {
    icon: Rocket,
    title: "Get a ship-or-skip verdict",
    description: "Receive a structured report with key risks, opportunities, and a clear recommendation for your next move."
  }
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground">
          <Rocket className="size-4" aria-hidden="true" />
          How it works
        </div>
        <h2 className="text-[32px] font-bold leading-tight text-foreground sm:text-[40px]">
          From idea to decision in seconds
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-6 text-muted">
          No sign-up, no fluff. Just paste your idea and get a founder-grade analysis.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="group relative rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div
              className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-white shadow-sm"
              aria-hidden="true"
            >
              {i + 1}
            </div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-foreground/5">
              <step.icon className="size-5 text-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-[17px] font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 text-[14px] leading-6 text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
