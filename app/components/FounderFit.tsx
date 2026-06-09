"use client";

import { UserCheck } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { assessFounderFit } from "../lib/founder-tools";
import type { FounderFitResult } from "../lib/founder-tools";

export function FounderFit() {
  const [skills, setSkills] = useState(""); const [experience, setExperience] = useState(""); const [network, setNetwork] = useState("");
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Medium"); const [domain, setDomain] = useState(""); const [ideaType, setIdeaType] = useState("");
  const [result, setResult] = useState<FounderFitResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = assessFounderFit({ skills: skills.trim(), experience: experience.trim(), network: network.trim(), riskTolerance: risk, industryDomain: domain.trim(), ideaType: ideaType.trim() });
    setResult(res);
    trackEvent("founder_fit", { riskTolerance: risk });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><UserCheck className="size-4" />Founder-idea match</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Founder Fit Assessment</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">See how well your skills, experience, and risk tolerance match your idea.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">About You</span></div>
        <div className="mt-4 space-y-4">
          <div><label className="text-[13px] font-medium text-foreground">Your Skills</label><textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. full-stack developer, sales experience, product management" rows={2} className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-[13px] font-medium text-foreground">Relevant Experience</label><textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Past startups, industry roles, projects..." rows={2} className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" /></div>
            <div><label className="text-[13px] font-medium text-foreground">Your Network</label><textarea value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="Who you know in this space..." rows={2} className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="text-[13px] font-medium text-foreground">Risk Tolerance</label><select value={risk} onChange={(e) => setRisk(e.target.value as any)} className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition focus:border-foreground focus:bg-white"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
            <div><label className="text-[13px] font-medium text-foreground">Industry Domain</label><input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. fintech, healthcare" className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" /></div>
            <div><label className="text-[13px] font-medium text-foreground">Your Idea Type</label><input type="text" value={ideaType} onChange={(e) => setIdeaType(e.target.value)} placeholder="e.g. SaaS, marketplace" className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" /></div>
          </div>
        </div>
        <div className="mt-5 flex justify-end"><button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><UserCheck className="size-4" />Assess Fit</button></div>
      </form>
      {result && <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[13px] font-semibold uppercase text-muted">Overall Fit</p><p className={`mt-1 text-[32px] font-bold ${result.overallScore >= 7 ? "text-success" : result.overallScore >= 5 ? "text-accent" : "text-danger"}`}>{result.overallLabel}</p></div>
            <div className="rounded-lg border border-border bg-surface px-3 py-1.5"><span className="text-[13px] font-semibold text-foreground">{result.overallScore}/10</span></div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-border"><div className={`h-2 rounded-full ${result.overallScore >= 7 ? "bg-success" : result.overallScore >= 5 ? "bg-accent" : "bg-danger"}`} style={{ width: `${result.overallScore * 10}%` }} /></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">{result.dimensions.map((d) => <div key={d.label} className="rounded-xl border border-border bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-foreground">{d.label}</span><span className="text-[15px] font-bold text-foreground">{d.score}/10</span></div><div className="mt-2 h-1.5 rounded-full bg-border"><div className="h-1.5 rounded-full bg-foreground" style={{ width: `${d.score * 10}%` }} /></div><p className="mt-2 text-[12px] leading-5 text-muted">{d.detail}</p></div>)}</div>
        {result.gaps.length > 0 && <div className="rounded-xl border border-accent-border bg-accent-light p-5"><p className="text-[13px] font-semibold uppercase text-accent-dark">Gaps to Address</p><ul className="mt-3 space-y-2">{result.gaps.map((g) => <li key={g} className="flex items-start gap-2 text-[14px] text-foreground"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />{g}</li>)}</ul></div>}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm"><p className="text-[13px] font-semibold uppercase text-muted">Recommendation</p><p className="mt-2 text-[15px] leading-6 text-foreground">{result.recommendation}</p></div>
      </div>}
    </div>
  );
}
