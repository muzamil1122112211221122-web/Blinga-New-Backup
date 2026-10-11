import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  ChevronDown,
  Layers,
  Image as Img,
  Mic,
  Zap,
  MessageSquare,
  Sparkles,
  Bot,
  ArrowRight,
  Check,
  ShieldCheck,
  Cpu,
  Globe,
  Code2,
  FileText,
  Search,
  Palette,
  Compass,
  CheckCircle2,
  Lock,
  Flame,
  Plus
} from "lucide-react";

// AI Models Pill list
const MODELS_LIST = [
  { name: "ChatGPT 5", provider: "OpenAI", logo: "/chatgpt-logo.svg" },
  { name: "Claude Sonnet 4", provider: "Anthropic", logo: "/claude-logo.svg" },
  { name: "Gemini 3.1 Pro", provider: "Google", logo: "/gemini-logo.svg" },
  { name: "Perplexity Sonar", provider: "Perplexity", logo: "/perplexity-logo.svg" },
  { name: "DeepSeek v3", provider: "DeepSeek", logo: "/deepseek-logo.svg" },
  { name: "Grok 4", provider: "xAI", logo: "/grok-logo.svg" },
  { name: "Blinga Pro", provider: "Blinga", logo: "/blinga-logo.png" },
  { name: "Blinga Lite", provider: "Blinga", logo: "/blinga-logo.png" },
  { name: "Kimi K2.5", provider: "Moonshot", logo: "/kimi-logo.svg" },
  { name: "Qwen 3.6 Plus", provider: "Alibaba", logo: "/qwen-logo.svg" },
  { name: "Mistral Small 4", provider: "Mistral", logo: "/mistral-logo.png" },
  { name: "Command R+", provider: "Cohere", logo: "/cohere-logo.svg" },
];

// Feature Cards under "Everything you need to work smarter"
const WORK_SMARTER_FEATURES = [
  {
    tag: "Nomad Comparison",
    title: "Side-by-side Multi-AI Answers",
    desc: "Ask one question and view responses from GPT-5, Claude, Gemini, and Grok side by side in real time.",
    icon: Layers,
    color: "from-blue-500/10 to-teal-500/10",
    badge: "Exclusive"
  },
  {
    tag: "Imagine Studio",
    title: "Instant AI Image Creation & Styles",
    desc: "Generate stunning 4K visuals, anime art, cinematic graphics, and product renders with curated prompts.",
    icon: Img,
    color: "from-amber-500/10 to-orange-500/10",
    badge: "Creative Suite"
  },
  {
    tag: "Voice Interaction",
    title: "Natural Hands-free Voice AI",
    desc: "Talk directly to any frontier model with natural cadence, zero latency, and fluid speech synthesis.",
    icon: Mic,
    color: "from-purple-500/10 to-pink-500/10",
    badge: "Real-time"
  },
  {
    tag: "Prompt Optimizer",
    title: "Automatic 10x Prompt Enhancer",
    desc: "One click transforms basic prompts into detailed, structured instructions that yield expert-level results.",
    icon: Zap,
    color: "from-emerald-500/10 to-cyan-500/10",
    badge: "Smart Engine"
  },
  {
    tag: "Documents & Memory",
    title: "Export to PDF & Persistent Context",
    desc: "Create full presentation slides, technical documentation, or long-form notes with persistent memory.",
    icon: FileText,
    color: "from-indigo-500/10 to-violet-500/10",
    badge: "Productivity"
  },
  {
    tag: "Blinga Ultimatum",
    title: "Automated Intent-based Model Routing",
    desc: "Never guess which AI to pick. Our smart router automatically directs your prompt to the best frontier engine.",
    icon: Sparkles,
    color: "from-yellow-500/10 to-amber-500/10",
    badge: "AI Router"
  }
];

