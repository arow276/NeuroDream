import {
  DreamEntry,
  DreamInterpretation,
  SymbolicAnalysis,
  NeuroscienceInsight,
  PsychologicalPerspective,
  WellnessAction,
  WellnessCategory,
} from "@/types";
import {
  sleepStageInfo,
  brainRegionDatabase,
  researchDatabase,
  neurochemicalInfo,
  commonDreamThemes,
} from "@/data/neuroscience";
import { v4 as uuidv4 } from "uuid";

/**
 * Context-aware AI prompt system for NeuroDream.
 *
 * This system builds rich, contextual prompts by combining:
 * 1. The dream narrative and metadata
 * 2. The dreamer's life context and stressors
 * 3. Neuroscience knowledge about sleep stages and brain function
 * 4. Pattern recognition from dream history
 * 5. Symbolic and psychological frameworks
 *
 * The prompts are designed so that when sent to an AI API,
 * they produce deeply personalized interpretations.
 * For the MVP, we use the prompt structure to generate
 * deterministic interpretations locally.
 */

export function buildContextualPrompt(
  dream: DreamEntry,
  previousDreams: DreamEntry[]
): string {
  const stageInfo = sleepStageInfo[dream.estimatedSleepStage];
  const recentDreams = previousDreams.slice(0, 5);

  const recurringSymbols = findRecurringElements(
    previousDreams.flatMap((d) => d.symbols.map((s) => s.name)),
    dream.symbols.map((s) => s.name)
  );

  const recurringThemes = findRecurringElements(
    previousDreams.flatMap((d) => d.themes),
    dream.themes
  );

  const prompt = `
## Dream Analysis Request — Context-Aware Interpretation

### Dreamer Context
- Current life context: ${dream.lifeContext || "Not provided"}
- Active stressors: ${dream.currentStressors.length > 0 ? dream.currentStressors.join(", ") : "None reported"}
- Recent events: ${dream.recentEvents.length > 0 ? dream.recentEvents.join(", ") : "None reported"}

### Dream Details
- **Title**: ${dream.title}
- **Narrative**: ${dream.narrative}
- **Emotions experienced**: ${dream.emotions.join(", ")}
- **Key symbols**: ${dream.symbols.map((s) => `${s.name} (${s.category})`).join(", ")}
- **Themes**: ${dream.themes.join(", ")}
- **Emotional valence**: ${dream.valence}
- **Vividness**: ${dream.vividness}/5
- **Emotional intensity**: ${dream.emotionalIntensity}/5
- **Lucidity level**: ${dream.lucidity}

### Sleep Context
- **Estimated sleep stage**: ${stageInfo.name}
- **Sleep quality**: ${dream.sleepQuality}/5
- **Stage characteristics**: ${stageInfo.dreamCharacteristics}
- **Brain activity pattern**: ${stageInfo.brainActivity}

### Pattern Context
${recurringSymbols.length > 0 ? `- Recurring symbols from dream history: ${recurringSymbols.join(", ")}` : "- No recurring symbols detected yet"}
${recurringThemes.length > 0 ? `- Recurring themes from dream history: ${recurringThemes.join(", ")}` : "- No recurring themes detected yet"}
- Total dreams in journal: ${previousDreams.length}
${recentDreams.length > 0 ? `- Recent dream themes: ${recentDreams.map((d) => d.themes.join("/")).join("; ")}` : ""}

### Analysis Instructions
Please provide a comprehensive analysis that integrates:
1. **Symbolic analysis** of each key symbol, considering both universal symbolism and the dreamer's personal context
2. **Emotional theme mapping** connecting dream emotions to waking-life situations
3. **Neuroscientific context** explaining relevant brain mechanisms during ${dream.estimatedSleepStage} sleep
4. **Psychological perspectives** from at least 3 schools (Jungian, Cognitive, and one other)
5. **Life integration insights** connecting the dream to the dreamer's current life context and stressors
6. **Reflective questions** that help the dreamer explore the dream's personal significance
7. **Wellness actions** — concrete, actionable steps the dreamer can take to integrate dream insights

Emphasize the connection between the dream content and the dreamer's waking life.
Provide science-backed insights alongside interpretive frameworks.
`.trim();

  return prompt;
}

