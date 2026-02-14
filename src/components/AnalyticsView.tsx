"use client";

import { useMemo } from "react";
import { DreamEntry } from "@/types";
import { computeAnalytics } from "@/lib/analytics";
import {
  Moon,
  Brain,
  Eye,
  Heart,
  TrendingUp,
  BarChart3,
  Sparkles,
  Activity,
} from "lucide-react";

interface AnalyticsViewProps {
  dreams: DreamEntry[];
}

export default function AnalyticsView({ dreams }: AnalyticsViewProps) {
  const analytics = useMemo(() => computeAnalytics(dreams), [dreams]);

  if (dreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
        <BarChart3 size={36} className="text-[var(--text-muted)] mb-3" />
        <p className="text-[var(--text-secondary)]">
          Record some dreams to see your analytics and patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
          Dream Insights & Analytics
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Patterns and trends across {analytics.totalDreams} recorded dreams
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Dreams"
          value={analytics.totalDreams.toString()}
          icon={<Moon size={16} className="text-dream-400" />}
        />
        <StatCard
          label="Avg Sleep Quality"
          value={analytics.averageSleepQuality.toFixed(1)}
          icon={<Sparkles size={16} className="text-neuro-400" />}
          suffix="/5"
        />
        <StatCard
          label="Avg Vividness"
          value={analytics.averageVividness.toFixed(1)}
          icon={<Eye size={16} className="text-blue-400" />}
          suffix="/5"
        />
        <StatCard
          label="Wellness Rate"
          value={Math.round(analytics.wellnessCompletionRate * 100).toString()}
          icon={<Heart size={16} className="text-rose-400" />}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotional Valence Distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-dream-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Dream Emotional Tone
            </h3>
          </div>
          <div className="space-y-3">
            <ValenceBar
              label="Positive"
              count={analytics.dreamsByValence.positive}
              total={analytics.totalDreams}
              color="bg-emerald-500"
            />
            <ValenceBar
              label="Neutral"
              count={analytics.dreamsByValence.neutral}
              total={analytics.totalDreams}
              color="bg-blue-500"
            />
            <ValenceBar
              label="Negative"
              count={analytics.dreamsByValence.negative}
              total={analytics.totalDreams}
              color="bg-rose-500"
            />
            <ValenceBar
              label="Mixed"
              count={analytics.dreamsByValence.mixed}
              total={analytics.totalDreams}
              color="bg-amber-500"
            />
          </div>
        </div>

        {/* Lucidity Distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-blue-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Lucidity Levels
            </h3>
          </div>
          <div className="space-y-3">
            <ValenceBar
              label="Not Lucid"
              count={analytics.dreamsByLucidity.none}
              total={analytics.totalDreams}
              color="bg-slate-500"
            />
            <ValenceBar
              label="Partially Lucid"
              count={analytics.dreamsByLucidity.partial}
              total={analytics.totalDreams}
              color="bg-blue-400"
            />
            <ValenceBar
              label="Fully Lucid"
              count={analytics.dreamsByLucidity.full}
              total={analytics.totalDreams}
              color="bg-cyan-400"
            />
          </div>
        </div>

        {/* Top Emotions */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} className="text-rose-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Most Common Emotions
            </h3>
          </div>
          {analytics.mostCommonEmotions.length > 0 ? (
            <div className="space-y-2">
              {analytics.mostCommonEmotions.slice(0, 8).map((emotion, i) => (
                <div key={emotion.name} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)] w-4 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {emotion.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {emotion.count}x
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-dream-500 rounded-full"
                        style={{
                          width: `${(emotion.count / (analytics.mostCommonEmotions[0]?.count || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No data yet</p>
          )}
        </div>

        {/* Top Themes */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-neuro-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Most Common Themes
            </h3>
          </div>
          {analytics.mostCommonThemes.length > 0 ? (
            <div className="space-y-2">
              {analytics.mostCommonThemes.slice(0, 8).map((theme, i) => (
                <div key={theme.name} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)] w-4 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {theme.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {theme.count}x
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neuro-500 to-emerald-400 rounded-full"
                        style={{
                          width: `${(theme.count / (analytics.mostCommonThemes[0]?.count || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No data yet</p>
          )}
        </div>

        {/* Top Symbols */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Most Common Symbols
            </h3>
          </div>
          {analytics.mostCommonSymbols.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analytics.mostCommonSymbols.map((sym) => (
                <span
                  key={sym.name}
                  className="tag tag-amber"
                  style={{ fontSize: `${Math.min(14, 10 + sym.count * 1.5)}px` }}
                >
                  {sym.name}
                  <span className="opacity-50 ml-1">({sym.count})</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No data yet</p>
          )}
        </div>

        {/* Sleep Quality Over Time */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-dream-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Sleep Quality Trend
            </h3>
          </div>
          {analytics.sleepQualityOverTime.length > 1 ? (
            <div className="h-32 flex items-end gap-1">
              {analytics.sleepQualityOverTime.map((entry, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-gradient-to-t from-dream-600 to-dream-400 rounded-t-sm min-h-[4px] transition-all"
                    style={{ height: `${(entry.quality / 5) * 100}%` }}
                    title={`${entry.date}: ${entry.quality}/5`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Need more data to show trends
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  suffix,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  suffix?: string;
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
        {suffix && (
          <span className="text-sm text-[var(--text-muted)] ml-0.5">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function ValenceBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {count} ({Math.round(pct)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
