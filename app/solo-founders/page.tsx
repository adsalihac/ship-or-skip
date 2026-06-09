import {
  BookOpen, Hammer, DollarSign, Map, ArrowRight, Compass,
  Target, MessageSquare, TrendingUp, Flame, Calculator, Rocket,
  ListChecks, GitCompare, UserCheck,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Validation & Research",
    tools: [
      { title: "Target Market Sizer", desc: "TAM/SAM/SOM estimates per niche", href: "/solo-founders/market-sizer" as const, icon: Target, gradient: "from-blue-500 to-blue-600" },
      { title: "Discovery Questions", desc: "20 customer interview questions per idea", href: "/solo-founders/discovery-questions" as const, icon: MessageSquare, gradient: "from-cyan-500 to-cyan-600" },
      { title: "Trend Analyzer", desc: "Opportunity analysis from a news snippet", href: "/solo-founders/trend-analyzer" as const, icon: TrendingUp, gradient: "from-violet-500 to-violet-600" },
      { title: "Competitor Map", desc: "Estimate how crowded your niche is", href: "/solo-founders/competitor-map" as const, icon: Map, gradient: "from-amber-500 to-amber-600" },
    ],
  },
  {
    name: "Financial & Planning",
    tools: [
      { title: "Revenue Projector", desc: "Price + customers → annual run-rate", href: "/solo-founders/revenue-projector" as const, icon: DollarSign, gradient: "from-emerald-500 to-emerald-600" },
      { title: "Burn Rate Calculator", desc: "Runway + funding timeline", href: "/solo-founders/burn-rate" as const, icon: Flame, gradient: "from-red-500 to-red-600" },
      { title: "Pricing Strategy", desc: "Tier recommendations from costs + competitors", href: "/solo-founders/pricing-tool" as const, icon: DollarSign, gradient: "from-green-500 to-green-600" },
      { title: "Startup Cost Estimator", desc: "First-year cost breakdown by idea type", href: "/solo-founders/cost-estimator" as const, icon: Calculator, gradient: "from-teal-500 to-teal-600" },
    ],
  },
  {
    name: "Strategy & Execution",
    tools: [
      { title: "MVP Scope Calculator", desc: "Smallest thing to build in 2 weeks", href: "/solo-founders/mvp-calculator" as const, icon: Hammer, gradient: "from-purple-500 to-purple-600" },
      { title: "GTM Playbook", desc: "Channel-by-channel go-to-market plan", href: "/solo-founders/gtm-playbook" as const, icon: Rocket, gradient: "from-orange-500 to-orange-600" },
      { title: "Feature Prioritization", desc: "Impact/effort scoring → ranked build order", href: "/solo-founders/feature-prioritization" as const, icon: ListChecks, gradient: "from-pink-500 to-pink-600" },
      { title: "Idea Comparison", desc: "Side-by-side analysis of 2–3 ideas", href: "/solo-founders/idea-comparison" as const, icon: GitCompare, gradient: "from-indigo-500 to-indigo-600" },
    ],
  },
  {
    name: "Founder Fit & Tracking",
    tools: [
      { title: "Idea Journal", desc: "Track thinking day-to-day with notes per idea", href: "/solo-founders/idea-journal" as const, icon: BookOpen, gradient: "from-blue-500 to-blue-600" },
      { title: "Founder Fit Assessment", desc: "Skills + risk questionnaire → match score", href: "/solo-founders/founder-fit" as const, icon: UserCheck, gradient: "from-sky-500 to-sky-600" },
    ],
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
            {categories.reduce((s, c) => s + c.tools.length, 0)} tools to help you validate, scope, project, and position your next idea.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category.name} className="mt-12">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted">{category.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative overflow-hidden rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-3 shadow-sm`}>
                      <Icon className="size-5 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 text-[15px] font-bold text-foreground">{tool.title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-muted">{tool.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-foreground transition group-hover:translate-x-0.5">
                      Open <ArrowRight className="size-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