function findRecurringElements(
  historicalElements: string[],
  currentElements: string[]
): string[] {
  const historicalCounts: Record<string, number> = {};
  historicalElements.forEach((e) => {
    const lower = e.toLowerCase();
    historicalCounts[lower] = (historicalCounts[lower] || 0) + 1;
  });

  return currentElements.filter(
    (e) => (historicalCounts[e.toLowerCase()] || 0) >= 1
  );
}

/**
 * Generates a full dream interpretation using the context-aware system.
 * In production, this would call an AI API with the contextual prompt.
 * This MVP version generates rich interpretations using local knowledge bases.
 */
export function generateInterpretation(
  dream: DreamEntry,
  previousDreams: DreamEntry[]
): DreamInterpretation {
  const contextualPrompt = buildContextualPrompt(dream, previousDreams);
  const stageInfo = sleepStageInfo[dream.estimatedSleepStage];

  // Generate symbolic analysis for each symbol
  const symbolicAnalysis: SymbolicAnalysis[] = dream.symbols.map((symbol) => {
    const themeMatch = Object.entries(commonDreamThemes).find(
      ([key]) =>
        symbol.name.toLowerCase().includes(key) ||
        key.includes(symbol.name.toLowerCase())
    );

    return {
      symbol: symbol.name,
      universalMeaning: themeMatch
        ? themeMatch[1].wellness
        : getUniversalMeaning(symbol.name, symbol.category),
      personalContext: generatePersonalContext(symbol.name, dream),
      actionableInsight: generateActionableInsight(symbol.name, dream),
    };
  });

  // Select relevant brain regions based on dream content
  const relevantRegions = selectRelevantBrainRegions(dream);

  // Select relevant research
  const relevantResearch = selectRelevantResearch(dream);

  // Generate neuroscience insight
  const neuroscientificContext: NeuroscienceInsight = {
    sleepStageAnalysis: `Your dream occurred during ${stageInfo.name}. ${stageInfo.dreamCharacteristics} ${stageInfo.brainActivity}`,
    brainRegionsInvolved: relevantRegions,
    neurochemicalContext: generateNeurochemicalContext(dream),
    memoryConsolidation: generateMemoryInsight(dream),
    emotionalProcessing: generateEmotionalProcessingInsight(dream),
    relevantResearch: relevantResearch,
  };

  // Generate psychological perspectives
  const psychologicalPerspectives = generatePsychologicalPerspectives(dream);

  // Generate life connection insights
  const lifeConnectionInsights = generateLifeConnections(dream);

  // Generate reflection questions
  const questionsForReflection = generateReflectionQuestions(dream);

  // Generate summary
  const summary = generateSummary(dream, symbolicAnalysis);

  return {
    summary,
    symbolicAnalysis,
    emotionalThemes: dream.emotions,
    neuroscientificContext,
    psychologicalPerspectives,
    lifeConnectionInsights,
    questionsForReflection,
    contextualPrompt,
  };
}

function getUniversalMeaning(symbolName: string, category: string): string {
  const meanings: Record<string, Record<string, string>> = {
    person: {
      default:
        "People in dreams often represent aspects of yourself or your relationship dynamics. This figure may embody qualities you recognize, desire, or fear in yourself.",
    },
    place: {
      default:
        "Dream locations often represent psychological states or life situations. The characteristics of this place reflect your inner emotional landscape.",
    },
    animal: {
      default:
        "Animals in dreams frequently represent instinctual drives, emotions, or aspects of your personality that operate beneath conscious awareness.",
    },
    object: {
      default:
        "Objects in dreams often carry symbolic weight beyond their physical form. Consider what this object means to you personally and what function it serves.",
    },
    action: {
      default:
        "Actions in dreams reflect psychological processes — what you're doing in the dream often mirrors what you're trying to accomplish or avoid in waking life.",
    },
    emotion: {
      default:
        "Direct emotional experiences in dreams are often the most reliable element. The emotions you feel in the dream may point to unprocessed feelings in waking life.",
    },
    nature: {
      default:
        "Natural elements often represent fundamental life forces, cycles of change, and your relationship with the larger world beyond personal concerns.",
    },
    body: {
      default:
        "Body imagery in dreams often reflects your relationship with physical self, health concerns, or embodied emotional states that need attention.",
    },
    abstract: {
      default:
        "Abstract dream elements often emerge from deep cognitive processing, representing complex ideas or feelings that resist simple categorization.",
    },
  };

  return meanings[category]?.default || meanings.abstract.default;
}

