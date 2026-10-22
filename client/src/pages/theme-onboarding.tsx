import { useState } from "react";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

type Preset = { id: string; title: string; description: string; theme: "light" | "dark"; minimal?: boolean };

const PRESETS: Preset[] = [
  { id: "light", title: "Light", description: "Clean and bright", theme: "light" },
  { id: "dark", title: "Dark", description: "Easy on the eyes", theme: "dark" },
  { id: "light-minimal", title: "Light Minimal", description: "Light, distraction-free", theme: "light", minimal: true },
  { id: "dark-minimal", title: "Dark Minimal", description: "Dark, distraction-free", theme: "dark", minimal: true },
];

const PREVIEW_IMAGES: Record<string, string> = {
  light: "/theme-preview-light.png",
  dark: "/theme-preview-dark.png",
  "light-minimal": "/theme-preview-light-minimal.png",
  "dark-minimal": "/theme-preview-dark-minimal.png",
};

function Preview({ preset, selected, onClick }: { preset: Preset; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`group text-left rounded-[22px] border-2 p-2 transition-all ${selected ? "border-zinc-900 dark:border-white shadow-[0_12px_35px_rgba(0,0,0,.14)]" : "border-zinc-200 hover:border-zinc-400"}`}>
      <div className="relative h-[168px] overflow-hidden rounded-[16px] bg-zinc-100">
        <img src={PREVIEW_IMAGES[preset.id]} alt={`${preset.title} theme preview`} className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-3">
        <div><p className="text-sm font-semibold text-zinc-900">{preset.title}</p><p className="text-xs text-zinc-500">{preset.description}</p></div>
        {selected && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white"><Check className="h-3.5 w-3.5" /></span>}
      </div>
    </button>
  );
}

export default function ThemeOnboarding() {
  const [, setLocation] = useLocation();
  const { setTheme } = useTheme();
  const [selected, setSelected] = useState("light");
  const apply = () => {
    const preset = PRESETS.find((item) => item.id === selected) || PRESETS[0];
    setTheme(preset.theme);
    const saved = JSON.parse(localStorage.getItem("settingsToggles") || "{}");
    localStorage.setItem("settingsToggles", JSON.stringify({ ...saved, hideBlingaLogo: !!preset.minimal, hideMadeToShine: !!preset.minimal }));
    localStorage.setItem("blinga-theme-onboarding-complete", "true");
    window.dispatchEvent(new Event("themeOnboardingComplete"));
    setLocation("/chat", { replace: true });
  };
  return <main className="min-h-screen bg-[#fafafa] px-5 py-12 text-zinc-900 sm:px-8">
    <div className="mx-auto max-w-[920px]">
      <div className="mb-10 text-center"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose a theme to begin with</h1><p className="mt-3 text-sm text-zinc-500">You can change this anytime in Settings.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">{PRESETS.map((preset) => <Preview key={preset.id} preset={preset} selected={selected === preset.id} onClick={() => setSelected(preset.id)} />)}</div>
      <button type="button" onClick={apply} className="mx-auto mt-9 flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-semibold text-white transition hover:bg-zinc-700">Continue <Check className="h-4 w-4" /></button>
    </div>
  </main>;
}
