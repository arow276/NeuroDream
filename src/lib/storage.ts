"use client";

import { DreamEntry, DreamPattern, UserProfile } from "@/types";

const STORAGE_KEYS = {
  dreams: "neurodream_dreams",
  patterns: "neurodream_patterns",
  profile: "neurodream_profile",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

// Dream entries
export function getDreams(): DreamEntry[] {
  return getItem<DreamEntry[]>(STORAGE_KEYS.dreams, []);
}

export function saveDream(dream: DreamEntry): void {
  const dreams = getDreams();
  const index = dreams.findIndex((d) => d.id === dream.id);
  if (index >= 0) {
    dreams[index] = { ...dream, updatedAt: new Date().toISOString() };
  } else {
    dreams.unshift(dream);
  }
  setItem(STORAGE_KEYS.dreams, dreams);
}

export function deleteDream(id: string): void {
  const dreams = getDreams().filter((d) => d.id !== id);
  setItem(STORAGE_KEYS.dreams, dreams);
}

export function getDreamById(id: string): DreamEntry | undefined {
  return getDreams().find((d) => d.id === id);
}

// Patterns
export function getPatterns(): DreamPattern[] {
  return getItem<DreamPattern[]>(STORAGE_KEYS.patterns, []);
}

export function savePattern(pattern: DreamPattern): void {
  const patterns = getPatterns();
  const index = patterns.findIndex((p) => p.id === pattern.id);
  if (index >= 0) {
    patterns[index] = pattern;
  } else {
    patterns.push(pattern);
  }
  setItem(STORAGE_KEYS.patterns, patterns);
}

// Profile
export function getProfile(): UserProfile {
  return getItem<UserProfile>(STORAGE_KEYS.profile, {
    name: "",
    journalStartDate: new Date().toISOString().split("T")[0],
    totalDreams: 0,
    currentStreak: 0,
    longestStreak: 0,
    preferences: {
      defaultSleepTime: "23:00",
      defaultWakeTime: "07:00",
      favoriteThemes: [],
      interpretationStyle: "balanced",
    },
  });
}

export function saveProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.profile, profile);
}
