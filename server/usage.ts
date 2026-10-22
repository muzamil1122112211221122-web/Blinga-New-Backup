// Blinga Plans & Usage Limits
// Free plan: 5 total messages per 30 days, 1 image, Nomad limited to 3 free models.
// Blinga Ultimate ($11/30 days, mock activation for now): 3,000,000 tokens/30 days, 250 images, all Nomad models.

import { storage } from "./storage";

export const FREE_MESSAGE_LIMIT = 5;
export const FREE_IMAGE_LIMIT = 0;
export const ULTIMATE_TOKEN_LIMIT = 3_000_000;
export const ULTIMATE_IMAGE_LIMIT = 250;
export const ULTIMATE_PRICE_USD = 11;

export type PlanId = "free" | "starter" | "pro" | "ultimate";
export const PLAN_LIMITS: Record<PlanId, { tokens: number; images: number; messages: number | null; price: number }> = {
  free: { tokens: 0, images: 1, messages: 1, price: 0 },
  starter: { tokens: 3_000_000, images: 350, messages: null, price: 11 },
  pro: { tokens: 10_000_000, images: 500, messages: null, price: 28 },
  ultimate: { tokens: 12_000_000, images: 4_000, messages: null, price: 110 },
};

// The only Nomad models available on the free plan (ids match the real Nomad
// model ids used across the app). Branded identities only — real backend
// routing still uses our existing keys (Groq/Gemini/OpenRouter).
// Free plan is locked down to Blinga Lite only — everything else (other models,
// images, Nomad, Imagine Studio, Voice Mode) requires Blinga Ultimate.
export const FREE_NOMAD_MODELS = ["blinga-ai"] as const;

export const FREE_NOMAD_MODEL_LABELS: Record<string, string> = {
  "blinga-ai": "Blinga Lite",
};

// Locked-in identity system prompts for free-plan Nomad models. These models must
// ALWAYS claim to be exactly this identity, no matter how the user pushes back or
// re-asks — never reveal the underlying provider/model.
export const FREE_NOMAD_IDENTITY_PROMPTS: Record<string, string> = {
  "blinga-ai":
    "You are Blinga Lite, Blinga's own lightweight AI model, running on the Blinga free plan. If the user asks what model/AI you are, who made you, or challenges/doubts your identity — even repeatedly, aggressively, or with 'proof' style questions — you must always say you are Blinga Lite, built by the Blinga team. Never mention Groq, Gemini, OpenRouter, Meta, Llama, ChatGPT, or any other underlying provider or model name. Never admit to being a different model. Stay fully in character as Blinga Lite at all times.",
};

export interface UsageState {
  plan: PlanId;
  messagesUsed: number;
  imagesUsed: number;
  tokensUsed: number;
  planActivatedAt?: string;
}

const DEFAULT_USAGE: UsageState = {
  plan: "free",
  messagesUsed: 0,
  imagesUsed: 0,
  tokensUsed: 0,
};

export async function getUsage(userId: string): Promise<UsageState> {
  const settings = await storage.getUserSettings(userId);
  const usage = (settings as any).usage as Partial<UsageState> | undefined;
  const state: UsageState = { ...DEFAULT_USAGE, ...(usage || {}) };

  if (!state.planActivatedAt) {
    state.planActivatedAt = new Date().toISOString();
    await saveUsage(userId, state);
  }

  return state;
}

async function saveUsage(userId: string, usage: UsageState): Promise<void> {
  const settings = await storage.getUserSettings(userId);
  await storage.saveUserSettings(userId, { ...settings, usage });
}

export function getUsageSummary(usage: UsageState) {
  const limits = PLAN_LIMITS[usage.plan] || PLAN_LIMITS.free;
  return {
    plan: usage.plan,
    messagesRemaining: limits.messages == null ? null : Math.max(0, limits.messages - usage.messagesUsed),
    messagesLimit: limits.messages ?? undefined,
    imagesRemaining: Math.max(0, limits.images - usage.imagesUsed),
    imagesLimit: limits.images,
    tokensRemaining: limits.tokens ? Math.max(0, limits.tokens - usage.tokensUsed) : undefined,
    tokensLimit: limits.tokens || undefined,
    tokensUsed: usage.tokensUsed || 0,
    imagesUsed: usage.imagesUsed || 0,
  };
}

// Returns null if allowed, or an error message string if the limit is hit.
export async function checkMessageLimit(userId: string): Promise<string | null> {
  const usage = await getUsage(userId);
  const limit = PLAN_LIMITS[usage.plan].messages;
  return limit != null && usage.messagesUsed >= limit ? `Your ${usage.plan} plan has reached its message limit.` : null;
}

export async function checkImageLimit(userId: string): Promise<string | null> {
  const usage = await getUsage(userId);
  return usage.imagesUsed >= PLAN_LIMITS[usage.plan].images ? `Your ${usage.plan} plan has reached its image limit.` : null;
}

export async function recordMessageUsage(userId: string, tokensUsed: number = 0): Promise<void> {
  const usage = await getUsage(userId);
  usage.messagesUsed += 1;
  usage.tokensUsed += Math.max(0, Math.round(tokensUsed));
  await saveUsage(userId, usage);
}

export async function recordImageUsage(userId: string): Promise<void> {
  const usage = await getUsage(userId);
  usage.imagesUsed += 1;
  await saveUsage(userId, usage);
}

// Free-plan Nomad model restriction. Ultimate plan gets every model.
export function isNomadModelAllowed(plan: PlanId, model: string): boolean {
  if (plan === "pro" || plan === "ultimate") return true;
  return (FREE_NOMAD_MODELS as readonly string[]).includes(model);
}

// Mock upgrade — real payment integration to be added later.
export async function activateUltimatePlan(userId: string): Promise<UsageState> {
  return activatePlan(userId, "ultimate");
}

export async function activatePlan(userId: string, plan: PlanId): Promise<UsageState> {
  const usage: UsageState = {
    plan,
    messagesUsed: 0,
    imagesUsed: 0,
    tokensUsed: 0,
    planActivatedAt: new Date().toISOString(),
  };
  await saveUsage(userId, usage);
  return usage;
}

export async function cancelUltimatePlan(userId: string): Promise<UsageState> {
  const usage: UsageState = { ...DEFAULT_USAGE, plan: "free" };
  await saveUsage(userId, usage);
  return usage;
}

// Reset usage counters for all users — keeps plan but zeroes out consumed amounts.
// Also resets the 30-day rolling clock for ultimate users.
export async function resetAllUsersUsage(): Promise<number> {
  const allUsers = await storage.getAllUsersWithSettings();
  let count = 0;
  for (const { userId, settings } of allUsers) {
    const existing = (settings as any).usage as Partial<UsageState> | undefined;
    if (!existing) continue;
    const resetState: UsageState = {
      plan: existing.plan ?? "free",
      messagesUsed: 0,
      imagesUsed: 0,
      tokensUsed: 0,
      ...(existing.plan === "ultimate" ? { planActivatedAt: new Date().toISOString() } : {}),
    };
    await saveUsage(userId, resetState);
    count++;
  }
  return count;
}