function generatePersonalContext(symbolName: string, dream: DreamEntry): string {
  const contexts: string[] = [];

  if (dream.lifeContext) {
    contexts.push(
      `Given your current life situation (${dream.lifeContext}), "${symbolName}" may represent an aspect of this experience that your unconscious mind is processing.`
    );
  }

  if (dream.currentStressors.length > 0) {
    contexts.push(
      `With stressors including ${dream.currentStressors[0]}, this symbol may be your psyche's way of expressing or working through related tensions.`
    );
  }

  if (dream.valence === "negative") {
    contexts.push(
      `The negative emotional tone suggests this symbol may be highlighting something that needs your attention or resolution.`
    );
  } else if (dream.valence === "positive") {
    contexts.push(
      `The positive emotional context suggests this symbol may represent a resource, strength, or source of fulfillment available to you.`
    );
  }

  return (
    contexts[0] ||
    `Consider what "${symbolName}" means to you personally — your unique associations matter more than any universal interpretation.`
  );
}

function generateActionableInsight(symbolName: string, dream: DreamEntry): string {
  if (dream.valence === "negative" || dream.emotionalIntensity >= 4) {
    return `Take 5 minutes today to journal about what "${symbolName}" represents to you. Ask yourself: "What in my waking life feels like this?" Then identify one small step you can take to address that feeling.`;
  }

  if (dream.lucidity !== "none") {
    return `Your awareness during this dream suggests growing self-reflection. Practice noticing "${symbolName}" as a theme in your daily life — it may be a meaningful personal symbol worth exploring.`;
  }

  return `Reflect on "${symbolName}" throughout your day. Notice if you encounter anything that evokes a similar feeling. This awareness can bridge your dream insights with waking consciousness.`;
}

function selectRelevantBrainRegions(dream: DreamEntry) {
  const regions = [...brainRegionDatabase];
  const selected = [];

  // Always include these for REM dreams
  if (dream.estimatedSleepStage === "REM") {
    selected.push(regions.find((r) => r.name === "Amygdala")!);
    selected.push(regions.find((r) => r.name === "Prefrontal Cortex")!);
  }

  // Emotional dreams
  if (dream.emotionalIntensity >= 3) {
    const amygdala = regions.find((r) => r.name === "Amygdala");
    if (amygdala && !selected.includes(amygdala)) selected.push(amygdala);
    const insula = regions.find((r) => r.name === "Insula");
    if (insula) selected.push(insula);
  }

  // Visual/vivid dreams
  if (dream.vividness >= 3) {
    const visual = regions.find((r) => r.name === "Visual Cortex (V1/V2)");
    if (visual) selected.push(visual);
  }

  // Dreams about places or navigation
  if (dream.symbols.some((s) => s.category === "place")) {
    const hippo = regions.find((r) => r.name === "Hippocampus");
    if (hippo) selected.push(hippo);
  }

  // Self-referential content
  if (dream.symbols.some((s) => s.category === "person")) {
    const dmn = regions.find((r) => r.name === "Default Mode Network");
    if (dmn) selected.push(dmn);
  }

  // Always include hippocampus for memory context
  const hippo = regions.find((r) => r.name === "Hippocampus");
  if (hippo && !selected.includes(hippo)) selected.push(hippo);

  return selected.slice(0, 4);
}

function selectRelevantResearch(dream: DreamEntry) {
  const selected = [];

  // Emotional processing
  if (dream.emotionalIntensity >= 3 || dream.valence === "negative") {
    selected.push(researchDatabase[0]); // Walker & van der Helm
    selected.push(researchDatabase[7]); // Cartwright
  }

  // Memory/learning context
  if (dream.recentEvents.length > 0) {
    selected.push(researchDatabase[1]); // Diekelmann & Born
    selected.push(researchDatabase[4]); // Schredl continuity
  }

  // Anxiety/threat dreams
  if (
    dream.emotions.some((e) =>
      ["anxiety", "fear", "panic", "stress"].includes(e.toLowerCase())
    )
  ) {
    selected.push(researchDatabase[2]); // Revonsuo threat simulation
  }

  // Lucid dreams
  if (dream.lucidity !== "none") {
    selected.push(researchDatabase[5]); // Voss lucid dreaming
  }

  // Default: include continuity hypothesis and DMN
  if (selected.length < 2) {
    selected.push(researchDatabase[3]); // DMN
    selected.push(researchDatabase[4]); // Continuity
  }

  // Deduplicate
  return Array.from(new Map(selected.map((r) => [r.title, r] as const)).values()).slice(0, 3);
}

