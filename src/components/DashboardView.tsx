"use client";

import { DreamEntry } from "@/types";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import {
  Moon,
  Sun,
  Cloud,
  Zap,
  Eye,
  Heart,
  Plus,
  ArrowRight,
  Sparkles,
  Brain,
  BookOpen,
  PenLine,
} from "lucide-react";

interface DashboardViewProps {
  dreams: DreamEntry[];
  onViewDream: (id: string) => void;
  onNewDream: () => void;
}

const valenceColors = {
  positive: "text-emerald-400",
  neutral: "text-blue-400",
  negative: "text-rose-400",
  mixed: "text-amber-400",
};

const valenceIcons = {
  positive: <Sun size={14} />,
  neutral: <Cloud size={14} />,
  negative: <Moon size={14} />,
  mixed: <Zap size={14} />,
};

function formatDreamDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

export default function DashboardView({
  dreams,
  onViewDream,
  onNewDream,
}: DashboardViewProps) {
  if (dreams.length === 0) {
    return <EmptyState onNewDream={onNewDream} />;
  }

  const recentDreams = dreams.slice(0, 10);
  const hasInterpretations = dreams.some((d) => d.interpretation);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
            Your Dream Journal
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">
            {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded
            {dreams.length >= 3 && " — patterns are emerging"}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Dreams"
          value={dreams.length.toString()}
          icon={<Moon size={16} className="text-dream-400" />}
        />
        <StatCard
          label="Avg Sleep Quality"
          value={
            (
              dreams.reduce((s, d) => s + d.sleepQuality, 0) / dreams.length
            ).toFixed(1)
          }
          icon={<Sparkles size={16} className="text-neuro-400" />}
        />
        <StatCard
          label="Lucid Dreams"
          value={dreams.filter((d) => d.lucidity !== "none").length.toString()}
          icon={<Eye size={16} className="text-blue-400" />}
        />
        <StatCard
          label="Wellness Actions"
          value={dreams
            .reduce(
              (s, d) =>
                s + (d.wellnessActions?.filter((a) => a.completed).length || 0),
              0
            )
            .toString()}
          icon={<Heart size={16} className="text-rose-400" />}
        />
      </div>

      {/* Recent dreams */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-dream-400" />
          Recent Dreams
        </h3>
        <div className="space-y-3">
          {recentDreams.map((dream, i) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onClick={() => onViewDream(dream.id)}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function DreamCard({
  dream,
  onClick,
  index,
}: {
  dream: DreamEntry;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      onClick={onClick}
      className="card p-4 w-full text-left hover:bg-[var(--bg-card-hover)] transition-all group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-xs text-[var(--text-muted)]">
              {formatDreamDate(dream.date)}
            </span>
            <span
              className={`flex items-center gap-1 text-xs ${valenceColors[dream.valence]}`}
            >
              {valenceIcons[dream.valence]}
              {dream.valence}
            </span>
            {dream.lucidity !== "none" && (
              <span className="tag-blue tag text-[10px]">
                <Eye size={10} />
                {dream.lucidity === "full" ? "Lucid" : "Semi-Lucid"}
              </span>
            )}
            {dream.isRecurring && (
              <span className="tag-amber tag text-[10px]">Recurring</span>
            )}
          </div>

          <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-dream-300 transition-colors truncate">
            {dream.title}
          </h4>

          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
            {dream.narrative}
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {dream.emotions.slice(0, 3).map((emotion) => (
              <span key={emotion} className="tag text-[10px]">
                {emotion}
              </span>
            ))}
            {dream.themes.slice(0, 2).map((theme) => (
              <span key={theme} className="tag tag-green text-[10px]">
                {theme}
              </span>
            ))}
            {dream.interpretation && (
              <span className="tag tag-blue text-[10px]">
                <Brain size={10} />
                Interpreted
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-1.5 h-1.5 rounded-full ${
                  n <= dream.vividness
                    ? "bg-dream-400"
                    : "bg-[var(--border-subtle)]"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">vivid</span>

          <ArrowRight
            size={14}
            className="text-[var(--text-muted)] group-hover:text-dream-400 mt-2 transition-colors"
          />
        </div>
      </div>
    </button>
  );
}

function EmptyState({ onNewDream }: { onNewDream: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-dream-500/20 to-dream-700/20 border border-dream-500/30 flex items-center justify-center mb-6">
        <Moon size={36} className="text-dream-400" />
      </div>

      <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-2">
        Welcome to NeuroDream
      </h2>
      <p className="text-[var(--text-secondary)] text-center max-w-md mb-2">
        Your dream wellness journal — where neuroscience meets dream
        interpretation to enhance your waking life.
      </p>
      <p className="text-[var(--text-muted)] text-sm text-center max-w-sm mb-8">
        Record your dreams, receive context-aware interpretations backed by
        neuroscience, and discover actionable wellness insights.
      </p>

      <button onClick={onNewDream} className="btn btn-primary text-base px-8 py-3">
        <PenLine size={18} />
        Record Your First Dream
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl">
        <FeatureCard
          icon={<Brain size={20} className="text-dream-400" />}
          title="Neuroscience-Backed"
          description="Understand which brain regions and neurochemicals shaped your dream experience"
        />
        <FeatureCard
          icon={<Sparkles size={20} className="text-neuro-400" />}
          title="Context-Aware AI"
          description="Interpretations that consider your life context, stressors, and dream history"
        />
        <FeatureCard
          icon={<Heart size={20} className="text-rose-400" />}
          title="Wellness Integration"
          description="Concrete daily actions to bridge dream insights into your waking life"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-4 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
