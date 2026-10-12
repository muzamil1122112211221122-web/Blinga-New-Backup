import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);
import {
  ChevronDown,
  Layers,
  Image as Img,
  Mic,
  Zap,
  Sparkles,
  ArrowRight,
  Check,
  FileText
} from "lucide-react";

// All Nomad Model Switcher sub-models categorized by provider for animated pill ticker
const NOMAD_ALL_MODELS_ROW_1 = [
  { name: "ChatGPT 5", provider: "OpenAI", logo: "/chatgpt-logo.svg" },
  { name: "GPT-5 mini", provider: "OpenAI", logo: "/chatgpt-logo.svg" },
  { name: "GPT-5 Pro", provider: "OpenAI", logo: "/chatgpt-logo.svg" },
  { name: "Claude Haiku 4.5", provider: "Anthropic", logo: "/claude-logo.svg" },
  { name: "Claude Sonnet 5", provider: "Anthropic", logo: "/claude-logo.svg" },
  { name: "Claude Opus 4.8", provider: "Anthropic", logo: "/claude-logo.svg" },
  { name: "Gemini 3.5 Flash-Lite", provider: "Google", logo: "/gemini-logo.svg" },
  { name: "Gemini 3.6 Flash", provider: "Google", logo: "/gemini-logo.svg" },
  { name: "Gemini 3.1 Pro", provider: "Google", logo: "/gemini-logo.svg" },
  { name: "Perplexity Sonar", provider: "Perplexity", logo: "/perplexity-logo.png" },
  { name: "Perplexity Sonar Pro", provider: "Perplexity", logo: "/perplexity-logo.png" },
  { name: "Sonar Deep Research", provider: "Perplexity", logo: "/perplexity-logo.png" },
  { name: "Grok Build 0.1", provider: "xAI", logo: "/grok-logo.svg" },
  { name: "Grok 4.3", provider: "xAI", logo: "/grok-logo.svg" },
  { name: "Grok 4.5", provider: "xAI", logo: "/grok-logo.svg" },
  { name: "DeepSeek V4 Flash", provider: "DeepSeek", logo: "/deepseek-logo.svg" },
  { name: "DeepSeek V4 Pro", provider: "DeepSeek", logo: "/deepseek-logo.svg" },
];

const NOMAD_ALL_MODELS_ROW_2 = [
  { name: "Blinga Lite", provider: "Blinga", logo: "/blinga-rings-light.svg" },
  { name: "Blinga Pro", provider: "Blinga", logo: "/blinga-rings-light.svg" },
  { name: "Doubao Seed 2.0 Mini", provider: "SeedDance", logo: "/bytedance-logo.svg" },
  { name: "Doubao Seed 2.0 Lite", provider: "SeedDance", logo: "/bytedance-logo.svg" },
  { name: "Doubao Seed 2.0 Pro", provider: "SeedDance", logo: "/bytedance-logo.svg" },
  { name: "Kimi K2.6", provider: "Moonshot", logo: "/kimi-logo.svg" },
  { name: "Kimi K2.7 Code", provider: "Moonshot", logo: "/kimi-logo.svg" },
  { name: "Kimi K3", provider: "Moonshot", logo: "/kimi-logo.svg" },
  { name: "Qwen 3.5 Flash", provider: "Alibaba", logo: "/qwen-logo.png" },
  { name: "Qwen 3.5 Plus", provider: "Alibaba", logo: "/qwen-logo.png" },
  { name: "Qwen 3.7 Max", provider: "Alibaba", logo: "/qwen-logo.png" },
  { name: "Qwen Coder", provider: "Alibaba", logo: "/qwen-logo.png" },
  { name: "Llama 4 Scout", provider: "Meta", logo: "/llama-logo.svg" },
  { name: "Llama 4 Maverick", provider: "Meta", logo: "/llama-logo.svg" },
  { name: "Ministral 3", provider: "Mistral", logo: "/mistral-logo.png" },
  { name: "Mistral Small 4", provider: "Mistral", logo: "/mistral-logo.png" },
  { name: "Command R+", provider: "Cohere", logo: "/cohere-logo.svg" },
  { name: "Nova Pro", provider: "Amazon", logo: "/amazon-logo.svg" },
];