function generateNeurochemicalContext(dream: DreamEntry): string {
  const info = neurochemicalInfo;
  const parts: string[] = [];

  if (dream.estimatedSleepStage === "REM") {
    parts.push(
      `During REM sleep, acetylcholine surges to waking levels (${info.acetylcholine.dreamEffect}), while norepinephrine drops to near zero (${info.norepinephrine.dreamEffect}).`
    );
    parts.push(
      `The dopaminergic system remains active: ${info.dopamine.dreamEffect}`
    );
  }

  if (dream.emotionalIntensity >= 4) {
    parts.push(
      `The high emotional intensity of your dream may reflect elevated cortisol: ${info.cortisol.dreamEffect}`
    );
  }

  if (dream.vividness >= 4) {
    parts.push(
      `The exceptional vividness aligns with strong cholinergic activation in the visual cortex.`
    );
  }

  return (
    parts.join(" ") ||
    `Your dream's neurochemical environment was shaped by the interplay of acetylcholine (driving imagery), suppressed norepinephrine (allowing the dream logic), and active dopamine (fueling the narrative's momentum).`
  );
}

function generateMemoryInsight(dream: DreamEntry): string {
  if (dream.recentEvents.length > 0) {
    return `Your dream may be consolidating memories related to recent events (${dream.recentEvents[0]}). During sleep, the hippocampus replays recent experiences and integrates them with existing memory networks, which may explain why recent events appeared in transformed ways in your dream.`;
  }

  return `Sleep is a critical period for memory consolidation. Your dream content is shaped by the hippocampal replay of recent and emotionally significant experiences, integrated with older memories to create the dream narrative.`;
}

function generateEmotionalProcessingInsight(dream: DreamEntry): string {
  if (dream.valence === "negative" && dream.emotionalIntensity >= 3) {
    return `Your dream's negative emotional tone with high intensity suggests active emotional processing. Research by Walker & van der Helm shows that REM sleep helps "strip" the emotional charge from memories — experiencing these emotions in dreams is part of how your brain metabolizes difficult feelings, allowing you to remember events without the full emotional impact.`;
  }

  if (dream.valence === "positive") {
    return `The positive emotional quality of your dream suggests reward-system activation and potentially creative problem-solving. Positive dreams are associated with dopaminergic activity and may strengthen positive memory associations.`;
  }

  if (dream.valence === "mixed") {
    return `The mixed emotional quality reflects the complex emotional processing that occurs during sleep. Your brain is integrating multiple emotional streams, which may help you develop a more nuanced emotional understanding of current life situations.`;
  }

  return `Your brain uses dreaming to process and regulate emotions. The emotional content of your dream reflects ongoing emotional work — integrating experiences and calibrating your emotional responses.`;
}

function generatePsychologicalPerspectives(
  dream: DreamEntry
): PsychologicalPerspective[] {
  const perspectives: PsychologicalPerspective[] = [];

  // Jungian perspective
  const jungianSymbols = dream.symbols
    .map((s) => s.name)
    .join(", ");
  perspectives.push({
    school: "Jungian Analytical Psychology",
    interpretation: `Jung would view ${jungianSymbols ? `symbols like ${jungianSymbols}` : "this dream"} as messages from the unconscious, potentially representing archetypal patterns. The ${dream.valence} emotional tone suggests the unconscious is ${dream.valence === "negative" ? "signaling something that needs conscious integration — the Shadow or repressed aspects seeking acknowledgment" : dream.valence === "positive" ? "offering guidance toward individuation and wholeness" : "presenting material for conscious reflection and integration"}.`,
    keyInsight: `Consider what aspects of yourself or your life these symbols might represent. Jung believed dreams compensate for imbalances in our conscious attitude.`,
  });

  // Cognitive perspective
  perspectives.push({
    school: "Cognitive Dream Theory",
    interpretation: `From a cognitive perspective, this dream reflects your brain's ongoing effort to process waking experiences and concerns. The themes of ${dream.themes.join(", ") || "your dream"} map to current cognitive schemas and emotional preoccupations. ${dream.lifeContext ? `Your current life context (${dream.lifeContext}) is likely a primary source of dream content.` : ""}`,
    keyInsight: `Your dream content is continuous with your waking thoughts and concerns. Notice what aspects of your daily life appear — these indicate where your cognitive resources are focused.`,
  });

  // Gestalt perspective
  perspectives.push({
    school: "Gestalt Dream Work",
    interpretation: `Gestalt therapy treats every element of the dream as a projection of the self. Each symbol — ${jungianSymbols || "the elements in your dream"} — represents a part of you. Try "being" each element: speak as if you ARE that symbol and notice what emerges.`,
    keyInsight: `Instead of analyzing the dream from the outside, try embodying each element. What would each symbol say if it could speak? What does it need?`,
  });

  // Existential perspective if emotionally intense
  if (dream.emotionalIntensity >= 4) {
    perspectives.push({
      school: "Existential Dream Analysis",
      interpretation: `The high emotional intensity of this dream may point to existential themes — questions about meaning, freedom, isolation, or mortality that underlie surface concerns. The ${dream.valence} emotional quality suggests engagement with fundamental life questions.`,
      keyInsight: `What deeper life questions might this dream be touching? Sometimes our most intense dreams address the biggest questions we carry.`,
    });
  }

  return perspectives;
}

