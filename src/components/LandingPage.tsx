"use client";

import {
  Brain,
  Heart,
  Sparkles,
  Moon,
  Eye,
  TrendingUp,
  Shield,
  Zap,
  Star,
  ChevronDown,
  ArrowRight,
  BarChart3,
  BookOpen,
  Activity,
} from "lucide-react";
import PricingSection from "./PricingSection";
import { useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-dream-400 to-dream-600 flex items-center justify-center shadow-lg shadow-dream-500/20">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">NeuroDream</h1>
              <p className="text-[10px] text-[var(--text-muted)] -mt-0.5 tracking-wider uppercase hidden sm:block">Dream Wellness Journal</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline">Features</a>
            <a href="#pricing" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline">Pricing</a>
            <a href="#faq" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline">FAQ</a>
            <button onClick={onLogin} className="btn btn-ghost text-sm py-2 px-3">Log In</button>
            <button onClick={onGetStarted} className="btn btn-primary text-sm py-2 px-4">Sign Up</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-28 px-4 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-dream-500/10 border border-dream-500/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <Sparkles size={14} className="text-dream-400" />
            <span className="text-xs text-dream-300 font-medium">Neuroscience meets dream interpretation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-[var(--text-primary)] mb-5 sm:mb-6 leading-tight animate-fade-in">
            Transform Your Dreams Into{" "}
            <span className="bg-gradient-to-r from-dream-400 via-purple-400 to-neuro-400 bg-clip-text text-transparent">
              Waking Wisdom
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            NeuroDream is the first dream journal that combines AI-powered interpretation with
            neuroscience research to deliver actionable wellness insights for your daily life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in">
            <button onClick={onGetStarted} className="btn btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              Start Free Journal
              <ArrowRight size={18} />
            </button>
            <a href="#features" className="btn btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              See How It Works
            </a>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-4">
            Free forever for up to 10 dreams. No credit card required.
          </p>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-6 sm:py-8 border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <StatItem value="10K+" label="Dreams Recorded" />
            <StatItem value="2K+" label="Active Dreamers" />
            <StatItem value="4.8" label="App Rating" icon={<Star size={14} className="text-amber-400 fill-amber-400" />} />
            <StatItem value="92%" label="Recommend It" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-3">
              More Than a Dream Journal
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
              NeuroDream bridges the gap between your dream world and waking life with science-backed tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              icon={<Brain size={24} className="text-dream-400" />}
              title="Neuroscience-Backed Analysis"
              description="Understand which brain regions, sleep stages, and neurochemicals shaped your dream. Grounded in peer-reviewed sleep research."
            />
            <FeatureCard
              icon={<Sparkles size={24} className="text-neuro-400" />}
              title="Context-Aware AI Interpretation"
              description="Our AI considers your life context, stressors, and dream history to provide deeply personalized interpretations."
            />
            <FeatureCard
              icon={<Heart size={24} className="text-rose-400" />}
              title="Wellness Action Plans"
              description="Receive concrete daily actions — from mindfulness to journaling prompts — that bridge dream insights into your waking life."
            />
            <FeatureCard
              icon={<Eye size={24} className="text-blue-400" />}
              title="Lucid Dream Tracking"
              description="Track lucidity levels, identify patterns that trigger awareness, and get techniques to increase lucid dreaming frequency."
            />
            <FeatureCard
              icon={<TrendingUp size={24} className="text-emerald-400" />}
              title="Pattern Recognition"
              description="Discover recurring symbols, emotions, and themes across your dream history with advanced analytics and trend visualization."
            />
            <FeatureCard
              icon={<Shield size={24} className="text-amber-400" />}
              title="Private & Secure"
              description="Your dreams are deeply personal. End-to-end encryption and row-level security ensure only you can access your data."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4 bg-[var(--bg-secondary)]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-3">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">Three simple steps to unlock your dream insights</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              step={1}
              icon={<BookOpen size={28} className="text-dream-400" />}
              title="Record Your Dream"
              description="Capture your dream narrative, emotions, symbols, and sleep context as soon as you wake up."
            />
            <StepCard
              step={2}
              icon={<Activity size={28} className="text-neuro-400" />}
              title="Get AI Analysis"
              description="Receive a neuroscience-backed interpretation with symbolic analysis, emotional themes, and brain region insights."
            />
            <StepCard
              step={3}
              icon={<Heart size={28} className="text-rose-400" />}
              title="Take Wellness Actions"
              description="Follow personalized daily actions that help you integrate dream wisdom into your waking life."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-3">
              What Dreamers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <TestimonialCard
              quote="NeuroDream helped me realize my recurring flying dreams were connected to anxiety about a career change. The wellness actions actually helped me process it."
              name="Sarah K."
              role="Therapist"
              stars={5}
            />
            <TestimonialCard
              quote="I've been lucid dreaming for years but never had a tool that tracks patterns this well. The neuroscience context is fascinating and surprisingly accurate."
              name="Marcus T."
              role="Software Engineer"
              stars={5}
            />
            <TestimonialCard
              quote="The AI interpretations are thoughtful and nuanced — not generic horoscope-style readings. It actually considers what's going on in my life."
              name="Priya M."
              role="Graduate Student"
              stars={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <div className="bg-[var(--bg-secondary)]/30 px-4">
        <PricingSection
          isLoggedIn={false}
          onAuthRequired={onGetStarted}
        />
      </div>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            <FAQItem
              question="Is NeuroDream based on real science?"
              answer="Yes. Our interpretations reference peer-reviewed sleep and neuroscience research, including work on REM sleep, memory consolidation, emotional processing, and the neurobiology of dreaming. We cite specific brain regions, neurochemicals, and research findings."
            />
            <FAQItem
              question="How is this different from other dream journals?"
              answer="Most dream journals are just note-taking apps. NeuroDream combines context-aware AI interpretation, neuroscience analysis, pattern detection, and actionable wellness plans — all personalized to your life situation and dream history."
            />
            <FAQItem
              question="Is my dream data private and secure?"
              answer="Absolutely. We use Supabase with row-level security, meaning your data is encrypted and only accessible by you. We never sell or share your dream data. Your dreams stay yours."
            />
            <FAQItem
              question="What do I get on the free plan?"
              answer="The free plan includes up to 10 dream entries with full journaling features: emotion and theme tagging, sleep quality tracking, and basic analytics. Upgrade to Pro for unlimited dreams and AI-powered interpretations."
            />
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, you can cancel anytime from your account settings. Your data remains accessible even after cancellation — you'll just revert to the free plan limits."
            />
            <FAQItem
              question="Does it help with lucid dreaming?"
              answer="Yes! NeuroDream tracks your lucidity levels, helps identify what triggers awareness in your dreams, and Premium users get access to guided lucid dreaming techniques."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 text-center border-t border-[var(--border-subtle)]">
        <div className="max-w-2xl mx-auto">
          <Moon size={40} className="text-dream-400 mx-auto mb-5 animate-float" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-3">
            Ready to Decode Your Dreams?
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-6">
            Join thousands of dreamers using neuroscience-backed insights to improve their waking lives.
          </p>
          <button onClick={onGetStarted} className="btn btn-primary text-base px-8 py-3.5">
            Start Your Free Journal
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-dream-400" />
            <span className="text-sm text-[var(--text-secondary)]">NeuroDream</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} NeuroDream. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1">
        <span className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{value}</span>
        {icon}
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card-glow p-5 sm:p-6 hover:bg-[var(--bg-card-hover)] transition-all">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, icon, title, description }: { step: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-5 sm:p-6">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dream-500/20 to-dream-700/20 border border-dream-500/30 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="text-xs text-dream-400 font-semibold uppercase tracking-wider mb-2">Step {step}</div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, stars }: { quote: string; name: string; role: string; stars: number }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
        <p className="text-xs text-[var(--text-muted)]">{role}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        <span className="font-medium text-sm sm:text-base text-[var(--text-primary)] pr-4">{question}</span>
        <ChevronDown size={18} className={`text-[var(--text-muted)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
