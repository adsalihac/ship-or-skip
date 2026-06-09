import { BookOpen, Hammer, DollarSign, Map, ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Idea Journal",
    description: "Track how your thinking evolves day-to-day with notes per idea.",
    href: "/solo-founders/idea-journal" as const,
    icon: BookOpen,
    gradient: "from-blue-500 to-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
  },
  {
    title: "MVP Scope Calculator",
    description: "What's the smallest thing you can build in 2 weeks? Based on execution difficulty score.",
    href: "/solo-founders/mvp-calculator" as const,
    icon: Hammer,
    gradient: "from-purple-500 to-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
  },
  {
    title: "Revenue Projector",
    description: "Input a price + target customers to get a rough annual run-rate estimate.",
    href: "/solo-founders/revenue-projector" as const,
    icon: DollarSign,
    gradient: "from-emerald-500 to-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
  },
  {
    title: "Competitor Map",
    description: "Enter 3 competitor names; tool estimates how crowded your niche is.",
    href: "/solo-founders/competitor-map" as const,
    icon: Map,
    gradient: "from-amber-500 to-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
  },
];

export default function SoloFoundersPage() {
  return (
    <main className="flex-1 pb-24">
      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground">
            <Compass className="size-4" aria-hidden="true" />
            Tools for solo founders
          </div>
          <h1 className="mx-auto max-w-2xl text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">
            Build smarter, not harder.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-6 text-muted">
            Four tools to help you validate, scope, project, and position your next idea.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden rounded-xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="mt-4 text-[18px] font-bold text-foreground">{tool.title}</h2>
                <p className="mt-2 text-[14px] leading-6 text-muted">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-foreground group-hover:text-foreground">
                  Open tool
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
