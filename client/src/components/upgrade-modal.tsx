import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsage } from "@/hooks/use-usage";
import { useToast } from "@/hooks/use-toast";
import { Check, Gift } from "lucide-react";
import { useState } from "react";

const PLANS = [
  { id: "starter" as const, name: "Starter", price: 11, sub: "3M tokens / month", features: ["105 Frontier AI Models", "Nomad Side-by-Side Mode", "3,000,000 tokens included", "350 AI Image Generations", "AI Video Generation: 1", "Prompt optimizer & history", "Presentation Slides", "Deep Research", "Study Mode"] },
  { id: "pro" as const, name: "Pro", price: 28, sub: "10M tokens / month", features: ["Everything in Starter, plus", "10,000,000 tokens included", "AI Video Generation: 50", "AI Image Generations: 1,400", "Multiple Projects & workspaces", "Priority compute server queues", "All premium models", "Advanced creative workflows"] },
  { id: "ultimate" as const, name: "Max", price: 110, sub: "12M normal + 3M Coder tokens", features: ["Everything in Pro, plus", "12,000,000 normal tokens", "3,000,000 Coder tokens", "AI Video Generation: 100", "AI Image Generations: 4,000", "Blinga Nano Autonomous Agents", "Blinga Designer & Coder IDE tools", "Highest priority throughput"] },
];

export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { usage, upgrade } = useUsage();
  const { toast } = useToast();
  const [yearly, setYearly] = useState(false);
  const choose = async (plan: "starter" | "pro" | "ultimate") => {
    try { await upgrade.mutateAsync(plan); toast({ title: `${plan === "ultimate" ? "Max" : plan[0].toUpperCase() + plan.slice(1)} plan activated` }); onClose(); }
    catch { toast({ title: "Couldn’t activate plan", description: "Please try again.", variant: "destructive" }); }
  };
  return <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
    <DialogContent style={{ borderRadius: 60 }} className="w-[calc(100%-1.5rem)] max-w-5xl overflow-hidden border-border bg-background p-0 [&>button]:right-7 [&>button]:top-7">
      <DialogTitle className="sr-only">Choose a Blinga plan</DialogTitle>
      <div className="px-6 pb-6 pt-6 sm:px-9">
        <div className="mb-5 text-center"><h2 className="text-3xl font-semibold tracking-tight text-foreground">Choose the plan that fits you</h2><p className="mt-2 text-sm text-muted-foreground">Simple plans. Full access to Blinga.</p><div className="relative mx-auto mt-4 flex w-fit items-center gap-1 rounded-full bg-muted p-1"><span className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-sm transition-transform ${yearly ? "translate-x-full" : ""}`} /><button onClick={() => setYearly(false)} className="relative z-10 w-28 rounded-full px-4 py-1.5 text-sm font-medium text-foreground">Monthly</button><button onClick={() => setYearly(true)} className="relative z-10 w-28 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground">Yearly</button></div></div>
        <div className="grid gap-4 lg:grid-cols-3">{PLANS.map((plan, index) => { const active = usage?.plan === plan.id; const displayedPrice = yearly ? plan.price * 10 : plan.price; return <div key={plan.id} className={`relative flex flex-col rounded-[44px] border-2 p-6 ${index === 2 ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/10" : "border-border bg-card"}`}>
          {index === 2 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold text-zinc-900">POPULAR</span>}
          <div className="flex items-center justify-between"><h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>{active && <span className="rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-bold text-white">ACTIVE</span>}</div>
          <div className="mt-4 flex items-baseline gap-1"><span key={`${plan.id}-${yearly}`} className="price-change text-4xl font-bold text-foreground">${displayedPrice}</span><span className="text-sm text-muted-foreground">/{yearly ? "year" : "month"}</span></div>
          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">ϟ {plan.sub}</div>
          <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4 text-[13px] text-muted-foreground">{plan.features.map(feature => <li key={feature} className="flex items-start gap-2"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white"><Check className="h-2.5 w-2.5" /></span>{feature}</li>)}</ul>
          <Button onClick={() => choose(plan.id)} disabled={active || upgrade.isPending} className={`mt-5 w-full rounded-full ${index === 2 ? "bg-amber-300 text-zinc-950 hover:bg-amber-200" : "bg-foreground text-background"}`}>{active ? "Current plan" : `Upgrade to ${plan.name}`}</Button>
        </div>; })}</div>
        <div className="mx-auto mt-7 flex max-w-xl items-center justify-center gap-2 rounded-full bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"><Gift className="h-4 w-4" />Any unused tokens carry over when you change plans.</div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">Taxes included · Flexible monthly billing · Cancel anytime</p>
      </div>
    </DialogContent>
  </Dialog>;
}
