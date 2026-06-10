"use client";

import { Clock, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { AnalysisReport } from "../lib/types";

const STORAGE_KEY = "sos-recent-reports";
const MAX_REPORTS = 6;

function loadReports(): AnalysisReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as AnalysisReport[] : [];
  } catch {
    return [];
  }
}

function saveReports(reports: AnalysisReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    /* storage full — silently ignore */
  }
}

export function saveReport(report: AnalysisReport) {
  const reports = loadReports().filter((r) => r.id !== report.id);
  reports.unshift(report);
  saveReports(reports.slice(0, MAX_REPORTS));
}

type Props = {
  onSelect: (report: AnalysisReport) => void;
};

export function RecentReports({ onSelect }: Props) {
  const [reports, setReports] = useState<AnalysisReport[]>([]);

  const refresh = useCallback(() => {
    setReports(loadReports());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    setReports([]);
  }

  if (reports.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border bg-white px-3 py-4 shadow-sm sm:px-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-foreground">Recent analyses</span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-muted transition hover:text-danger"
          >
            <Trash2 className="size-3" aria-hidden="true" />
            Clear
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {reports.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect(r)}
              className="group flex shrink-0 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition hover:border-foreground/30 hover:bg-white"
            >
              <div className="min-w-0 max-w-[180px]">
                <p className="truncate text-[13px] font-semibold text-foreground">{r.idea}</p>
                <span
                  className={`text-[12px] font-medium ${
                    r.decision === "SHIP"
                      ? "text-success"
                      : r.decision === "VALIDATE MORE"
                        ? "text-accent-dark"
                        : "text-danger"
                  }`}
                >
                  {r.score}/100 — {r.decision}
                </span>
              </div>
              <RotateCcw className="size-3.5 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
