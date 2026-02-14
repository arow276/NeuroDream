"use client";

import { useState } from "react";
import { DreamEntry, WellnessAction } from "@/types";
import { saveDream } from "@/lib/storage";
import { generateInterpretation, generateWellnessActions } from "@/lib/ai-prompts";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Brain,
  Sparkles,
  Heart,
  BookOpen,
  Eye,
  Moon,
  Sun,
  Lightbulb,
  MessageCircle,
  Activity,
  FlaskConical,
  CheckCircle2,
  Circle,
  Microscope,
  Layers,
  RefreshCw,
} from "lucide-react";

interface DreamDetailViewProps {
  dream: DreamEntry;
  allDreams: DreamEntry[];
  onBack: () => void;
  onDreamUpdated: () => void;
}

type DetailTab =
  | "interpretation"
  | "neuroscience"
  | "wellness"
  | "prompt";

export default function DreamDetailView({
  dream,
  allDreams,
  onBack,
  onDreamUpdated,
}: DreamDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("interpretation");

  const interp = dream.interpretation;

  const toggleWellnessAction = (actionId: string) => {
    if (!dream.wellnessActions) return;
    const updated = {
      ...dream,
      wellnessActions: dream.wellnessActions.map((a) =>
        a.id === actionId ? { ...a, completed: !a.completed } : a
      ),
    };
    saveDream(updated);
    onDreamUpdated();
  };

  const regenerateInterpretation = () => {
    const otherDreams = allDreams.filter((d) => d.id !== dream.id);
    const newInterp = generateInterpretation(dream, otherDreams);
    const newActions = generateWellnessActions(dream, newInterp);
    const updated = {
      ...dream,
      interpretation: newInterp,
      wellnessActions: newActions,
    };
    saveDream(updated);
    onDreamUpdated();
  };

  const tabs: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
    { key: "interpretation", label: "Interpretation", icon: <Sparkles size={15} /> },
    { key: "neuroscience", label: "Neuroscience", icon: <Brain size={15} /> },
    { key: "wellness", label: "Wellness", icon: <Heart size={15} /> },
    { key: "prompt", label: "AI Prompt", icon: <MessageCircle size={15} /> },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to journal
      </button>

      {/* Dream header card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              {format(parseISO(dream.date), "EEEE, MMMM d, yyyy")}
            </p>
            <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
              {dream.title}
            </h2>
          </div>
          <button
            onClick={regenerateInterpretation}
            className="btn btn-ghost text-xs"
            title="Re-analyze dream"
          >
            <RefreshCw size={14} />
            Re-analyze
          </button>
        </div>

        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
          {dream.narrative}
        </p>

        {/* Meta tags */}
        <div className="flex flex-wrap gap-2">
          {dream.emotions.map((e) => (
            <span key={e} className="tag text-[10px]">{e}</span>
          ))}
          {dream.themes.map((t) => (
            <span key={t} className="tag tag-green text-[10px]">{t}</span>
          ))}
          {dream.symbols.map((s) => (
            <span key={s.name} className="tag tag-amber text-[10px]">
              {s.name}
            </span>
          ))}
          {dream.lucidity !== "none" && (
            <span className="tag tag-blue text-[10px]">
              <Eye size={10} />
              {dream.lucidity === "full" ? "Lucid" : "Semi-Lucid"}
            </span>
          )}
          {dream.isRecurring && (
            <span className="tag tag-rose text-[10px]">Recurring</span>
          )}
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <MiniStat label="Sleep Quality" value={dream.sleepQuality} max={5} />
          <MiniStat label="Vividness" value={dream.vividness} max={5} />
          <MiniStat label="Emotional Intensity" value={dream.emotionalIntensity} max={5} />
          <div className="text-center">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Sleep Stage
            </p>
            <p className="text-sm font-semibold text-dream-300">
              {dream.estimatedSleepStage}
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-dream-500/20 text-dream-300 border border-dream-500/30"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {interp ? (
        <div className="animate-fade-in">
          {activeTab === "interpretation" && (
            <InterpretationPanel interpretation={interp} dream={dream} />
          )}
          {activeTab === "neuroscience" && (
            <NeurosciencePanel interpretation={interp} />
          )}
          {activeTab === "wellness" && (
            <WellnessPanel
              actions={dream.wellnessActions || []}
              onToggle={toggleWellnessAction}
            />
          )}
          {activeTab === "prompt" && (
            <PromptPanel prompt={interp.contextualPrompt} />
          )}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Brain size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)]">
            No interpretation generated yet.
          </p>
          <button
            onClick={regenerateInterpretation}
            className="btn btn-primary mt-4"
          >
            <Sparkles size={16} />
            Generate Interpretation
          </button>
        </div>
      )}
    </div>
  );
}

// ----- Tab Panels -----

