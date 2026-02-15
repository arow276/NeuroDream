"use client";

import { DreamEntry } from "@/types";
import { format, parseISO } from "date-fns";
import { Eye, Calendar, ArrowRight } from "lucide-react";

interface DreamTimelineProps {
  dreams: DreamEntry[];
  onViewDream: (id: string) => void;
}

const valenceColors = {
  positive: "border-emerald-500/40 bg-emerald-500/5",
  neutral: "border-blue-500/40 bg-blue-500/5",
  negative: "border-rose-500/40 bg-rose-500/5",
  mixed: "border-amber-500/40 bg-amber-500/5",
};

const valenceDotColors = {
  positive: "bg-emerald-400",
  neutral: "bg-blue-400",
  negative: "bg-rose-400",
  mixed: "bg-amber-400",
};

export default function DreamTimeline({ dreams, onViewDream }: DreamTimelineProps) {
  if (dreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
        <Calendar size={36} className="text-[var(--text-muted)] mb-3" />
        <p className="text-[var(--text-secondary)]">No dreams recorded yet. Your timeline will appear here.</p>
      </div>
    );
  }

  const grouped: Record<string, DreamEntry[]> = {};
  dreams.forEach((dream) => {
    const month = format(parseISO(dream.date), "MMMM yyyy");
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(dream);
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-[var(--text-primary)]">Dream Timeline</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{dreams.length} dreams across your journal history</p>
      </div>
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-dream-500/40 via-dream-500/20 to-transparent hidden sm:block" />
        {Object.entries(grouped).map(([month, monthDreams]) => (
          <div key={month} className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3 sm:mb-4 relative">
              <div className="w-10 h-10 rounded-full bg-dream-500/20 border border-dream-500/30 flex items-center justify-center z-10 shrink-0">
                <Calendar size={16} className="text-dream-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">{month}</h3>
              <span className="text-xs text-[var(--text-muted)]">{monthDreams.length} dream{monthDreams.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-3 sm:ml-5 sm:pl-7 sm:border-l sm:border-[var(--border-subtle)]">
              {monthDreams.map((dream) => (
                <button key={dream.id} onClick={() => onViewDream(dream.id)}
                  className={`card p-3 sm:p-4 w-full text-left transition-all hover:bg-[var(--bg-card-hover)] group relative active:scale-[0.99] ${valenceColors[dream.valence]}`}>
                  <div className={`absolute -left-[calc(1.75rem+4.5px)] top-5 w-2.5 h-2.5 rounded-full ${valenceDotColors[dream.valence]} ring-2 ring-[var(--bg-primary)] hidden sm:block`} />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-[var(--text-muted)]">{format(parseISO(dream.date), "EEE, MMM d")}</span>
                        {dream.lucidity !== "none" && (<span className="tag tag-blue text-[10px] !py-0 !px-1.5 !min-h-0"><Eye size={9} />Lucid</span>)}
                      </div>
                      <h4 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-dream-300 transition-colors">{dream.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{dream.narrative}</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {dream.emotions.slice(0, 3).map((e) => (<span key={e} className="tag text-[9px] !py-0 !px-1.5 !min-h-0">{e}</span>))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (<div key={n} className={`w-1 h-1 rounded-full ${n <= dream.sleepQuality ? "bg-neuro-400" : "bg-[var(--border-subtle)]"}`} />))}
                      </div>
                      <ArrowRight size={12} className="text-[var(--text-muted)] group-hover:text-dream-400 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