// Feature Cards under "Everything you need to work smarter"
const WORK_SMARTER_FEATURES = [
  {
    tag: "Nomad Comparison",
    title: "Side-by-side Multi-AI Answers",
    desc: "Ask one question and view responses from GPT-5, Claude, Gemini, and Grok side by side in real time.",
    icon: Layers,
    badge: "Exclusive",
    image: "/landing-nomad.png"
  },
  {
    tag: "Imagine Studio",
    title: "Instant AI Image Creation & Styles",
    desc: "Generate stunning 4K visuals, anime art, cinematic graphics, and product renders with curated prompts.",
    icon: Img,
    badge: "Creative Suite",
    image: "/landing-imagine-studio.png"
  },
  {
    tag: "Minds",
    title: "Talk to Dead Personalities",
    desc: "Step into character-led conversations with historical minds and distinctive personalities, designed for thoughtful, memorable exploration.",
    icon: Sparkles,
    badge: "Explore",
    image: "/feature-minds.png"
  },
  {
    tag: "Prompt Optimizer",
    title: "Automatic 10x Prompt Enhancer",
    desc: "One click transforms basic prompts into detailed, structured instructions that yield expert-level results.",
    icon: Zap,
    badge: "Smart Engine"
  },
  {
    tag: "Summarize",
    title: "Summarize Responses",
    desc: "Bring multiple model responses together and turn them into a concise overview of the key information, agreements, and critical details.",
    icon: FileText,
    badge: "Productivity",
    image: "/feature-summarize.jpg"
  },
  {
    tag: "Blinga Ultimatum",
    title: "Automated Intent-based Model Routing",
    desc: "Never guess which AI to pick. Our smart router automatically directs your prompt to the best frontier engine.",
    icon: Sparkles,
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
  },
  {
    q: "Which AI models can I use with Blinga?",
    a: "Blinga brings leading models from OpenAI, Anthropic, Google, xAI, Perplexity, Meta, DeepSeek, and more into one workspace through Nomad."
  },
  {
    q: "How do tokens and model usage work?",
    a: "Each plan includes a clear token allowance. Normal and Coder tokens are tracked separately so you can choose the right plan for writing, research, coding, and agent workflows."
  },
  {
    q: "Can I use Blinga for image generation and creative work?",
    a: "Yes. Blinga includes creative workflows for image generation, visual exploration, writing, research, voice, and multi-model projects depending on your plan."
  }
];