const FAQS = [
  {
    q: "What is Blinga and how does one subscription give me all models?",
    a: "Blinga unifies all leading AI frontier models (ChatGPT 5, Claude Sonnet 4, Gemini 3.1 Pro, DeepSeek v3, Grok 4, and more) into a single high-performance workspace. Instead of paying $20/month each to 5+ different providers, one Blinga subscription unlocks them all."
  },
  {
    q: "What are the 4 plans available on Blinga?",
    a: "We offer Free ($0), Beginner ($11/mo), Pro ($28/mo), and Blinga Max ($110/mo). Free is great for testing with 5 monthly messages. Beginner offers 3M tokens with all models & voice mode. Pro expands to 10M tokens with AI video tools. Max offers 15M total tokens, Nano Agents, Coder tools, and highest tier processing."
  },
  {
    q: "What is the Nomad mode?",
    a: "Nomad is our signature multi-model comparison interface. Send a single prompt and watch 2 to 4 AI models answer simultaneously in synchronized columns so you can compare logic, speed, and depth."
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Yes, you can upgrade, downgrade, or cancel anytime directly from your settings. You will retain full access until the end of your billing cycle."
  },
  {
    q: "Are my chat conversations private and secure?",
    a: "Yes. Your chats and generated images are private to your account. We never sell your data or use your conversations to train public third-party models."
  }
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [compareTab, setCompareTab] = useState<"sideBySide" | "autoRoute" | "voiceMode">("sideBySide");

  const go = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setLocation("/start");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ── Top Header Navigation ──────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FDFCFB]/85 backdrop-blur-md border-b border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <Logo size="sm" className="text-zinc-900" />
            <span className="text-xl font-extrabold tracking-tight text-zinc-900">Blinga</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#models" className="hover:text-zinc-900 transition-colors">AI Models</a>
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#comparison" className="hover:text-zinc-900 transition-colors">Nomad Mode</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/start")}
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 px-4 py-2 transition-colors"
            >
              Sign In
            </button>
            <Button
              onClick={() => go()}
              className="rounded-full px-5 py-2.5 text-sm font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm transition-all hover:shadow"
            >
              Start Free
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Soft radial background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-teal-50/70 via-emerald-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The All-In-One Frontier AI Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] mb-6">
            World&apos;s Best AI Models &amp; Tools.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-zinc-900">
              One Unified Workspace.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Access ChatGPT 5, Claude Sonnet 4, Gemini 3.1 Pro, Grok 4, DeepSeek, and custom Blinga models in one subscription without juggling multiple apps.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              onClick={() => go()}
              size="lg"
              className="rounded-full px-8 py-6 text-base font-bold bg-zinc-950 text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a
              href="#pricing"
              className="px-7 py-3.5 text-sm font-semibold text-zinc-700 hover:text-zinc-950 bg-white border border-zinc-200 rounded-full shadow-sm hover:border-zinc-300 transition-all"
            >
              Compare 4 Plans
            </a>
          </div>

          {/* Hero UI Mockup Frame (Real UI placeholder to be updated with screenshots) */}
          <div className="relative mx-auto max-w-4xl rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-teal-400/30 via-emerald-200/20 to-zinc-200/40 shadow-2xl border border-white/60">
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner">
              {/* App bar header */}
              <div className="h-10 bg-zinc-900/90 border-b border-zinc-800/80 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-800/60 px-3 py-1 rounded-md">
                  <Logo size="sm" className="w-4 h-4" />
                  <span>blinga.ai/workspace</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Interface Workspace Showcase */}
              <div className="p-6 sm:p-10 text-left bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-[380px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Nomad Live Mode</span>
                    <span className="text-sm font-semibold text-zinc-300">Comparing 4 Models simultaneously</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {MODELS_LIST.slice(0, 5).map((m) => (
                      <div key={m.name} className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden" title={m.name}>
                        <img src={m.logo} alt={m.name} className="w-4 h-4 object-contain" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/chatgpt-logo.svg" alt="" className="w-4 h-4" />
                      <span className="text-xs font-bold text-zinc-200">ChatGPT 5</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Comprehensive step-by-step breakdown with intuitive structure and edge-case validation.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/claude-logo.svg" alt="" className="w-4 h-4" />
                      <span className="text-xs font-bold text-zinc-200">Claude Sonnet 4</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Clean idiomatic code, robust safety protocols, and deep conversational nuance.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/gemini-logo.svg" alt="" className="w-4 h-4" />
                      <span className="text-xs font-bold text-zinc-200">Gemini 3.1 Pro</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Multimodal synthesis with 2M token memory buffer and instant citation linking.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/40">
                  <span>Prompt: &ldquo;Refactor this microservice architecture and benchmark async response times&rdquo;</span>
                  <span className="text-emerald-400 font-medium">All responses complete (1.2s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS BAR ───────────────────────────────────────────── */}
      <section id="models" className="py-12 border-y border-zinc-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
            Leading AI Engines Available On Blinga
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
            {MODELS_LIST.map((model) => (
              <div key={model.name} className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors">
                <img src={model.logo} alt={model.name} className="w-5 h-5 object-contain" />
                <span className="text-xs font-bold text-zinc-800">{model.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL MODELS SHOWCASE (100+ Leading Models) ────────────── */}
      <section className="py-24 bg-[#F8F7F5] border-b border-zinc-200/60">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mb-4 tracking-tight">
            Top AI Models. All Right Here.
          </h2>
          <p className="text-zinc-600 max-w-xl mx-auto text-base mb-12">
            Switch effortlessly between world-class models specialized for reasoning, code creation, live search, and creative output.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {MODELS_LIST.map((m) => (
              <div
                key={m.name}
                className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
                  <img src={m.logo} alt={m.name} className="w-6 h-6 object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate leading-snug">{m.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{m.provider}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOMAD SIDE BY SIDE COMPARISON ───────────────────────── */}
      <section id="comparison" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Only On Blinga
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 mt-4 mb-4 tracking-tight">
              Test &amp; Compare Without Switching Tabs.
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg">
              Never get stuck with a subpar answer. Test prompts against multiple state-of-the-art models side-by-side.
            </p>

            {/* Sub-selector pills */}
            <div className="inline-flex p-1 bg-zinc-100 rounded-full mt-8">
              <button
                onClick={() => setCompareTab("sideBySide")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  compareTab === "sideBySide" ? "bg-white shadow-sm text-zinc-950" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Side-by-Side Nomad
              </button>
              <button
                onClick={() => setCompareTab("autoRoute")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  compareTab === "autoRoute" ? "bg-white shadow-sm text-zinc-950" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Ultimatum Auto-Router
              </button>
              <button
                onClick={() => setCompareTab("voiceMode")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  compareTab === "voiceMode" ? "bg-white shadow-sm text-zinc-950" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Voice-to-Voice
              </button>
            </div>
          </div>

          {/* Interactive display box */}
          <div className="rounded-3xl border border-zinc-200/80 bg-[#FAFAFA] p-6 sm:p-10 shadow-sm">
            {compareTab === "sideBySide" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <img src="/chatgpt-logo.svg" alt="" className="w-5 h-5" />
                      <span className="font-bold text-sm text-zinc-900">ChatGPT 5</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Detailed Analysis</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    &ldquo;Here is the architectural pattern for scalable realtime queues. We implement Redis Pub/Sub with persistent worker backoff...&rdquo;
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <img src="/claude-logo.svg" alt="" className="w-5 h-5" />
                      <span className="font-bold text-sm text-zinc-900">Claude Sonnet 4</span>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">Clean Implementation</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    &ldquo;To keep latency below 15ms, prefer a decoupled event-driven consumer loop. Here is the TypeScript implementation with type safety...&rdquo;
                  </p>
                </div>
              </div>
            )}

            {compareTab === "autoRoute" && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center max-w-2xl mx-auto">
                <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Blinga Ultimatum Intent Engine</h3>
                <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                  You type naturally, and our classifier instantly routes code to DeepSeek/Claude, real-time news to Perplexity, and creative briefs to GPT-5 or Blinga Pro.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 bg-zinc-50 py-3 px-4 rounded-xl border border-zinc-100">
                  <span>Prompt: &ldquo;Solve quadratic differential equation&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-emerald-700 font-bold">Auto-routed to Gemini 3.1 Pro (Math Specialist)</span>
                </div>
              </div>
            )}

            {compareTab === "voiceMode" && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Mic className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Live Hands-Free Conversations</h3>
                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  Experience natural voice conversations with human-like latency. Brainstorm ideas during your commute, practice language skills, or dictate entire essays hands-free.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── WORK SMARTER FEATURES GRID ──────────────────────────── */}
      <section id="features" className="py-24 bg-[#F8F7F5] border-t border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mb-3 tracking-tight">
              Everything You Need to Work Smarter.
            </h2>
            <p className="text-zinc-600 text-base">
              Beyond chat. Complete workflow superpowers built for creators, engineers, and researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORK_SMARTER_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-900">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                        {feat.badge}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{feat.tag}</span>
                    <h3 className="text-lg font-bold text-zinc-900 mt-1 mb-2.5 leading-snug">{feat.title}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 PLANS PRICING TABLE (Free, Beginner, Pro, Max) ─────── */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white via-teal-50/20 to-[#FDFCFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pricing Options
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 mt-4 mb-4 tracking-tight">
              One Plan. Unmatched Value.
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg mb-8">
              Pick the right tier for your usage. Transparent allowances with no surprise overages.
            </p>

            {/* Monthly / Yearly billing toggle */}
            <div className="inline-flex items-center p-1 bg-zinc-100 rounded-full border border-zinc-200/70">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  !isYearly ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  isYearly ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Yearly <span className="ml-1 text-[10px] text-emerald-700 font-extrabold">Save 15%</span>
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* 1. FREE PLAN */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 flex flex-col justify-between shadow-sm hover:border-zinc-300 transition-all">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Free</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-zinc-950">$0</span>
                  <span className="text-xs text-zinc-500">/ forever</span>
                </div>
                <p className="text-xs text-zinc-500 mb-6">Explore basic features with zero payment.</p>

                <ul className="space-y-3 text-xs text-zinc-600 mb-8 border-t border-zinc-100 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Select base models (Blinga Lite)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>5 messages per 30-day period</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>1 image generation</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-400">
                    <span className="w-4 h-4 text-center leading-4 text-zinc-300">✕</span>
                    <span>No Frontier models (GPT-5/Claude)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-400">
                    <span className="w-4 h-4 text-center leading-4 text-zinc-300">✕</span>
                    <span>No Nomad side-by-side mode</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => go()}
                variant="outline"
                className="w-full rounded-full py-5 text-xs font-bold border-zinc-300 text-zinc-800 hover:bg-zinc-50"
              >
                Start Free
              </Button>
            </div>

            {/* 2. BEGINNER PLAN */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 flex flex-col justify-between shadow-sm hover:border-zinc-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Beginner</p>
                  <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">Starter</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-zinc-950">${isYearly ? "110" : "11"}</span>
                  <span className="text-xs text-zinc-500">/{isYearly ? "yr" : "30 days"}</span>
                </div>
                <p className="text-xs text-zinc-500 mb-6">Everything needed for daily personal work.</p>

                <ul className="space-y-3 text-xs text-zinc-600 mb-8 border-t border-zinc-100 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>10+ Frontier AI Models</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Nomad Side-by-Side Mode</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>3,000,000 tokens included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>250 AI Image Generations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Voice-to-voice interaction</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Prompt optimizer &amp; history</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => go()}
                className="w-full rounded-full py-5 text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800"
              >
                Upgrade to Beginner
              </Button>
            </div>

            {/* 3. PRO PLAN (Popular Highlight) */}
            <div className="relative bg-white rounded-3xl border-2 border-emerald-600/90 p-8 flex flex-col justify-between shadow-xl scale-[1.02] z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">Pro</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-zinc-950">${isYearly ? "280" : "28"}</span>
                  <span className="text-xs text-zinc-500">/{isYearly ? "yr" : "30 days"}</span>
                </div>
                <p className="text-xs text-zinc-500 mb-6">For engineers, writers &amp; heavy daily creators.</p>

                <ul className="space-y-3 text-xs text-zinc-700 mb-8 border-t border-zinc-100 pt-6">
                  <li className="flex items-center gap-2.5 font-semibold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Everything in Beginner, plus:</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>10,000,000 tokens included</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>AI Video Suite &amp; timelines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Multiple Projects &amp; workspaces</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Priority compute server queues</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => go()}
                className="w-full rounded-full py-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                Upgrade to Pro
              </Button>
            </div>

            {/* 4. BLINGA MAX PLAN */}
            <div className="bg-zinc-950 text-white rounded-3xl border border-zinc-800 p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Blinga Max</p>
                  <span className="text-[10px] font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">Enterprise Grade</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">${isYearly ? "1100" : "110"}</span>
                  <span className="text-xs text-zinc-400">/{isYearly ? "yr" : "30 days"}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6">Unrestricted power for developers and agencies.</p>

                <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-zinc-800 pt-6">
                  <li className="flex items-center gap-2.5 font-semibold text-white">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Everything in Pro, plus:</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>12,000,000 normal tokens</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>3,000,000 Coder tokens</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Blinga Nano Autonomous Agents</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Blinga Designer &amp; Coder IDE tools</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Highest priority throughput</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => go()}
                className="w-full rounded-full py-5 text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200"
              >
                Upgrade to Max
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ SECTION (Two Columns style matching reference) ──── */}
      <section id="faq" className="py-24 bg-white border-t border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left FAQ headline */}
            <div className="lg:col-span-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Support &amp; Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mt-4 mb-4 tracking-tight">
                Got Questions About Blinga?
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                Here are answers to common questions about accounts, token quotas, and model comparisons.
              </p>
              <Button
                onClick={() => go()}
                variant="outline"
                className="rounded-full text-xs font-bold border-zinc-300 text-zinc-800 hover:bg-zinc-50"
              >
                Contact Support
              </Button>
            </div>

            {/* Right Accordions */}
            <div className="lg:col-span-8 space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200/80 bg-[#FAFAFA] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4.5 text-left text-sm font-bold text-zinc-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 pt-1 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION BANNER (Dark Theme) ───────────── */}
      <section className="py-16 bg-[#FDFCFB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-14 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Instant Access
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3 tracking-tight">
                Bring Every Top AI Model To Your Workflow Today.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Start for free with zero risk. Upgrade whenever you need serious multi-model token throughput.
              </p>
              <Button
                onClick={() => go()}
                size="lg"
                className="rounded-full px-8 py-5 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-lg"
              >
                Create Free Account
              </Button>
            </div>

            <div className="relative z-10 flex-shrink-0 w-full md:w-auto flex justify-center">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 w-full max-w-xs shadow-inner">
                <div className="flex items-center gap-2 mb-4">
                  <Logo size="sm" className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Blinga Hub</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span>Frontier Models</span>
                    <span className="text-white font-semibold">10+ Engines</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span>Side-by-side</span>
                    <span className="text-emerald-400 font-semibold">Enabled</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Setup time</span>
                    <span className="text-white font-semibold">&lt; 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200/80 py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Big Stylized Blinga Brand Text like reference screenshot */}
          <div className="mb-10 select-none pointer-events-none">
            <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-zinc-100 uppercase">
              Blinga
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="sm" className="text-zinc-900" />
            <span className="text-lg font-extrabold text-zinc-900">Blinga AI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-zinc-500 mb-6">
            <a href="#models" className="hover:text-zinc-900 transition-colors">AI Models</a>
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#comparison" className="hover:text-zinc-900 transition-colors">Nomad Mode</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</a>
            <button onClick={() => setLocation("/privacy")} className="hover:text-zinc-900 transition-colors">Privacy</button>
            <button onClick={() => setLocation("/terms")} className="hover:text-zinc-900 transition-colors">Terms</button>
          </div>

          <p className="text-zinc-400 text-xs">
            &copy; 2026 Blinga. All rights reserved. &middot; Made to Shine!
          </p>
        </div>
      </footer>

    </div>
  );
}
