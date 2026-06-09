"use client";

import { GitCompare, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { analyzeIdea } from "../actions";
import { trackEvent } from "../lib/analytics-client";
import { ReportView } from "./ReportView";

export function IdeaComparison() {
  const [ideas, setIdeas] = useState(["", "", ""]);
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function setIdea(i: number, v: string) { const n = [...ideas]; n[i] = v; setIdeas(n); setReports([]); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const valid = ideas.filter((i) => i.trim().length >= 12);
    if (valid.length < 2) { setError("Enter at least 2 ideas with enough detail (12+ chars each)."); return; }
    startTransition(async () => {
      trackEvent("idea_comparison", { count: valid.length });
      const results = await Promise.all(valid.map((idea) => analyzeIdea(idea)));
      const failed = results.find((r) => !r.ok);
      if (failed && !failed.ok) { setError(failed.error); return; }
      setReports(results.map((r) => (r as any).report));
    });
  }

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-foreground"><GitCompare className="size-4" />Head-to-head</div>
      <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]">Idea Comparison</h1>
      <p className="mt-4 text-[15px] leading-6 text-muted">Compare 2–3 ideas side-by-side across all analysis dimensions.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3"><span className="text-[13px] font-semibold uppercase text-muted">Ideas to Compare</span></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">{ideas.map((idea, i) => <textarea key={i} value={idea} onChange={(e) => setIdea(i, e.target.value)} placeholder={`Idea ${i + 1}...`} rows={5} className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-[14px] leading-5 text-foreground outline-none transition placeholder:text-muted/60 focus:border-foreground focus:bg-white" />)}</div>
        {error && <p className="mt-3 text-[13px] font-medium text-danger">{error}</p>}
        <div className="mt-4 flex justify-end"><button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:bg-muted/40 sm:w-auto">{isPending ? <Loader2 className="size-4 animate-spin" /> : <GitCompare className="size-4" />} Compare Ideas</button></div>
      </form>
      {reports.length > 0 && <div className="mt-8 space-y-8">{reports.map((report, i) => <div key={report.id}><h2 className="mb-4 text-[18px] font-bold text-foreground">Idea {i + 1}</h2><ReportView report={report} compact /></div>)}</div>}
    </div>
  );
}
