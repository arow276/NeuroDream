import { BrainRegion, ResearchReference, SleepStage } from "@/types";

export const sleepStageInfo: Record<
  SleepStage,
  {
    name: string;
    description: string;
    dreamCharacteristics: string;
    brainActivity: string;
    duration: string;
  }
> = {
  N1: {
    name: "Stage 1 - Light Sleep",
    description:
      "The transition between wakefulness and sleep. Brain waves slow from alpha to theta patterns.",
    dreamCharacteristics:
      "Hypnagogic imagery — brief, fragmented, often surreal images. May include the sensation of falling or muscle jerks (hypnic jerks).",
    brainActivity:
      "Theta waves (4-7 Hz) dominate. The prefrontal cortex begins to deactivate, reducing logical oversight.",
    duration: "Typically 5-10 minutes per cycle",
  },
  N2: {
    name: "Stage 2 - True Sleep",
    description:
      "Deeper sleep characterized by sleep spindles and K-complexes. Body temperature drops and heart rate slows.",
    dreamCharacteristics:
      "Thought-like mentation, less vivid than REM dreams. Often involves everyday scenarios with subtle distortions.",
    brainActivity:
      "Sleep spindles (12-14 Hz bursts) appear, believed to be involved in memory consolidation and sensory gating.",
    duration: "Makes up ~50% of total sleep time",
  },
  N3: {
    name: "Stage 3 - Deep Sleep (Slow-Wave)",
    description:
      "The most restorative sleep stage. Growth hormone is released, tissue repair occurs, and the immune system strengthens.",
    dreamCharacteristics:
      "Dreams are rare and typically less narrative. When they occur, they tend to be more conceptual, emotional, and less visual.",
    brainActivity:
      "Delta waves (0.5-4 Hz) dominate. The glymphatic system activates, clearing metabolic waste from the brain.",
    duration: "Most prominent in the first third of the night",
  },
  REM: {
    name: "REM Sleep - Rapid Eye Movement",
    description:
      "The primary dreaming stage. The brain is nearly as active as wakefulness, but the body is temporarily paralyzed (atonia).",
    dreamCharacteristics:
      "Vivid, narrative, emotionally charged dreams with complex storylines. This is where most memorable dreams occur.",
    brainActivity:
      "High-frequency activity similar to waking. The amygdala is highly active (emotional processing), while the dorsolateral prefrontal cortex is suppressed (reduced critical thinking).",
    duration: "Increases across the night; longest REM periods occur in the early morning",
  },
};

export const brainRegionDatabase: BrainRegion[] = [
  {
    name: "Amygdala",
    role: "Emotional processing and fear conditioning",
    relevance:
      "Highly active during REM sleep, driving emotional content in dreams. Processes unresolved emotional experiences.",
  },
  {
    name: "Hippocampus",
    role: "Memory formation and spatial navigation",
    relevance:
      "Replays and consolidates memories during sleep. Dream locations and narratives often draw from hippocampal memory traces.",
  },
  {
    name: "Prefrontal Cortex",
    role: "Executive function, planning, and critical thinking",
    relevance:
      "Largely deactivated during REM sleep, explaining the uncritical acceptance of bizarre dream events. Partially reactivates during lucid dreams.",
  },
  {
    name: "Visual Cortex (V1/V2)",
    role: "Visual processing and image generation",
    relevance:
      "Generates the vivid visual imagery experienced in dreams. Internally-driven activation creates dream scenes without external input.",
  },
  {
    name: "Anterior Cingulate Cortex",
    role: "Conflict monitoring and emotional regulation",
    relevance:
      "May contribute to the emotional narratives and conflict resolution themes common in dreams.",
  },
  {
    name: "Temporal Lobe",
    role: "Language, auditory processing, and memory retrieval",
    relevance:
      "Supports dream narrative construction and the recall of spoken language, music, and sounds in dreams.",
  },
  {
    name: "Default Mode Network",
    role: "Self-referential thinking and mind-wandering",
    relevance:
      "Highly active during dreaming. Generates the autobiographical, self-relevant nature of dream content.",
  },
  {
    name: "Basal Ganglia",
    role: "Motor planning and habit formation",
    relevance:
      "Contributes to the movement sensations in dreams (running, flying) despite physical muscle atonia.",
  },
  {
    name: "Insula",
    role: "Interoception and emotional awareness",
    relevance:
      "Processes bodily sensations experienced in dreams and may contribute to gut feelings and emotional intuitions in dreams.",
  },
];

