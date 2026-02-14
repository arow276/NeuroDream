"use client";

import { useState, useEffect, useCallback } from "react";
import { DreamEntry } from "@/types";
import { getDreams } from "@/lib/storage";
import Navigation from "@/components/Navigation";
import DashboardView from "@/components/DashboardView";
import NewDreamEntry from "@/components/NewDreamEntry";
import DreamDetailView from "@/components/DreamDetailView";
import DreamTimeline from "@/components/DreamTimeline";
import AnalyticsView from "@/components/AnalyticsView";

export type View = "dashboard" | "new-dream" | "dream-detail" | "timeline" | "analytics";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);

  const refreshDreams = useCallback(() => {
    setDreams(getDreams());
  }, []);

  useEffect(() => {
    refreshDreams();
  }, [refreshDreams]);

  const handleViewDream = (id: string) => {
    setSelectedDreamId(id);
    setCurrentView("dream-detail");
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view !== "dream-detail") {
      setSelectedDreamId(null);
    }
  };

  const handleDreamSaved = () => {
    refreshDreams();
    setCurrentView("dashboard");
  };

  const selectedDream = dreams.find((d) => d.id === selectedDreamId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        dreamCount={dreams.length}
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {currentView === "dashboard" && (
          <DashboardView
            dreams={dreams}
            onViewDream={handleViewDream}
            onNewDream={() => handleNavigate("new-dream")}
          />
        )}
        {currentView === "new-dream" && (
          <NewDreamEntry
            onSaved={handleDreamSaved}
            onCancel={() => handleNavigate("dashboard")}
            existingDreams={dreams}
          />
        )}
        {currentView === "dream-detail" && selectedDream && (
          <DreamDetailView
            dream={selectedDream}
            allDreams={dreams}
            onBack={() => handleNavigate("dashboard")}
            onDreamUpdated={refreshDreams}
          />
        )}
        {currentView === "timeline" && (
          <DreamTimeline
            dreams={dreams}
            onViewDream={handleViewDream}
          />
        )}
        {currentView === "analytics" && (
          <AnalyticsView dreams={dreams} />
        )}
      </main>
    </div>
  );
}
