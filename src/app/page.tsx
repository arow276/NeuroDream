"use client";

import { useState, useEffect, useCallback } from "react";
import { DreamEntry } from "@/types";
import { getDreams } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import DashboardView from "@/components/DashboardView";
import NewDreamEntry from "@/components/NewDreamEntry";
import DreamDetailView from "@/components/DreamDetailView";
import DreamTimeline from "@/components/DreamTimeline";
import AnalyticsView from "@/components/AnalyticsView";
import LandingPage from "@/components/LandingPage";
import PricingSection from "@/components/PricingSection";

export type View = "landing" | "dashboard" | "new-dream" | "dream-detail" | "timeline" | "analytics" | "pricing";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const supabase = createClient();

  // Check auth state
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setCurrentView("dashboard");
      }
      setAuthLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentView("dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshDreams = useCallback(() => {
    setDreams(getDreams());
  }, []);

  useEffect(() => {
    if (user) refreshDreams();
  }, [user, refreshDreams]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView("landing");
  };

  const selectedDream = dreams.find((d) => d.id === selectedDreamId);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dream-400 to-dream-600 flex items-center justify-center animate-pulse-glow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a8.5 8.5 0 0 0 0 17h.5" /><path d="M20 12a8.5 8.5 0 0 0-8.5-8.5" /></svg>
        </div>
      </div>
    );
  }

  // Landing page for unauthenticated users
  if (currentView === "landing" && !user) {
    return (
      <LandingPage
        onGetStarted={() => window.location.href = "/auth/signup"}
        onLogin={() => window.location.href = "/auth/login"}
      />
    );
  }

  // Pricing page (accessible to all)
  if (currentView === "pricing") {
    return (
      <div className="min-h-screen">
        <Navigation
          currentView={currentView}
          onNavigate={handleNavigate}
          dreamCount={dreams.length}
          user={user}
          onLogout={handleLogout}
        />
        <main className="max-w-6xl mx-auto w-full px-4 pb-safe">
          <PricingSection
            isLoggedIn={!!user}
            onAuthRequired={() => window.location.href = "/auth/signup"}
          />
        </main>
      </div>
    );
  }

  // Redirect unauthenticated users to landing
  if (!user) {
    return (
      <LandingPage
        onGetStarted={() => window.location.href = "/auth/signup"}
        onLogin={() => window.location.href = "/auth/login"}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        dreamCount={dreams.length}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 sm:py-6 pb-safe">
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