function InterpretationPanel({
  interpretation,
  dream,
}: {
  interpretation: NonNullable<DreamEntry["interpretation"]>;
  dream: DreamEntry;
}) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-dream-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">Summary</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {interpretation.summary}
        </p>
      </div>

      {/* Symbolic Analysis */}
      {interpretation.symbolicAnalysis.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={16} className="text-amber-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Symbol Analysis
            </h3>
          </div>
          <div className="space-y-4">
            {interpretation.symbolicAnalysis.map((sym, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
              >
                <h4 className="font-semibold text-amber-300 text-sm mb-2">
                  {sym.symbol}
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[var(--text-muted)]">Universal meaning: </span>
                    <span className="text-[var(--text-secondary)]">
                      {sym.universalMeaning}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Personal context: </span>
                    <span className="text-[var(--text-secondary)]">
                      {sym.personalContext}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-[var(--border-subtle)]">
                    <span className="text-dream-400">Action: </span>
                    <span className="text-[var(--text-secondary)]">
                      {sym.actionableInsight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Psychological Perspectives */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-blue-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Psychological Perspectives
          </h3>
        </div>
        <div className="space-y-4">
          {interpretation.psychologicalPerspectives.map((persp, i) => (
            <div key={i} className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <h4 className="font-semibold text-blue-300 text-sm mb-2">
                {persp.school}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                {persp.interpretation}
              </p>
              <p className="text-xs text-blue-400/80 italic">
                Key insight: {persp.keyInsight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Life Connections */}
      {interpretation.lifeConnectionInsights.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-neuro-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Life Connections
            </h3>
          </div>
          <div className="space-y-3">
            {interpretation.lifeConnectionInsights.map((insight, i) => (
              <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed pl-4 border-l-2 border-neuro-500/30">
                {insight}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Reflection Questions */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={16} className="text-rose-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Questions for Reflection
          </h3>
        </div>
        <div className="space-y-2">
          {interpretation.questionsForReflection.map((q, i) => (
            <p key={i} className="text-sm text-[var(--text-secondary)] pl-4 border-l-2 border-rose-500/30 py-1">
              {q}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function NeurosciencePanel({
  interpretation,
}: {
  interpretation: NonNullable<DreamEntry["interpretation"]>;
}) {
  const neuro = interpretation.neuroscientificContext;

  return (
    <div className="space-y-6">
      {/* Sleep Stage Analysis */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Moon size={16} className="text-dream-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Sleep Stage Analysis
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {neuro.sleepStageAnalysis}
        </p>
      </div>

      {/* Brain Regions */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-dream-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Brain Regions Involved
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {neuro.brainRegionsInvolved.map((region, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
            >
              <h4 className="font-semibold text-dream-300 text-sm mb-1">
                {region.name}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                {region.role}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {region.relevance}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Neurochemical Context */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical size={16} className="text-neuro-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Neurochemical Environment
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {neuro.neurochemicalContext}
        </p>
      </div>

      {/* Memory Consolidation */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-blue-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Memory Consolidation
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {neuro.memoryConsolidation}
        </p>
      </div>

      {/* Emotional Processing */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-rose-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Emotional Processing
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {neuro.emotionalProcessing}
        </p>
      </div>

      {/* Research References */}
      {neuro.relevantResearch.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Microscope size={16} className="text-amber-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              Relevant Research
            </h3>
          </div>
          <div className="space-y-4">
            {neuro.relevantResearch.map((ref, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
              >
                <h4 className="font-semibold text-amber-300 text-sm mb-2">
                  {ref.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  {ref.finding}
                </p>
                <p className="text-xs text-neuro-400/80 italic">
                  Implication: {ref.implication}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WellnessPanel({
  actions,
  onToggle,
}: {
  actions: WellnessAction[];
  onToggle: (id: string) => void;
}) {
  const completedCount = actions.filter((a) => a.completed).length;

  const categoryColors: Record<string, string> = {
    mindfulness: "text-dream-400",
    journaling: "text-blue-400",
    physical: "text-neuro-400",
    social: "text-amber-400",
    creative: "text-rose-400",
    cognitive: "text-cyan-400",
    emotional: "text-purple-400",
    "sleep-hygiene": "text-indigo-400",
  };

  if (actions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Heart size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-[var(--text-secondary)]">
          No wellness actions generated for this dream.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-secondary)]">
            Progress
          </span>
          <span className="text-sm text-[var(--text-primary)] font-semibold">
            {completedCount}/{actions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neuro-500 to-dream-500 rounded-full transition-all"
            style={{
              width: `${actions.length > 0 ? (completedCount / actions.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onToggle(action.id)}
            className={`card p-4 w-full text-left transition-all ${
              action.completed
                ? "opacity-60 border-neuro-500/30"
                : "hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {action.completed ? (
                  <CheckCircle2 size={20} className="text-neuro-400" />
                ) : (
                  <Circle size={20} className="text-[var(--text-muted)]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`font-semibold text-sm ${
                      action.completed
                        ? "line-through text-[var(--text-muted)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {action.title}
                  </h4>
                  <span
                    className={`text-[10px] uppercase tracking-wider ${
                      categoryColors[action.category] || "text-[var(--text-muted)]"
                    }`}
                  >
                    {action.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PromptPanel({ prompt }: { prompt: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={16} className="text-dream-400" />
        <h3 className="font-semibold text-[var(--text-primary)]">
          Context-Aware AI Prompt
        </h3>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-4">
        This is the prompt that was built from your dream data, life context,
        sleep information, and dream history. In production, this would be sent
        to an AI model for interpretation. The current analysis was generated
        using NeuroDream&apos;s built-in knowledge base.
      </p>
      <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-subtle)] max-h-[500px] overflow-auto leading-relaxed">
        {prompt}
      </pre>
    </div>
  );
}

// ----- Shared -----

function MiniStat({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex justify-center gap-1">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < value ? "bg-dream-400" : "bg-[var(--border-subtle)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
