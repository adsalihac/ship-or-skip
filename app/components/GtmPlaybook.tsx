"use client";

import { Rocket, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { generateGtm } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import type { GtmResult } from "../lib/founder-tools";

export function GtmPlaybook() {
  const [idea, setIdea] = useState(""); const [customer, setCustomer] = useState("");
  const [result, setResult] = useState<GtmResult | null>(null); const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    startTransition(async () => {
      trackEvent("gtm_playbook", { idea_length: idea.length });
      const res = await generateGtm({ idea: idea.trim(), targetCustomer: customer.trim() });
      if (!res.ok) { setError(res.error); return; }
      setResult(res.report);
    });
  }

  const effortColors = { Low: "text-success", Medium: "text-accent", High: "text-danger" };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><Rocket className="size-4" />Launch strategy</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">GTM Playbook</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Get a channel-by-channel go-to-market plan tailored to your idea and target customer.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Your Product</span></div>
        <div className="mt-4 space-y-3">
          <textarea value={idea} onChange={(e) => { setIdea(e.target.value); setResult(null); }} placeholder="Describe what you&apos;re building..." rows={3} className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-[15px] leading-6 text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
          <input type="text" value={customer} onChange={(e) => { setCustomer(e.target.value); setResult(null); }} placeholder="Who is your target customer? (e.g. freelance designers, B2B sales teams)" className="w-full rounded-lg border border-border bg-surface p-3 text-[15px] text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />
        </div>
        {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:bg-muted/40 sm:w-auto">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />} Generate Playbook
          </button>
        </div>
      </form>
      {result && <div className="mt-6 space-y-4">
        {result.channels.map((ch) => <div key={ch.channel} className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4"><h3 className="text-[15px] font-bold text-foreground">{ch.channel}</h3><div className="flex gap-3"><span className={`text-[12px] font-medium ${effortColors[ch.effort]}`}>Effort: {ch.effort}</span><span className={`text-[12px] font-medium ${effortColors[ch.expectedImpact]}`}>Impact: {ch.expectedImpact}</span></div></div>
          <ul className="mt-3 space-y-1.5">{ch.tactics.map((t) => <li key={t} className="flex items-start gap-2 text-[14px] text-muted"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />{t}</li>)}</ul>
        </div>)}
        <div className="rounded-xl border border-accent-border bg-accent-light p-5"><p className="text-[13px] font-semibold uppercase text-accent-dark">Recommended Focus</p><p className="mt-2 text-[15px] leading-6 text-foreground">{result.recommendation}</p></div>
      </div>}
    </div>
  );
}
