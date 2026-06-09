"use client";

import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "../lib/analytics-client";
import type { JournalEntry } from "../lib/solo-founders";

function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("shiporskip_journal");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem("shiporskip_journal", JSON.stringify(entries));
  } catch {}
}

export function IdeaJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [ideaName, setIdeaName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  function addEntry() {
    const trimmedIdea = ideaName.trim();
    const trimmedNote = note.trim();
    if (!trimmedIdea || !trimmedNote) return;

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      ideaName: trimmedIdea,
      note: trimmedNote,
      createdAt: new Date().toISOString(),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setIdeaName("");
    setNote("");

    trackEvent("journal_entry_added", { ideaName: trimmedIdea });
  }

  function deleteEntry(id: string) {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  }

  function clearAll() {
    setEntries([]);
    saveEntries([]);
    trackEvent("journal_cleared");
  }

  const grouped = entries.reduce<Record<string, JournalEntry[]>>((acc, entry) => {
    if (!acc[entry.ideaName]) acc[entry.ideaName] = [];
    acc[entry.ideaName].push(entry);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-medium text-gray-600">
        <BookOpen className="size-4 text-gray-700" aria-hidden="true" />
        Day-to-day idea tracking
      </div>

      <h1 className="text-[40px] font-semibold leading-[1.05] text-gray-950 md:text-[48px]">
        Idea Journal
      </h1>
      <p className="mt-4 text-[15px] leading-6 text-gray-600">
        Track how your thinking evolves. Add notes per idea and watch your conviction change over time.
      </p>

      <div className="mt-8 rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <span className="text-[13px] font-semibold uppercase text-gray-500">New Note</span>
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={ideaName}
            onChange={(e) => setIdeaName(e.target.value)}
            placeholder="Idea name (e.g. AI expense tracker)"
            className="w-full rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What are you thinking about this idea today?"
            rows={3}
            className="w-full resize-y rounded-[8px] border border-gray-200 bg-gray-50 p-3 text-[15px] leading-6 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addEntry}
              disabled={!ideaName.trim() || !note.trim()}
              className="inline-flex min-h-10 items-center gap-2 rounded-[8px] bg-gray-950 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add Note
            </button>
          </div>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[13px] font-medium text-gray-500">
            {entries.length} {entries.length === 1 ? "note" : "notes"} across{" "}
            {Object.keys(grouped).length} {Object.keys(grouped).length === 1 ? "idea" : "ideas"}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="text-[13px] font-medium text-red-500 transition hover:text-red-700"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {Object.entries(grouped).map(([idea, ideaEntries]) => (
          <div key={idea} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-[15px] font-semibold text-gray-950">{idea}</h3>
            <div className="mt-3 space-y-2">
              {ideaEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-[8px] border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-5 text-gray-700">{entry.note}</p>
                    <p className="mt-1 text-[11px] font-medium text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                    className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete note"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="mt-12 text-center">
          <BookOpen className="mx-auto size-12 text-gray-300" aria-hidden="true" />
          <p className="mt-4 text-[15px] font-medium text-gray-500">No notes yet</p>
          <p className="mt-1 text-[13px] text-gray-400">
            Start tracking your thinking above — everything is saved to your browser.
          </p>
        </div>
      )}
    </div>
  );
}