function generateLifeConnections(dream: DreamEntry): string[] {
  const connections: string[] = [];

  if (dream.lifeContext) {
    connections.push(
      `Your dream appears to be processing your current situation: "${dream.lifeContext}". Dreams often provide a different perspective on waking concerns — one less constrained by logic and social expectations.`
    );
  }

  if (dream.currentStressors.length > 0) {
    connections.push(
      `Active stressors (${dream.currentStressors.join(", ")}) likely influenced your dream content. Research shows that unresolved stress reliably appears in dreams, often in metaphorical form. Your brain is working on these challenges even while you sleep.`
    );
  }

  if (dream.recentEvents.length > 0) {
    connections.push(
      `Recent events (${dream.recentEvents.join(", ")}) may have provided raw material for your dream. The "day residue" effect — incorporation of recent experiences — is one of the most well-documented features of dreaming.`
    );
  }

  if (dream.emotions.length > 0) {
    connections.push(
      `The emotions you experienced in the dream (${dream.emotions.join(", ")}) are worth tracking in waking life. Notice when these same emotions arise during your day — the dream may be highlighting emotional patterns worth attending to.`
    );
  }

  if (dream.isRecurring) {
    connections.push(
      `As a recurring dream, this pattern is particularly significant. Recurring dreams often persist until their underlying concern is consciously addressed. Consider what unresolved issue this dream might be pointing toward.`
    );
  }

  if (connections.length === 0) {
    connections.push(
      `Even without specific life context provided, your dream reflects your inner psychological state. Pay attention to how the dream's emotional quality matches or contrasts with your current waking mood.`
    );
  }

  return connections;
}

function generateReflectionQuestions(dream: DreamEntry): string[] {
  const questions: string[] = [];

  // Always start with an open question
  questions.push(
    `What was the strongest feeling in this dream, and where do you feel that same emotion in your waking life?`
  );

  // Symbol-specific questions
  if (dream.symbols.length > 0) {
    const primary = dream.symbols[0];
    questions.push(
      `If "${primary.name}" could speak to you, what would it say? What would you say back?`
    );
  }

  // Valence-specific
  if (dream.valence === "negative") {
    questions.push(
      `What would need to change in your waking life for this dream's emotional tone to shift?`
    );
  } else if (dream.valence === "positive") {
    questions.push(
      `What conditions in your waking life support the positive feelings in this dream? How can you cultivate more of that?`
    );
  }

  // Stressor-related
  if (dream.currentStressors.length > 0) {
    questions.push(
      `How might this dream be offering a new perspective on your current challenges?`
    );
  }

  // Action-oriented
  questions.push(
    `If this dream were giving you advice, what would that advice be? What is one small action you could take today based on that?`
  );

  // Recurring dreams
  if (dream.isRecurring) {
    questions.push(
      `What has changed and what has stayed the same since this dream first occurred? What might that evolution tell you?`
    );
  }

  return questions.slice(0, 5);
}

