"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DreamEntry,
  DreamSymbol,
  SymbolCategory,
  MoodRating,
  SleepQuality,
  Lucidity,
  DreamValence,
  SleepStage,
} from "@/types";
import { saveDream } from "@/lib/storage";
import { generateInterpretation, generateWellnessActions } from "@/lib/ai-prompts";
import {
  Moon,
  Sun,
  Sparkles,
  Brain,
  Heart,
  Tag,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  Smile,
  Meh,
  Frown,
  Zap,
} from "lucide-react";

interface NewDreamEntryProps {
  onSaved: () => void;
  onCancel: () => void;
  existingDreams: DreamEntry[];
}

const EMOTIONS = [
  "Joy", "Fear", "Anxiety", "Peace", "Confusion", "Wonder",
  "Sadness", "Anger", "Love", "Excitement", "Nostalgia", "Curiosity",
  "Frustration", "Awe", "Vulnerability", "Empowerment", "Loneliness",
  "Connection", "Urgency", "Calm",
];

const THEMES = [
  "Transformation", "Loss", "Discovery", "Pursuit", "Escape",
  "Connection", "Isolation", "Growth", "Conflict", "Healing",
  "Journey", "Mystery", "Power", "Freedom", "Identity",
  "Home", "Nature", "Technology", "Spirituality", "Creativity",
];

const SYMBOL_CATEGORIES: { value: SymbolCategory; label: string }[] = [
  { value: "person", label: "Person" },
  { value: "place", label: "Place" },
  { value: "animal", label: "Animal" },
  { value: "object", label: "Object" },
  { value: "action", label: "Action" },
  { value: "emotion", label: "Emotion" },
  { value: "nature", label: "Nature" },
  { value: "body", label: "Body" },
  { value: "abstract", label: "Abstract" },
];

