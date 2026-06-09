"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import { generateDiscoveryQuestions } from "../lib/founder-tools";
import type { DiscoveryResult } from "../lib/founder-tools";

export function DiscoveryQuestions() {
  const [idea, setIdea] = useState(""); const [result, setResult] = useState<DiscoveryResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = idea.trim();
    if (trimmed.length < 10) return;
    const res = generateDiscoveryQuestions({ idea: trimmed });
    setResult(res);
    trackEvent("discovery_questions", { idea_length: trimmed.length });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><MessageSquare className="size-4" />Customer discovery prep</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Discovery Questions</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Generate 20 customer interview questions tailored to your idea.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Describe Your Idea</span></div>
        <textarea value={idea} onChange={(e) => { setIdea(e.target.value); setResult(null); }} placeholder="Describe what you want to build and the problem it solves..." rows={4} className="mt-4 w-full resize-y rounded-lg border border-border bg-surface p-4 text-[15px] leading-6 text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
        <div className="mt-5 flex justify-end">
          <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"><MessageSquare className="size-4" />Generate Questions</button>
        </div>
      </form>
      {result && <div className="mt-6 space-y-4">
        {result.questions.map((group) => <div key={group.category} className="rounded-xl border border-border bg-white p-5 shadow-sm"><h3 className="text-[15px] font-bold text-foreground">{group.category}</h3><ul className="mt-3 space-y-2">{group.questions.map((q, i) => <li key={i} className="flex gap-3 text-[14px] leading-6 text-foreground"><span className="mt-0.5 size-5 shrink-0 rounded-full bg-gray-100 text-center text-[11px] font-semibold leading-5 text-muted">{i + 1}</span><span>{q}</span></li>)}</ul></div>)}
        <div className="rounded-xl border border-accent-border bg-accent-light p-5"><p className="text-[13px] font-semibold uppercase text-accent-dark">Tip</p><p className="mt-2 text-[14px] leading-6 text-foreground">Record every interview. Listen for emotional language — that reveals real pain. Ask "why" five times.</p></div>
      </div>}
    </div>
  );
}