const PRICE_COMPARER_MODELS = [
  { name: "ChatGPT", price: 20, logo: "/chatgpt-logo.svg" },
  { name: "Claude", price: 20, logo: "/claude-logo.svg" },
  { name: "Gemini", price: 20, logo: "/gemini-logo.svg" },
  { name: "Perplexity", price: 20, logo: "/perplexity-logo.png" },
  { name: "Qwen", price: 0, logo: "/qwen-logo.png" },
  { name: "Meta", price: 0, logo: "/llama-logo.svg" },
  { name: "Grok", price: 30, logo: "/grok-logo.svg" },
  { name: "DeepSeek", price: 0, logo: "/deepseek-logo.svg" },
  { name: "Mistral", price: 15, logo: "/mistral-logo.png" },
  { name: "ByteDance", price: 10, logo: "/bytedance-logo.svg" },
  { name: "Moonshot", price: 19, logo: "/kimi-logo.svg" },
  { name: "Kling", price: 9, logo: "https://aifiesta.ai/static/images/calc-kling.png" },
  { name: "Runway", price: 15, logo: "https://aifiesta.ai/static/images/calc-runway.png" },
  { name: "Cohere", price: 0, logo: "/cohere-logo.svg" },
  { name: "MiniMax", price: 22, logo: "https://aifiesta.ai/static/images/calc-minimax.svg" },
  { name: "Amazon", price: 0, logo: "/amazon-logo.svg" },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedAiModels, setSelectedAiModels] = useState(["ChatGPT", "Claude", "Gemini"]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [compareTab, setCompareTab] = useState<"sideBySide" | "autoRoute" | "voiceMode">("sideBySide");

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: true,
    });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const reveals = gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]");
    const revealTweens = reveals.map((element) => gsap.fromTo(element,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } }
    ));
    const handleSmoothAnchor = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute("href") || "");
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -88, duration: 0.85, immediate: false });
    };
    const ctaButtons = Array.from(document.querySelectorAll<HTMLElement>(".blinga-reactive-cta"));
    const handleCtaPointer = (event: PointerEvent) => {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      button.style.setProperty("--glow-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      button.style.setProperty("--glow-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };
    ctaButtons.forEach((button) => button.addEventListener("pointermove", handleCtaPointer));
    document.addEventListener("click", handleSmoothAnchor);
    return () => {
      document.removeEventListener("click", handleSmoothAnchor);
      ctaButtons.forEach((button) => button.removeEventListener("pointermove", handleCtaPointer));
      cancelAnimationFrame(rafId);
      revealTweens.forEach((tween) => tween.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  const go = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setLocation("/start");
  };

  return (
    <div className="min-h-screen text-zinc-900 selection:bg-amber-100 selection:text-amber-900" style={{ fontFamily: "Poppins, sans-serif", background: "linear-gradient(180deg, #fffef5 0%, #ffffff 42%, #fffef7 100%)" }}>
      <style>{`
        [class*="text-sky-"], [class*="text-blue-"], [class*="text-indigo-"] { color: rgb(180 83 9) !important; }
        [class*="bg-sky-"], [class*="bg-blue-"], [class*="bg-indigo-"] { background-color: rgb(255 251 235) !important; }
        [class*="border-sky-"], [class*="border-blue-"], [class*="border-indigo-"] { border-color: rgb(253 230 138) !important; }
        [class*="shadow-sky-"], [class*="shadow-blue-"], [class*="shadow-indigo-"] { --tw-shadow-color: rgb(245 158 11 / 0.2) !important; }
        @keyframes blingaCtaGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .blinga-reactive-cta { --glow-x: 78%; --glow-y: 50%; }
        .blinga-cta-gradient { position: relative; isolation: isolate; overflow: hidden; background: linear-gradient(110deg, #ffffff 0%, #fffdf0 25%, #facc15 50%, #fffdf0 75%, #ffffff 100%); background-size: 300% 300%; animation: blingaCtaGradient 4s ease-in-out infinite; transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease; }
        .blinga-cta-gradient::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: radial-gradient(circle 180px at var(--glow-x) var(--glow-y), rgba(252,198,3,.95) 0%, rgba(255,222,89,.7) 32%, rgba(245,158,11,.35) 58%, transparent 80%), radial-gradient(circle 150px at 65% 50%, rgba(254,240,138,.45), transparent 80%); opacity: .95; mix-blend-mode: multiply; transition: background-position .15s ease-out; }
        .blinga-cta-gradient:hover { transform: scale(1.06); box-shadow: 0 18px 34px -12px rgba(245,158,11,.45); }
        .blinga-cta-gradient svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .blinga-cta-gradient:hover svg { transform: translateX(5px); }
        .plan-card { position: relative; isolation: isolate; }
        .plan-card::before { display: none; }
        .plan-card-pro { background: linear-gradient(180deg, #fffdf2 0%, #ffffff 32%, #fffaf0 100%); }
        .plan-card-max { background: radial-gradient(circle at 85% 0%, rgba(245,158,11,.16), transparent 34%), #101012; }
        .plan-card:hover { box-shadow: 0 24px 50px -24px rgba(120,80,10,.35); }
      `}</style>
      
      {/* ── Top Header Navigation ──────────────────────────────── */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between rounded-full border border-zinc-200/70 bg-[#FCFCFC] shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <Logo size="sm" className="text-zinc-900" />
            <span className="text-xl font-bold tracking-tight text-zinc-900">Blinga</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#models" className="hover:text-amber-600 transition-colors">AI Models</a>
            <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
            <a href="#comparison" className="hover:text-amber-600 transition-colors">Nomad Mode</a>
            <a href="#pricing" className="hover:text-amber-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-amber-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/start")}
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 px-4 py-2 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Soft radial background light yellow glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-50/25 via-yellow-50/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] mb-6">
            World&apos;s Best AI Models &amp; Tools.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-800">
              One Intelligent Workspace for Every Model.
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
              className="blinga-reactive-cta blinga-cta-gradient rounded-full px-9 py-7 text-base font-bold text-zinc-950 shadow-lg shadow-amber-300/30 hover:shadow-xl active:scale-95 transition-all"
            >
              Get started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a
              href="#pricing"
              className="px-8 py-4 text-sm font-semibold text-zinc-700 hover:text-zinc-950 bg-white border border-zinc-200 rounded-full shadow-sm hover:border-amber-300 hover:scale-[1.03] active:scale-95 transition-all"
            >
              Compare 4 Plans
            </a>
          </div>

          {/* REAL USER UI PHOTO (Replacing previous placeholder) */}
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-amber-300 via-amber-50 to-[#fffaf0] px-7 py-5 text-left sm:px-10 sm:py-7 lg:px-12 lg:py-8">
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[0.9fr_1.75fr] lg:gap-12">
              <div className="max-w-lg">
                <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
                  One powerful hub for everything AI.
                </h3>
                <p className="mt-5 text-sm leading-7 text-zinc-600 sm:text-base">
                  Everything in Pro, plus 12,000,000 normal tokens and 3,000,000 Coder tokens for ambitious work, Blinga Nano Autonomous Agents for hands-free execution, and Blinga Designer &amp; Coder IDE tools for turning ideas into polished products. You also get the highest-priority throughput, so your most important prompts, projects, and creative workflows move faster with dependable access when it matters most.
                </p>
              </div>
              <div className="overflow-hidden rounded-xl bg-[#fffdf5]">
                <img
                  src="/landing-hero-ui.png"
                  alt="Blinga Real UI Workspace"
                  className="-m-[2px] block h-auto w-[calc(100%+4px)] max-w-none scale-[1.005] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED NOMAD MODEL TICKER (Moved from Left-to-Right like references) ── */}
      <section id="models" className="py-16 border-y border-zinc-200/70 bg-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mt-3 mb-2 tracking-tight">
            Top AI Models. All Right Here.
          </h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Smoothly switch between all frontier and flagship models built right into Nomad.
          </p>
        </div>

        {/* Row 1 - Smooth Continuous Left-to-Right Marquee */}
        <div className="relative w-full overflow-hidden mb-4">
          <div className="animate-marquee-right flex gap-3.5">
            {[...NOMAD_ALL_MODELS_ROW_1, ...NOMAD_ALL_MODELS_ROW_1].map((model, idx) => (
              <div
                key={`r1-${idx}`}
                className="inline-flex items-center gap-4 px-10 py-6 rounded-full bg-white border border-zinc-200/80 shadow-sm hover:border-sky-400 hover:shadow-md transition-all flex-shrink-0 cursor-default"
              >
                <div className="w-11 h-11 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={model.logo} alt={model.name} className={`w-9 h-9 object-contain ${model.name.startsWith("Grok") ? "brightness-0" : ""}`} />
                </div>
                <span className="text-xs font-semibold text-zinc-900 whitespace-nowrap">{model.name}</span>
                <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">{model.provider}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Smooth Continuous Right-to-Left Marquee */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-left flex gap-3.5">
            {[...NOMAD_ALL_MODELS_ROW_2, ...NOMAD_ALL_MODELS_ROW_2].map((model, idx) => (
              <div
                key={`r2-${idx}`}
                className="inline-flex items-center gap-4 px-10 py-6 rounded-full bg-white border border-zinc-200/80 shadow-sm hover:border-sky-400 hover:shadow-md transition-all flex-shrink-0 cursor-default"
              >
                <div className="w-11 h-11 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={model.logo} alt={model.name} className={`w-9 h-9 object-contain ${model.name.startsWith("Grok") ? "brightness-0" : ""}`} />
                </div>
                <span className="text-xs font-semibold text-zinc-900 whitespace-nowrap">{model.name}</span>
                <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">{model.provider}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOMAD SIDE BY SIDE COMPARISON ───────────────────────── */}
      {false && <section id="comparison" className="py-24 bg-[#FAF9F8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Only On Blinga
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 mt-4 mb-4 tracking-tight">
              Test &amp; Compare Without Switching Tabs.
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg">
              Never get stuck with a subpar answer. Test prompts against multiple state-of-the-art models side-by-side.
            </p>

            {/* Sub-selector pills */}
            <div className="inline-flex p-1 bg-zinc-100 rounded-full mt-8 border border-zinc-200">
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
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-10 shadow-sm">
            {compareTab === "sideBySide" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-50/70 rounded-2xl border border-zinc-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <img src="/chatgpt-logo.svg" alt="" className="w-5 h-5" />
                      <span className="font-bold text-sm text-zinc-900">ChatGPT 5</span>
                    </div>
                    <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">Detailed Analysis</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed font-mono text-xs bg-white p-4 rounded-xl border border-zinc-200">
                    &ldquo;Here is the architectural pattern for scalable realtime queues. We implement Redis Pub/Sub with persistent worker backoff...&rdquo;
                  </p>
                </div>

                <div className="bg-zinc-50/70 rounded-2xl border border-zinc-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <img src="/claude-logo.svg" alt="" className="w-5 h-5" />
                      <span className="font-bold text-sm text-zinc-900">Claude Sonnet 4</span>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">Clean Implementation</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed font-mono text-xs bg-white p-4 rounded-xl border border-zinc-200">
                    &ldquo;To keep latency below 15ms, prefer a decoupled event-driven consumer loop. Here is the TypeScript implementation with type safety...&rdquo;
                  </p>
                </div>
              </div>
            )}

            {compareTab === "autoRoute" && (
              <div className="bg-zinc-50/70 rounded-2xl border border-zinc-200 p-8 text-center max-w-2xl mx-auto">
                <Sparkles className="w-10 h-10 text-sky-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Blinga Ultimatum Intent Engine</h3>
                <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                  You type naturally, and our classifier instantly routes code to DeepSeek/Claude, real-time news to Perplexity, and creative briefs to GPT-5 or Blinga Pro.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-600 bg-white py-3 px-4 rounded-xl border border-zinc-200">
                  <span>Prompt: &ldquo;Solve quadratic differential equation&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-sky-700 font-bold">Auto-routed to Gemini 3.1 Pro (Math Specialist)</span>
                </div>
              </div>
            )}

            {compareTab === "voiceMode" && (
              <div className="bg-zinc-50/70 rounded-2xl border border-zinc-200 p-8 text-center max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
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
      </section>}

      {/* ── WORK SMARTER FEATURES GRID ──────────────────────────── */}
      <section id="features" className="py-24 bg-white border-t border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mb-3 tracking-tight">
              Everything You Need to Work Smarter.
            </h2>
            <p className="text-zinc-600 text-base">
              Beyond chat. Complete workflow superpowers built for creators, engineers, and researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {WORK_SMARTER_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  data-scroll-reveal
                  className="group overflow-hidden rounded-[2rem] border border-amber-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_18px_45px_rgba(245,158,11,0.14)]"
                >
                  <div>
                    {feat.image ? (
                      <div className="w-full overflow-hidden bg-gradient-to-br from-amber-100 via-white to-amber-50 p-3">
                        <img src={feat.image} alt={feat.title} className="block aspect-[5/3] h-auto w-full rounded-[1.5rem] object-cover object-top" />
                      </div>
                    ) : (
                      <div className="relative mx-3 mt-3 flex h-56 items-center justify-center overflow-hidden rounded-[1.5rem] border border-amber-100 bg-gradient-to-br from-amber-100 via-white to-yellow-50">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" />
                        <div className="absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-yellow-100/70 blur-2xl" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-amber-200 bg-white shadow-[0_12px_30px_rgba(245,158,11,0.16)] transition-transform duration-500 group-hover:scale-105">
                          <Icon className="h-10 w-10 text-amber-600" />
                        </div>
                      </div>
                    )}
                    <div className="p-7">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">{feat.tag}</span>
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">{feat.badge}</span>
                    </div>
                    <h3 className="mt-1 mb-2.5 text-lg font-bold leading-snug text-zinc-900">{feat.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-600">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 PLANS PRICING TABLE (Free, Beginner, Pro, Max) ─────── */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white via-sky-50/20 to-[#FFFFFF] border-t border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 mt-4 mb-4 tracking-tight">
              One Plan. Unmatched Value.
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg mb-8">
              Pick the right tier for your usage. Transparent allowances with no surprise overages.
            </p>

            {/* Monthly / Yearly billing toggle */}
            <div className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 p-1">
              <span className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-out ${isYearly ? "translate-x-full" : "translate-x-0"}`} />
              <button
                onClick={() => setIsYearly(false)}
                className={`relative z-10 w-28 rounded-full px-4 py-2 text-xs font-bold transition-colors ${!isYearly ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 w-28 rounded-full px-4 py-2 text-xs font-bold transition-colors ${isYearly ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="rounded-[2.5rem] border border-amber-200 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-4 shadow-[0_20px_60px_rgba(245,158,11,0.16)] sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1.08fr_1.08fr_1.08fr]">
            
            {/* 1. PRICE COMPARER */}
            <div className="plan-card overflow-hidden rounded-[2rem] border-2 border-amber-300 bg-gradient-to-b from-amber-100/70 via-amber-50/30 to-white p-7 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Choose the AI models you want to compare</h3>
                <div className="mt-5 grid grid-cols-5 gap-2 pr-1">
                  {PRICE_COMPARER_MODELS.map((model) => {
                    const selected = selectedAiModels.includes(model.name);
                    return <button key={model.name} onClick={() => setSelectedAiModels((current) => selected ? current.filter((name) => name !== model.name) : [...current, model.name])} className={`relative flex aspect-square min-w-0 items-center justify-center rounded-full border bg-white transition-all ${selected ? "border-amber-400 shadow-md scale-[1.03]" : "border-zinc-200 hover:border-amber-300"}`} aria-label={`Toggle ${model.name}`}><img src={model.logo} alt="" onError={(event) => { event.currentTarget.src = "/blinga-logo.png"; }} className={`h-7 w-7 object-contain ${model.name === "Grok" ? "brightness-0" : ""}`} />{selected && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-400 shadow-sm" />}</button>;
                  })}
                </div>
                <div className="mt-5 max-h-36 overflow-y-auto divide-y divide-amber-100 border-y border-amber-100 pr-2">
                  {selectedAiModels.map((modelName) => { const model = PRICE_COMPARER_MODELS.find((item) => item.name === modelName)!; return <div key={model.name} className="flex items-center justify-between py-3 text-sm text-zinc-700"><span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm"><img src={model.logo} alt="" onError={(event) => { event.currentTarget.src = "/blinga-logo.png"; }} className={`h-5 w-5 object-contain ${model.name === "Grok" ? "brightness-0" : ""}`} /></span>{model.name}</span><strong>{model.price ? `$${model.price}` : "Free"}</strong></div>; })}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-4"><div className="text-sm font-bold text-zinc-800">Total</div><div className="mt-2 text-right text-3xl font-extrabold text-amber-700">${selectedAiModels.reduce((total, name) => total + (PRICE_COMPARER_MODELS.find((model) => model.name === name)?.price || 0), 0)}<span className="text-sm font-medium">/month</span></div></div>
            </div>

            {/* 2. BEGINNER PLAN */}
            <div className="plan-card min-h-[520px] bg-gradient-to-b from-white to-zinc-50 rounded-[2rem] border-2 border-amber-300 p-9 flex flex-col justify-between shadow-sm hover:-translate-y-1 hover:border-amber-400 transition-all">
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
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span><strong>105 Frontier AI Models</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span><strong>Nomad Side-by-Side Mode</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>3,000,000 tokens included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>350 AI Image Generations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>AI Video Generation: 1</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Voice-to-voice interaction</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Prompt optimizer &amp; history</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Presentation Slides</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Deep Research</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Study Mode</span>
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

            {/* 3. PRO PLAN (Popular Highlight - Light Blue) */}
            <div className="plan-card plan-card-pro relative min-h-[520px] rounded-[2rem] border-2 border-amber-300 p-9 flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all scale-[1.02] z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">Pro</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-zinc-950">${isYearly ? "280" : "28"}</span>
                  <span className="text-xs text-zinc-500">/{isYearly ? "yr" : "30 days"}</span>
                </div>
                <p className="text-xs text-zinc-500 mb-6">For engineers, writers &amp; heavy daily creators.</p>

                <ul className="space-y-3 text-xs text-zinc-700 mb-8 border-t border-zinc-100 pt-6">
                  <li className="flex items-center gap-2.5 font-semibold text-sky-800">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Everything in Beginner, plus:</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span><strong>10,000,000 tokens included</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>AI Video Generation: 50</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>AI Image Generations: 1,400</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Multiple Projects &amp; workspaces</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-500" />
                    <span>Priority compute server queues</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => go()}
                className="w-full rounded-full py-5 text-xs font-bold bg-amber-200 hover:bg-amber-300 text-zinc-950 shadow-md shadow-amber-300/30 transition-all active:scale-95"
              >
                Upgrade to Pro
              </Button>
            </div>

            {/* 4. BLINGA MAX PLAN */}
            <div className="plan-card plan-card-max relative min-h-[520px] text-white rounded-[2rem] border-2 border-amber-300 p-9 flex flex-col justify-between shadow-2xl hover:-translate-y-1 hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Blinga Max</p>
                </div>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-zinc-950 shadow-sm whitespace-nowrap">Most Popular</span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">${isYearly ? "1100" : "110"}</span>
                  <span className="text-xs text-zinc-400">/{isYearly ? "yr" : "30 days"}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6">Unrestricted power for developers and agencies.</p>

                <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-zinc-800 pt-6">
                  <li className="flex items-center gap-2.5 font-semibold text-white">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span>Everything in Pro, plus:</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span><strong>12,000,000 normal tokens</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span><strong>3,000,000 Coder tokens</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span>AI Video Generation: 100</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span>AI Image Generations: 4,000</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span>Blinga Nano Autonomous Agents</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
                    <span>Blinga Designer &amp; Coder IDE tools</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-sky-400" />
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
        </div>
      </section>

      {/* ── FAQ SECTION (Two Columns) ───────────────────────────── */}
      <section id="faq" className="py-24 bg-white border-t border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mb-4 tracking-tight">
                Got Questions About Blinga?
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                Here are answers to common questions about accounts, token quotas, and model comparisons.
              </p>
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all hover:border-amber-200 hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-7 py-5 text-left text-sm font-bold text-zinc-900 hover:text-amber-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="mx-5 mb-5 rounded-2xl bg-amber-50/50 px-5 py-4 text-sm text-zinc-600 leading-relaxed border border-amber-100">
                      {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={() => go()}
                variant="outline"
                className="rounded-full px-6 py-3 text-xs font-bold border-zinc-300 text-zinc-800 hover:border-amber-300 hover:bg-amber-50 active:scale-95 transition-all"
              >
                Contact Support
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200/80 py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Big Stylized Blinga Brand Text */}
          <div className="mb-10 select-none pointer-events-none">
            <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-zinc-100 uppercase">
              Blinga
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="sm" className="text-zinc-900" />
            <span className="text-lg font-bold text-zinc-900">Blinga AI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-zinc-500 mb-6">
            <a href="#models" className="hover:text-sky-600 transition-colors">AI Models</a>
            <a href="#features" className="hover:text-sky-600 transition-colors">Features</a>
            <a href="#comparison" className="hover:text-sky-600 transition-colors">Nomad Mode</a>
            <a href="#pricing" className="hover:text-sky-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-sky-600 transition-colors">FAQ</a>
            <button onClick={() => setLocation("/privacy")} className="hover:text-sky-600 transition-colors">Privacy</button>
            <button onClick={() => setLocation("/terms")} className="hover:text-sky-600 transition-colors">Terms</button>
          </div>

          <p className="text-zinc-400 text-xs">
            &copy; 2026 Blinga. All rights reserved. &middot; Made to Shine!
          </p>
        </div>
      </footer>

    </div>
  );
}
