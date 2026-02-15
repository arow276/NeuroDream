import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Up to 10 dream entries",
      "Basic dream journaling",
      "Emotion & theme tagging",
      "Sleep quality tracking",
      "Basic analytics dashboard",
    ],
    limits: { maxDreams: 10, aiInterpretations: 0, exportEnabled: false },
  },
  pro: {
    name: "Pro",
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited dream entries",
      "AI-powered dream interpretation",
      "Neuroscience-backed insights",
      "Personalized wellness actions",
      "Advanced analytics & trends",
      "Dream pattern detection",
      "Priority support",
    ],
    limits: { maxDreams: Infinity, aiInterpretations: -1, exportEnabled: true },
  },
  premium: {
    name: "Premium",
    price: 19.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Everything in Pro",
      "Priority AI processing",
      "Export dreams as PDF/JSON",
      "Monthly pattern reports",
      "Lucid dreaming techniques",
      "Sleep optimization coaching",
      "Early access to new features",
      "1-on-1 onboarding session",
    ],
    limits: { maxDreams: Infinity, aiInterpretations: -1, exportEnabled: true },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
