import { DreamEntry, AnalyticsData } from "@/types";
import { format, startOfWeek, parseISO } from "date-fns";

export function computeAnalytics(dreams: DreamEntry[]): AnalyticsData {
  if (dreams.length === 0) {
    return {
      totalDreams: 0,
      averageSleepQuality: 0,
      averageVividness: 0,
      mostCommonEmotions: [],
      mostCommonSymbols: [],
      mostCommonThemes: [],
      dreamsByValence: { positive: 0, neutral: 0, negative: 0, mixed: 0 },
      dreamsByLucidity: { none: 0, partial: 0, full: 0 },
      sleepQualityOverTime: [],
      dreamsPerWeek: [],
      wellnessCompletionRate: 0,
    };
  }

  // Emotion frequency
  const emotionCounts: Record<string, number> = {};
  dreams.forEach((d) =>
    d.emotions.forEach((e) => {
      emotionCounts[e] = (emotionCounts[e] || 0) + 1;
    })
  );

  // Symbol frequency
  const symbolCounts: Record<string, number> = {};
  dreams.forEach((d) =>
    d.symbols.forEach((s) => {
      symbolCounts[s.name] = (symbolCounts[s.name] || 0) + 1;
    })
  );

  // Theme frequency
  const themeCounts: Record<string, number> = {};
  dreams.forEach((d) =>
    d.themes.forEach((t) => {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    })
  );

  // Valence distribution
  const valence = { positive: 0, neutral: 0, negative: 0, mixed: 0 };
  dreams.forEach((d) => valence[d.valence]++);

  // Lucidity distribution
  const lucidity = { none: 0, partial: 0, full: 0 };
  dreams.forEach((d) => lucidity[d.lucidity]++);

  // Sleep quality over time (last 30 entries)
  const sleepQualityOverTime = dreams
    .slice(0, 30)
    .reverse()
    .map((d) => ({ date: d.date, quality: d.sleepQuality }));

  // Dreams per week
  const weekCounts: Record<string, number> = {};
  dreams.forEach((d) => {
    const week = format(startOfWeek(parseISO(d.date)), "MMM d");
    weekCounts[week] = (weekCounts[week] || 0) + 1;
  });
  const dreamsPerWeek = Object.entries(weekCounts)
    .map(([week, count]) => ({ week, count }))
    .slice(-12);

  // Wellness completion rate
  let totalActions = 0;
  let completedActions = 0;
  dreams.forEach((d) => {
    if (d.wellnessActions) {
      totalActions += d.wellnessActions.length;
      completedActions += d.wellnessActions.filter((a) => a.completed).length;
    }
  });

  const toSorted = (counts: Record<string, number>) =>
    Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

  return {
    totalDreams: dreams.length,
    averageSleepQuality:
      dreams.reduce((sum, d) => sum + d.sleepQuality, 0) / dreams.length,
    averageVividness:
      dreams.reduce((sum, d) => sum + d.vividness, 0) / dreams.length,
    mostCommonEmotions: toSorted(emotionCounts),
    mostCommonSymbols: toSorted(symbolCounts),
    mostCommonThemes: toSorted(themeCounts),
    dreamsByValence: valence,
    dreamsByLucidity: lucidity,
    sleepQualityOverTime,
    dreamsPerWeek,
    wellnessCompletionRate: totalActions > 0 ? completedActions / totalActions : 0,
  };
}
