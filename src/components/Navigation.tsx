"use client";

import { View } from "@/app/page";
import type { User } from "@supabase/supabase-js";
import {
  Brain,
  BarChart3,
  Clock,
  Moon,
  Plus,
  CreditCard,
  LogOut,
  User as UserIcon,
} from "lucide-react";

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
  dreamCount: number;
  user?: User | null;
  onLogout?: () => void;
}

export default function Navigation({
  currentView,
  onNavigate,
  dreamCount,
  user,
  onLogout,
}: NavigationProps) {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: "dashboard", label: "Journal", icon: <Moon size={18} /> },
    { view: "timeline", label: "Timeline", icon: <Clock size={18} /> },
    { view: "analytics", label: "Insights", icon: <BarChart3 size={18} /> },
  ];

  return (
    <>
      {/* Desktop / tablet top navigation */}
      <header className="glass sticky top-0 z-50 border-b border-[var(--border-subtle)] hidden sm:block">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                  currentView === item.view
                    ? "bg-dream-500/20 text-dream-300 border border-dream-500/30"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={() => onNavigate("pricing")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                currentView === "pricing"
                  ? "bg-dream-500/20 text-dream-300 border border-dream-500/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              <CreditCard size={18} />
              <span>Pricing</span>
            </button>

            <div className="w-px h-6 bg-[var(--border-subtle)] mx-2" />

            <button
              onClick={() => onNavigate("new-dream")}
              className="btn btn-primary text-sm py-2.5 px-5"
            >
              <Plus size={16} />
              New Dream
            </button>

            {user && onLogout && (
              <>
                <div className="w-px h-6 bg-[var(--border-subtle)] mx-2" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-dream-500/20 border border-dream-500/30 flex items-center justify-center">
                    <UserIcon size={14} className="text-dream-400" />
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
                    title="Sign out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile top bar — compact */}
      <header className="glass sticky top-0 z-50 border-b border-[var(--border-subtle)] sm:hidden">
        <div className="px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dream-400 to-dream-600 flex items-center justify-center shadow-lg shadow-dream-500/20">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
                NeuroDream
              </h1>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("new-dream")}
              className="btn btn-primary text-sm py-2 px-4"
            >
              <Plus size={16} />
              <span>New</span>
            </button>
            {user && onLogout && (
              <button
                onClick={onLogout}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav sm:hidden">
        <div className="flex items-stretch">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`mobile-nav-item relative ${
                currentView === item.view ? "active" : ""
              }`}
            >
              <div className="mobile-nav-indicator" />
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => onNavigate("new-dream")}
            className={`mobile-nav-item relative ${
              currentView === "new-dream" ? "active" : ""
            }`}
          >
            <div className="mobile-nav-indicator" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dream-400 to-dream-600 flex items-center justify-center shadow-md shadow-dream-500/30">
              <Plus size={16} className="text-white" />
            </div>
            <span className="font-medium">Record</span>
          </button>
        </div>
      </nav>
    </>
  );
}