export default function NewDreamEntry({
  onSaved,
  onCancel,
  existingDreams,
}: NewDreamEntryProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [title, setTitle] = useState("");
  const [narrative, setNarrative] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [symbols, setSymbols] = useState<DreamSymbol[]>([]);
  const [newSymbolName, setNewSymbolName] = useState("");
  const [newSymbolCategory, setNewSymbolCategory] = useState<SymbolCategory>("object");

  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(3);
  const [bedTime, setBedTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepStage, setSleepStage] = useState<SleepStage>("REM");
  const [lucidity, setLucidity] = useState<Lucidity>("none");
  const [vividness, setVividness] = useState<MoodRating>(3);
  const [emotionalIntensity, setEmotionalIntensity] = useState<MoodRating>(3);
  const [valence, setValence] = useState<DreamValence>("neutral");
  const [isRecurring, setIsRecurring] = useState(false);

  const [lifeContext, setLifeContext] = useState("");
  const [stressorInput, setStressorInput] = useState("");
  const [currentStressors, setCurrentStressors] = useState<string[]>([]);
  const [eventInput, setEventInput] = useState("");
  const [recentEvents, setRecentEvents] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  const toggleItem = (
    item: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const addSymbol = () => {
    if (!newSymbolName.trim()) return;
    setSymbols([
      ...symbols,
      { name: newSymbolName.trim(), category: newSymbolCategory },
    ]);
    setNewSymbolName("");
  };

  const removeSymbol = (index: number) => {
    setSymbols(symbols.filter((_, i) => i !== index));
  };

  const addStressor = () => {
    if (!stressorInput.trim()) return;
    setCurrentStressors([...currentStressors, stressorInput.trim()]);
    setStressorInput("");
  };

  const addEvent = () => {
    if (!eventInput.trim()) return;
    setRecentEvents([...recentEvents, eventInput.trim()]);
    setEventInput("");
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return title.trim().length > 0 && narrative.trim().length > 0;
      case 2:
        return selectedEmotions.length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSave = () => {
    setSaving(true);

    const dream: DreamEntry = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date,
      title: title.trim(),
      narrative: narrative.trim(),
      symbols,
      themes: selectedThemes,
      emotions: selectedEmotions,
      sleepQuality,
      bedTime,
      wakeTime,
      estimatedSleepStage: sleepStage,
      lucidity,
      vividness,
      emotionalIntensity,
      valence,
      lifeContext: lifeContext.trim(),
      currentStressors,
      recentEvents,
      isRecurring,
      tags: [...selectedThemes, ...selectedEmotions],
    };

    const interpretation = generateInterpretation(dream, existingDreams);
    dream.interpretation = interpretation;

    const wellnessActions = generateWellnessActions(dream, interpretation);
    dream.wellnessActions = wellnessActions;

    saveDream(dream);

    setTimeout(() => {
      setSaving(false);
      onSaved();
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-[var(--text-primary)]">
            Record a Dream
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Step {step} of {totalSteps}
          </p>
        </div>
        <button onClick={onCancel} className="btn btn-ghost text-sm">
          Cancel
        </button>
      </div>

      <div className="flex gap-2 mb-6 sm:mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 sm:h-1 flex-1 rounded-full transition-all ${
              i < step
                ? "bg-dream-500"
                : i === step - 1
                ? "bg-dream-400"
                : "bg-[var(--border-subtle)]"
            }`}
          />
        ))}
      </div>

      <div className="card p-4 sm:p-6">
        {step === 1 && (
          <Step1_DreamContent
            title={title} setTitle={setTitle}
            narrative={narrative} setNarrative={setNarrative}
            date={date} setDate={setDate}
          />
        )}
        {step === 2 && (
          <Step2_EmotionsAndSymbols
            selectedEmotions={selectedEmotions}
            toggleEmotion={(e) => toggleItem(e, selectedEmotions, setSelectedEmotions)}
            selectedThemes={selectedThemes}
            toggleTheme={(t) => toggleItem(t, selectedThemes, setSelectedThemes)}
            symbols={symbols}
            newSymbolName={newSymbolName} setNewSymbolName={setNewSymbolName}
            newSymbolCategory={newSymbolCategory} setNewSymbolCategory={setNewSymbolCategory}
            addSymbol={addSymbol} removeSymbol={removeSymbol}
          />
        )}
        {step === 3 && (
          <Step3_SleepContext
            sleepQuality={sleepQuality} setSleepQuality={setSleepQuality}
            bedTime={bedTime} setBedTime={setBedTime}
            wakeTime={wakeTime} setWakeTime={setWakeTime}
            sleepStage={sleepStage} setSleepStage={setSleepStage}
            lucidity={lucidity} setLucidity={setLucidity}
            vividness={vividness} setVividness={setVividness}
            emotionalIntensity={emotionalIntensity} setEmotionalIntensity={setEmotionalIntensity}
            valence={valence} setValence={setValence}
            isRecurring={isRecurring} setIsRecurring={setIsRecurring}
          />
        )}
        {step === 4 && (
          <Step4_LifeContext
            lifeContext={lifeContext} setLifeContext={setLifeContext}
            stressorInput={stressorInput} setStressorInput={setStressorInput}
            currentStressors={currentStressors} addStressor={addStressor}
            removeStressor={(i) => setCurrentStressors(currentStressors.filter((_, idx) => idx !== i))}
            eventInput={eventInput} setEventInput={setEventInput}
            recentEvents={recentEvents} addEvent={addEvent}
            removeEvent={(i) => setRecentEvents(recentEvents.filter((_, idx) => idx !== i))}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-4 sm:mt-6">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`btn btn-secondary ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Save & Interpret
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Step1_DreamContent({ title, setTitle, narrative, setNarrative, date, setDate }: {
  title: string; setTitle: (v: string) => void;
  narrative: string; setNarrative: (v: string) => void;
  date: string; setDate: (v: string) => void;
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Moon size={18} className="text-dream-400" />
        <h3 className="font-semibold text-[var(--text-primary)]">What did you dream?</h3>
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Date of dream</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="sm:max-w-[200px]" />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Dream title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your dream a title..." autoFocus />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Dream narrative</label>
        <textarea
          value={narrative} onChange={(e) => setNarrative(e.target.value)}
          placeholder="Describe your dream in as much detail as you can remember..."
          rows={6} className="min-h-[140px] sm:min-h-[200px]"
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">The more detail you provide, the richer your interpretation will be.</p>
      </div>
    </div>
  );
}

function Step2_EmotionsAndSymbols({ selectedEmotions, toggleEmotion, selectedThemes, toggleTheme, symbols, newSymbolName, setNewSymbolName, newSymbolCategory, setNewSymbolCategory, addSymbol, removeSymbol }: {
  selectedEmotions: string[]; toggleEmotion: (e: string) => void;
  selectedThemes: string[]; toggleTheme: (t: string) => void;
  symbols: DreamSymbol[]; newSymbolName: string; setNewSymbolName: (v: string) => void;
  newSymbolCategory: SymbolCategory; setNewSymbolCategory: (v: SymbolCategory) => void;
  addSymbol: () => void; removeSymbol: (i: number) => void;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Heart size={18} className="text-rose-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">Emotions felt in the dream</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((emotion) => (
            <button key={emotion} onClick={() => toggleEmotion(emotion)}
              className={`tag cursor-pointer transition-all ${selectedEmotions.includes(emotion) ? "!bg-dream-500/30 !text-dream-300 !border-dream-500/50" : "hover:border-[var(--border-accent)]"}`}
            >{emotion}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag size={18} className="text-neuro-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">Dream themes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <button key={theme} onClick={() => toggleTheme(theme)}
              className={`tag tag-green cursor-pointer transition-all ${selectedThemes.includes(theme) ? "!bg-neuro-500/30 !text-neuro-300 !border-neuro-500/50" : "hover:border-neuro-400/40"}`}
            >{theme}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-amber-400" />
          <h3 className="font-semibold text-[var(--text-primary)]">Key symbols</h3>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">People, places, objects, animals that appeared</p>
        {symbols.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {symbols.map((sym, i) => (
              <span key={i} className="tag tag-amber flex items-center gap-1">
                {sym.name} <span className="text-[10px] opacity-60">({sym.category})</span>
                <button onClick={() => removeSymbol(i)} className="ml-1 hover:text-rose-400 p-0.5"><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={newSymbolName} onChange={(e) => setNewSymbolName(e.target.value)}
            placeholder="Symbol name..." className="flex-1" onKeyDown={(e) => e.key === "Enter" && addSymbol()} />
          <div className="flex gap-2">
            <select value={newSymbolCategory} onChange={(e) => setNewSymbolCategory(e.target.value as SymbolCategory)} className="flex-1 sm:w-32 sm:flex-none">
              {SYMBOL_CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
            </select>
            <button onClick={addSymbol} className="btn btn-secondary shrink-0"><Plus size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3_SleepContext({ sleepQuality, setSleepQuality, bedTime, setBedTime, wakeTime, setWakeTime, sleepStage, setSleepStage, lucidity, setLucidity, vividness, setVividness, emotionalIntensity, setEmotionalIntensity, valence, setValence, isRecurring, setIsRecurring }: {
  sleepQuality: SleepQuality; setSleepQuality: (v: SleepQuality) => void;
  bedTime: string; setBedTime: (v: string) => void;
  wakeTime: string; setWakeTime: (v: string) => void;
  sleepStage: SleepStage; setSleepStage: (v: SleepStage) => void;
  lucidity: Lucidity; setLucidity: (v: Lucidity) => void;
  vividness: MoodRating; setVividness: (v: MoodRating) => void;
  emotionalIntensity: MoodRating; setEmotionalIntensity: (v: MoodRating) => void;
  valence: DreamValence; setValence: (v: DreamValence) => void;
  isRecurring: boolean; setIsRecurring: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Brain size={18} className="text-dream-400" />
        <h3 className="font-semibold text-[var(--text-primary)]">Sleep & Dream Context</h3>
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Sleep quality</label>
        <RatingSelector value={sleepQuality} onChange={(v) => setSleepQuality(v as SleepQuality)} labels={["Poor", "Below avg", "Average", "Good", "Excellent"]} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5"><Moon size={14} className="inline mr-1" />Bedtime</label>
          <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5"><Sun size={14} className="inline mr-1" />Wake time</label>
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Estimated sleep stage</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["N1", "N2", "N3", "REM"] as SleepStage[]).map((stage) => (
            <button key={stage} onClick={() => setSleepStage(stage)}
              className={`p-3 rounded-xl border text-sm text-center transition-all ${sleepStage === stage ? "border-dream-500 bg-dream-500/20 text-dream-300" : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"}`}
            >
              <div className="font-semibold">{stage}</div>
              <div className="text-[10px] mt-0.5 opacity-70">{stage === "N1" ? "Falling asleep" : stage === "N2" ? "Light sleep" : stage === "N3" ? "Deep sleep" : "Dreaming"}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2"><Eye size={14} className="inline mr-1" />Lucidity</label>
        <div className="grid grid-cols-3 gap-2">
          {(["none", "partial", "full"] as Lucidity[]).map((luc) => (
            <button key={luc} onClick={() => setLucidity(luc)}
              className={`p-2.5 rounded-xl border text-sm text-center transition-all ${lucidity === luc ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"}`}
            >{luc === "none" ? "Not lucid" : luc === "partial" ? "Partially" : "Fully lucid"}</button>
          ))}
        </div>
      </div>
      <div className="space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Vividness</label>
          <RatingSelector value={vividness} onChange={(v) => setVividness(v as MoodRating)} labels={["Faint", "Dim", "Clear", "Vivid", "Hyper-vivid"]} />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Emotional intensity</label>
          <RatingSelector value={emotionalIntensity} onChange={(v) => setEmotionalIntensity(v as MoodRating)} labels={["Mild", "Low", "Moderate", "Intense", "Overwhelming"]} />
        </div>
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Overall emotional tone</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {([
            { v: "positive", icon: <Smile size={16} />, color: "emerald" },
            { v: "neutral", icon: <Meh size={16} />, color: "blue" },
            { v: "negative", icon: <Frown size={16} />, color: "rose" },
            { v: "mixed", icon: <Zap size={16} />, color: "amber" },
          ] as const).map(({ v, icon, color }) => (
            <button key={v} onClick={() => setValence(v)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm transition-all ${valence === v ? `border-${color}-500 bg-${color}-500/20 text-${color}-300` : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"}`}
            >{icon}{v.charAt(0).toUpperCase() + v.slice(1)}</button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="w-5 h-5 accent-dream-500" />
        <span className="text-sm text-[var(--text-secondary)]">This is a recurring dream</span>
      </label>
    </div>
  );
}

function Step4_LifeContext({ lifeContext, setLifeContext, stressorInput, setStressorInput, currentStressors, addStressor, removeStressor, eventInput, setEventInput, recentEvents, addEvent, removeEvent }: {
  lifeContext: string; setLifeContext: (v: string) => void;
  stressorInput: string; setStressorInput: (v: string) => void;
  currentStressors: string[]; addStressor: () => void; removeStressor: (i: number) => void;
  eventInput: string; setEventInput: (v: string) => void;
  recentEvents: string[]; addEvent: () => void; removeEvent: (i: number) => void;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Sun size={18} className="text-amber-400" />
        <h3 className="font-semibold text-[var(--text-primary)]">Waking Life Context</h3>
      </div>
      <p className="text-sm text-[var(--text-muted)] -mt-3">This helps generate more personalized, context-aware interpretations. All fields are optional.</p>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">What&apos;s going on in your life right now?</label>
        <textarea value={lifeContext} onChange={(e) => setLifeContext(e.target.value)} placeholder="Briefly describe your current life situation..." rows={3} />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Current stressors</label>
        {currentStressors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {currentStressors.map((s, i) => (
              <span key={i} className="tag tag-rose flex items-center gap-1">{s}
                <button onClick={() => removeStressor(i)} className="hover:text-white p-0.5"><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input type="text" value={stressorInput} onChange={(e) => setStressorInput(e.target.value)} placeholder="Add a stressor..." onKeyDown={(e) => e.key === "Enter" && addStressor()} />
          <button onClick={addStressor} className="btn btn-secondary shrink-0"><Plus size={14} /></button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Recent notable events</label>
        {recentEvents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {recentEvents.map((e, i) => (
              <span key={i} className="tag tag-blue flex items-center gap-1">{e}
                <button onClick={() => removeEvent(i)} className="hover:text-white p-0.5"><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input type="text" value={eventInput} onChange={(e) => setEventInput(e.target.value)} placeholder="Add a recent event..." onKeyDown={(e) => e.key === "Enter" && addEvent()} />
          <button onClick={addEvent} className="btn btn-secondary shrink-0"><Plus size={14} /></button>
        </div>
      </div>
      <div className="p-3 sm:p-4 rounded-xl bg-dream-500/10 border border-dream-500/20">
        <div className="flex items-start gap-3">
          <Brain size={18} className="text-dream-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-dream-200 font-medium mb-1">How this helps</p>
            <p className="text-xs text-dream-300/70 leading-relaxed">Your life context allows NeuroDream to build context-aware prompts that connect your dream content to your waking experience. Research shows dream content closely mirrors waking concerns (the Continuity Hypothesis).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingSelector({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-2.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} className={`rating-dot ${n <= value ? "active" : ""}`} />
        ))}
      </div>
      <span className="text-xs text-[var(--text-muted)] min-w-[80px]">{labels[value - 1]}</span>
    </div>
  );
}
