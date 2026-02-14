export type MoodRating = 1 | 2 | 3 | 4 | 5;
export type SleepQuality = 1 | 2 | 3 | 4 | 5;
export type Lucidity = "none" | "partial" | "full";
export type DreamValence = "positive" | "neutral" | "negative" | "mixed";
export type SleepStage = "N1" | "N2" | "N3" | "REM";

export interface DreamSymbol {
  name: string;
  category: SymbolCategory;
  personalMeaning?: string;
}

export type SymbolCategory =
  | "person"
  | "place"
  | "animal"
  | "object"
  | "action"
  | "emotion"
  | "nature"
  | "body"
  | "abstract";

export interface DreamEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string; // YYYY-MM-DD of the dream night

  // Core dream content
  title: string;
  narrative: string;
  symbols: DreamSymbol[];
  themes: string[];
  emotions: string[];

  // Sleep context
  sleepQuality: SleepQuality;
  bedTime?: string;
  wakeTime?: string;
  estimatedSleepStage: SleepStage;
  lucidity: Lucidity;

  // Subjective ratings
  vividness: MoodRating;
  emotionalIntensity: MoodRating;
  valence: DreamValence;

  // Life context (what's happening in waking life)
  lifeContext: string;
  currentStressors: string[];
  recentEvents: string[];

  // AI-generated analysis
  interpretation?: DreamInterpretation;

  // Wellness integration
  wellnessActions?: WellnessAction[];

  // Tags and recurrence
  isRecurring: boolean;
  recurringPatternId?: string;
  tags: string[];
}

export interface DreamInterpretation {
  summary: string;
  symbolicAnalysis: SymbolicAnalysis[];
  emotionalThemes: string[];
  neuroscientificContext: NeuroscienceInsight;
  psychologicalPerspectives: PsychologicalPerspective[];
  lifeConnectionInsights: string[];
  questionsForReflection: string[];
  contextualPrompt: string; // The AI prompt used to generate this
}

export interface SymbolicAnalysis {
  symbol: string;
  universalMeaning: string;
  personalContext: string;
  actionableInsight: string;
}

export interface NeuroscienceInsight {
  sleepStageAnalysis: string;
  brainRegionsInvolved: BrainRegion[];
  neurochemicalContext: string;
  memoryConsolidation: string;
  emotionalProcessing: string;
  relevantResearch: ResearchReference[];
}

export interface BrainRegion {
  name: string;
  role: string;
  relevance: string;
}

export interface ResearchReference {
  title: string;
  finding: string;
  implication: string;
}

export interface PsychologicalPerspective {
  school: string; // e.g., "Jungian", "Freudian", "Cognitive", "Gestalt"
  interpretation: string;
  keyInsight: string;
}

export interface WellnessAction {
  id: string;
  category: WellnessCategory;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export type WellnessCategory =
  | "mindfulness"
  | "journaling"
  | "physical"
  | "social"
  | "creative"
  | "cognitive"
  | "emotional"
  | "sleep-hygiene";

export interface DreamPattern {
  id: string;
  name: string;
  description: string;
  dreamIds: string[];
  frequency: number;
  firstOccurrence: string;
  lastOccurrence: string;
  commonSymbols: string[];
  commonThemes: string[];
  commonEmotions: string[];
  insight: string;
}

export interface UserProfile {
  name: string;
  journalStartDate: string;
  totalDreams: number;
  currentStreak: number;
  longestStreak: number;
  preferences: {
    defaultSleepTime: string;
    defaultWakeTime: string;
    favoriteThemes: string[];
    interpretationStyle: "scientific" | "symbolic" | "balanced";
  };
}

export interface AnalyticsData {
  totalDreams: number;
  averageSleepQuality: number;
  averageVividness: number;
  mostCommonEmotions: { name: string; count: number }[];
  mostCommonSymbols: { name: string; count: number }[];
  mostCommonThemes: { name: string; count: number }[];
  dreamsByValence: { positive: number; neutral: number; negative: number; mixed: number };
  dreamsByLucidity: { none: number; partial: number; full: number };
  sleepQualityOverTime: { date: string; quality: number }[];
  dreamsPerWeek: { week: string; count: number }[];
  wellnessCompletionRate: number;
}
