"use client";

import { useState } from "react";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { PLANS, PlanKey } from "@/lib/stripe";

interface PricingSectionProps {
  currentPlan?: PlanKey;
  onSelectPlan?: (plan: PlanKey) => void;
  isLoggedIn?: boolean;
  userId?: string;
  onAuthRequired?: () => void;
}

export default function PricingSection({
  currentPlan = "free",
  onSelectPlan,
  isLoggedIn,
  userId,
  onAuthRequired,
}: PricingSectionProps) {
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const handleSelect = async (plan: PlanKey) => {
    if (plan === "free") return;
    if (!isLoggedIn && onAuthRequired) {
      onAuthRequired();
      return;
    }

    const planConfig = PLANS[plan];

    // Use Stripe Payment Link if available (direct redirect, no API call needed)
    if (planConfig.paymentLink) {
      setLoading(plan);
      const url = new URL(planConfig.paymentLink);
      if (userId) {
        url.searchParams.set("client_reference_id", userId);
      }
      window.location.href = url.toString();
      return;
    }

    // Fallback to API-based checkout for plans without a payment link
    const priceId = planConfig.priceId;
    if (!priceId) return;

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Checkout failed silently
    } finally {
      setLoading(null);
    }
  };

  const tiers: { key: PlanKey; icon: React.ReactNode; popular?: boolean; gradient: string }[] = [
    {
      key: "free",
      icon: <Zap size={24} className="text-blue-400" />,
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      key: "pro",
      icon: <Sparkles size={24} className="text-dream-400" />,
      popular: true,
      gradient: "from-dream-500/20 to-purple-500/20",
    },
    {
      key: "premium",
      icon: <Crown size={24} className="text-amber-400" />,
      gradient: "from-amber-500/20 to-orange-500/20",
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-20">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-3">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
          Start free and upgrade when you're ready for AI-powered interpretations and advanced insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
        {tiers.map(({ key, icon, popular, gradient }) => {
          const plan = PLANS[key];
          const isCurrent = currentPlan === key;

          return (
            <div
              key={key}
              className={`relative rounded-2xl border p-5 sm:p-6 transition-all ${
                popular
                  ? "border-dream-500/50 bg-gradient-to-b " + gradient + " scale-[1.02] shadow-lg shadow-dream-500/10"
                  : "border-[var(--border-subtle)] bg-[var(--bg-card)]"
              }`}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-dream-500 to-dream-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{plan.name}</h3>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-[var(--text-muted)]">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check size={16} className={popular ? "text-dream-400 mt-0.5 shrink-0" : "text-neuro-400 mt-0.5 shrink-0"} />
                    <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => (onSelectPlan ? onSelectPlan(key) : handleSelect(key))}
                disabled={isCurrent || loading === key}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                  isCurrent
                    ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-default"
                    : popular
                    ? "btn btn-primary w-full"
                    : "btn btn-secondary w-full"
                }`}
              >
                {loading === key
                  ? "Redirecting..."
                  : isCurrent
                  ? "Current Plan"
                  : key === "free"
                  ? "Get Started"
                  : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