function generateSummary(
  dream: DreamEntry,
  symbolicAnalysis: SymbolicAnalysis[]
): string {
  const stageInfo = sleepStageInfo[dream.estimatedSleepStage];
  const symbolSummary =
    symbolicAnalysis.length > 0
      ? `Key symbols (${symbolicAnalysis.map((s) => s.symbol).join(", ")}) suggest themes of ${dream.themes.slice(0, 3).join(", ") || "personal significance"}.`
      : "";

  const emotionalSummary = `The ${dream.valence} emotional tone with ${dream.emotionalIntensity >= 4 ? "high" : dream.emotionalIntensity >= 2 ? "moderate" : "low"} intensity indicates ${dream.emotionalIntensity >= 4 ? "significant emotional processing" : "ongoing integration of experiences"}.`;

  const neuroSummary = `Occurring during ${stageInfo.name}, your brain was ${dream.estimatedSleepStage === "REM" ? "highly active in emotional and visual processing regions" : "in a state conducive to " + (dream.estimatedSleepStage === "N3" ? "deep restoration and memory consolidation" : "lighter processing and memory integration")}.`;

  const lifeSummary = dream.lifeContext
    ? ` This dream appears connected to your current life context and may be offering an alternative perspective on waking concerns.`
    : "";

  return `${symbolSummary} ${emotionalSummary} ${neuroSummary}${lifeSummary}`.trim();
}

/**
 * Generates wellness actions based on dream content and interpretation.
 */
export function generateWellnessActions(
  dream: DreamEntry,
  interpretation: DreamInterpretation
): WellnessAction[] {
  const actions: WellnessAction[] = [];

  // Mindfulness action based on emotional content
  if (dream.emotionalIntensity >= 3) {
    actions.push({
      id: uuidv4(),
      category: "mindfulness",
      title: "Emotional Body Scan",
      description: `Do a 5-minute body scan meditation, paying special attention to where you feel the emotions from your dream (${dream.emotions.slice(0, 2).join(", ")}). Notice without judgment.`,
      completed: false,
    });
  }

  // Journaling action — always include
  actions.push({
    id: uuidv4(),
    category: "journaling",
    title: "Dream Dialogue Journal",
    description: `Write a dialogue with the most significant element of your dream. Ask it: "Why did you appear? What do you need me to know?" Write its response without overthinking.`,
    completed: false,
  });

  // Sleep hygiene if quality was low
  if (dream.sleepQuality <= 2) {
    actions.push({
      id: uuidv4(),
      category: "sleep-hygiene",
      title: "Sleep Environment Audit",
      description: `Your sleep quality was low. Tonight, try: reducing screen time 1hr before bed, keeping your room cool (65-68°F), and doing 5 minutes of progressive muscle relaxation before sleep.`,
      completed: false,
    });
  }

  // Creative action for vivid dreams
  if (dream.vividness >= 4) {
    actions.push({
      id: uuidv4(),
      category: "creative",
      title: "Dream Scene Sketch",
      description: `Your dream was highly vivid. Capture the most striking image from your dream through a quick sketch, collage, or creative writing — this strengthens the bridge between dream and waking consciousness.`,
      completed: false,
    });
  }

  // Physical action for stress-related dreams
  if (
    dream.currentStressors.length > 0 ||
    dream.emotions.some((e) =>
      ["anxiety", "stress", "tension", "fear"].includes(e.toLowerCase())
    )
  ) {
    actions.push({
      id: uuidv4(),
      category: "physical",
      title: "Stress Release Movement",
      description: `Your dream reflects current stress. Engage in 15-20 minutes of physical movement today (walking, yoga, stretching) with the intention of releasing tension. Focus on how your body feels during the movement.`,
      completed: false,
    });
  }

  // Social action if dream involved people
  if (dream.symbols.some((s) => s.category === "person")) {
    actions.push({
      id: uuidv4(),
      category: "social",
      title: "Connection Check-In",
      description: `Your dream featured other people. Reach out to someone significant today — share something genuine about how you're feeling, or simply ask how they're doing and listen deeply.`,
      completed: false,
    });
  }

  // Cognitive action for recurring dreams
  if (dream.isRecurring) {
    actions.push({
      id: uuidv4(),
      category: "cognitive",
      title: "Pattern Interruption Plan",
      description: `This is a recurring dream. Write down: (1) the core theme, (2) the emotion it creates, (3) one waking-life situation that creates the same feeling, (4) one small change you could make in that situation.`,
      completed: false,
    });
  }

  // Emotional action for intense negative dreams
  if (dream.valence === "negative" && dream.emotionalIntensity >= 4) {
    actions.push({
      id: uuidv4(),
      category: "emotional",
      title: "Dream Rewrite Exercise",
      description: `Rewrite the ending of your dream in a way that feels empowering or resolved. This technique (Image Rehearsal Therapy) has clinical evidence for reducing nightmare distress.`,
      completed: false,
    });
  }

  return actions.slice(0, 5);
}