export const researchDatabase: ResearchReference[] = [
  {
    title: "Overnight Therapy: The Role of REM Sleep in Emotional Processing",
    finding:
      "Walker & van der Helm (2009) demonstrated that REM sleep strips the emotional tone from memories, allowing us to remember events without the full emotional charge.",
    implication:
      "Emotionally intense dreams may represent active emotional processing, helping you metabolize difficult experiences.",
  },
  {
    title: "Memory Consolidation During Sleep",
    finding:
      "Diekelmann & Born (2010) showed that sleep actively consolidates declarative and procedural memories, with different sleep stages serving different memory types.",
    implication:
      "Dreams featuring recent events or skills may indicate active memory consolidation and learning.",
  },
  {
    title: "Threat Simulation Theory of Dreaming",
    finding:
      "Revonsuo (2000) proposed that dreams evolved to simulate threatening events, allowing the brain to rehearse threat responses in a safe environment.",
    implication:
      "Anxiety dreams and nightmares may serve a protective function by preparing you for potential challenges.",
  },
  {
    title: "The Default Mode Network and Dreaming",
    finding:
      "Domhoff & Fox (2015) found significant overlap between the brain's default mode network (active during daydreaming) and neural activation during REM sleep.",
    implication:
      "Dreams may be an intensified form of the same self-referential thinking that occurs during daydreaming and reflection.",
  },
  {
    title: "Continuity Hypothesis of Dreaming",
    finding:
      "Schredl (2003) provided evidence that dream content reflects waking-life concerns, experiences, and emotional preoccupations.",
    implication:
      "Your dreams likely mirror what's most important, stressful, or unresolved in your current life.",
  },
  {
    title: "Lucid Dreaming and Metacognition",
    finding:
      "Voss et al. (2014) found that lucid dreamers show increased activity in the dorsolateral prefrontal cortex, the same region associated with self-awareness and metacognition.",
    implication:
      "The ability to become lucid in dreams is linked to enhanced self-awareness that can benefit waking life.",
  },
  {
    title: "Glymphatic System and Sleep Cleaning",
    finding:
      "Xie et al. (2013) discovered that the brain's glymphatic system clears toxic metabolic waste during sleep, with clearance rates increasing 60% during sleep.",
    implication:
      "Quality sleep is essential for brain health, and dream recall may be an indicator of proper sleep cycling.",
  },
  {
    title: "Emotional Regulation Through Dream Reprocessing",
    finding:
      "Cartwright et al. (1998) found that individuals who incorporated waking-life stressors into their dreams showed better mood regulation upon waking.",
    implication:
      "Dreams that feature current stressors may be actively helping you emotionally process and adapt to challenges.",
  },
];

export const neurochemicalInfo = {
  serotonin: {
    name: "Serotonin",
    sleepRole:
      "Levels decrease during sleep, reaching their lowest during REM. Low serotonin disinhibits dreaming.",
    dreamEffect: "May influence dream mood and emotional tone. SSRIs often suppress REM sleep and alter dream content.",
  },
  norepinephrine: {
    name: "Norepinephrine",
    sleepRole: "Nearly absent during REM sleep, which may contribute to the non-critical acceptance of dream events.",
    dreamEffect: "Its absence allows the free-associative, illogical nature of dream narratives.",
  },
  acetylcholine: {
    name: "Acetylcholine",
    sleepRole: "Rises to waking levels during REM sleep, driving cortical activation and vivid dream imagery.",
    dreamEffect:
      "Primary driver of the vivid perceptual experience of dreams. Cholinergic drugs can intensify dreams.",
  },
  dopamine: {
    name: "Dopamine",
    sleepRole: "The mesolimbic dopamine system is active during REM, associated with motivation and reward.",
    dreamEffect: "Drives the seeking/exploring behavior common in dreams and may underlie the feeling of significance.",
  },
  cortisol: {
    name: "Cortisol",
    sleepRole: "Rises in the second half of the night, peaking before waking. Higher cortisol correlates with longer REM periods.",
    dreamEffect: "Later-night dreams (with higher cortisol) tend to be more emotionally intense and vivid.",
  },
  gaba: {
    name: "GABA",
    sleepRole: "Primary inhibitory neurotransmitter; promotes sleep onset and maintains sleep stability.",
    dreamEffect: "Contributes to muscle atonia during REM and may modulate dream content through cortical inhibition patterns.",
  },
};

export const commonDreamThemes: Record<string, { neuroscience: string; wellness: string }> = {
  falling: {
    neuroscience:
      "May originate from hypnic jerks during N1 sleep or vestibular system activation. The brain's balance centers can produce falling sensations during the transition to sleep.",
    wellness:
      "Often reflects feelings of losing control or anxiety about a situation. Consider where in your life you feel unsupported or out of control.",
  },
  flying: {
    neuroscience:
      "Associated with activation of motor cortex and vestibular system during REM atonia. The disconnect between motor planning and physical paralysis may generate the flying sensation.",
    wellness:
      "Commonly associated with feelings of freedom, empowerment, or transcending limitations. What in your life are you rising above?",
  },
  teeth_falling_out: {
    neuroscience:
      "May be linked to dental nerve stimulation during sleep (bruxism) or somatosensory cortex activation. REM atonia affecting jaw muscles could also contribute.",
    wellness:
      "Often associated with concerns about appearance, communication, or powerlessness. Consider stressors related to self-image or speaking up.",
  },
  being_chased: {
    neuroscience:
      "Amygdala hyperactivation during REM drives threat detection circuits. The fight-or-flight response activates without the ability to physically respond due to atonia.",
    wellness:
      "Often represents avoidance of a situation, person, or emotion in waking life. What are you running from? What would happen if you turned to face it?",
  },
  water: {
    neuroscience:
      "Water imagery may arise from the brain's representation of emotion (limbic-insular connectivity) or actual physiological states like bladder pressure.",
    wellness:
      "Water often symbolizes emotions and the unconscious mind. Calm water may indicate emotional peace; turbulent water may reflect inner turmoil.",
  },
  death: {
    neuroscience:
      "The brain processes concepts of mortality through the anterior insula and medial prefrontal cortex. Death imagery in dreams may represent the brain's attempt to process existential concerns.",
    wellness:
      "Rarely literal. Usually represents transformation, endings, or transitions. What chapter of your life is closing? What new phase is beginning?",
  },
  examinations: {
    neuroscience:
      "Stress-related dream content correlates with cortisol levels and hippocampal replay of performance-anxiety memories.",
    wellness:
      "Often reflects feelings of being judged, unprepared, or tested. Where in your life do you feel evaluated or scrutinized?",
  },
  naked_in_public: {
    neuroscience:
      "May involve conflict between the social cognition network (medial prefrontal cortex) and the body-awareness regions (somatosensory cortex, insula) during REM.",
    wellness:
      "Typically relates to vulnerability, exposure, or fear of judgment. Consider where you feel exposed or inauthentic.",
  },
};
