import { BookOpen, Hammer, DollarSign, Map, ArrowRight } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Idea Journal",
    description: "Track how your thinking evolves day-to-day with notes per idea.",
    href: "/solo-founders/idea-journal" as const,
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "MVP Scope Calculator",
    description: "What's the smallest thing you can build in 2 weeks? Based on execution difficulty score.",
    href: "/solo-founders/mvp-calculator" as const,
    icon: Hammer,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Revenue Projector",
    description: "Input a price + target customers to get a rough annual run-rate estimate.",
    href: "/solo-founders/revenue-projector" as const,
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Competitor Map",
    description: "Enter 3 competitor names; tool estimates how crowded your niche is.",
    href: "/solo-founders/competitor-map" as const,
    icon: Map,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function SoloFoundersPage() {
  return (
    <main className="flex-1 pb-24">
      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-600">
            <BookOpen className="size-4 text-gray-700" aria-hidden="true" />
            Tools for solo founders
          </div>
          <h1 className="mx-auto max-w-2xl text-[40px] font-semibold leading-[1.05] text-gray-950 md:text-[48px]">
            Build smarter, not harder.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-6 text-gray-600">
            Four tools to help you validate, scope, project, and position your next idea.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-[12px] border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <div className={`inline-flex rounded-[10px] ${tool.bg} p-3`}>
                  <Icon className={`size-6 ${tool.color}`} aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-[18px] font-semibold text-gray-950">{tool.title}</h2>
                <p className="mt-2 text-[14px] leading-6 text-gray-600">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-gray-700 group-hover:text-gray-950">
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
