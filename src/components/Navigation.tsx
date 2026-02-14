"use client";

import { View } from "@/app/page";
import {
  Brain,
  PenLine,
  BarChart3,
  Clock,
  Moon,
  Plus,
} from "lucide-react";

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
  dreamCount: number;
}

export default function Navigation({
  currentView,
  onNavigate,
  dreamCount,
}: NavigationProps) {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: "dashboard", label: "Journal", icon: <Moon size={18} /> },
    { view: "timeline", label: "Timeline", icon: <Clock size={18} /> },
    { view: "analytics", label: "Insights", icon: <BarChart3 size={18} /> },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-dream-400 to-dream-600 flex items-center justify-center shadow-lg shadow-dream-500/20">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-dream-300 transition-colors">
              NeuroDream
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] -mt-0.5 tracking-wider uppercase">
              Dream Wellness Journal
            </p>
          </div>
        </button>

        {/* Nav items */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                currentView === item.view
                  ? "bg-dream-500/20 text-dream-300 border border-dream-500/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}

          <div className="w-px h-6 bg-[var(--border-subtle)] mx-2" />

          <button
            onClick={() => onNavigate("new-dream")}
            className="btn btn-primary text-sm py-2 px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Dream</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
