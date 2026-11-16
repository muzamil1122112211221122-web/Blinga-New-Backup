import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag, Crown, Check, Settings, UserPen, LogOut, PanelLeftOpen, PanelLeftClose, ChevronUp, ChevronDown, ChevronLeft, Bot, ChefHat, Dumbbell, GraduationCap, Compass, Globe, TrendingUp, Pin, PinOff, Search, MessageSquare, Clock, Trash2, SlidersHorizontal, Sparkles, MessageSquareMore } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUsage } from "@/hooks/use-usage";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BlingaLogo, Logo } from "./logo";
import { format, isToday, isYesterday, isThisMonth } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { getVibrantColor } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { SIDEBAR_ASSETS } from "@/lib/sidebar-assets";

// ── Sidebar usage strip ────────────────────────────────────────────────────
// ── Circular Floating Credits Gauge Widget (based on reference sketch) ──────
export function CircularCreditsMeter({
  used,
  limit,
  label,
  planName,
  isUltimate,
  onOpenUpgrade,
  compact = false,
}: {
  used: number;
  limit: number;
  label: string;
  planName: string;
  isUltimate: boolean;
  onOpenUpgrade?: () => void;
  compact?: boolean;
}) {
  const creditsRemaining = Math.max(0, limit - used);
  const usedFraction = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0;
  const pct = Math.round(usedFraction * 100);

  // SVG Gauge Math - Compact circle
  const size = compact ? 72 : 88;
  const strokeWidth = compact ? 5 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - usedFraction * circumference;

  // Determine stage accent color based on user sketch:
  // Start of usage = green, middle = yellow, end / low remaining = red
  const statusColor =
    usedFraction < 0.45
      ? "#10b981" // Green
      : usedFraction < 0.8
      ? "#f59e0b" // Yellow
      : "#ef4444"; // Red

  return (
    <div
      className="relative flex flex-col items-center select-none"
    >
      {/* Plan Header Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 mb-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/50 shadow-2xs">
        <Tag className="w-3 h-3 text-zinc-500 dark:text-zinc-400" strokeWidth={2.2} />
        <span className="text-[11px] font-bold text-foreground tracking-tight">
          {planName}
        </span>
      </div>

      {/* Floating Circular Gauge container - fixed dimensions, no layout shifts */}
      <div className="relative flex items-center justify-center my-0.5 cursor-default">
        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          className="relative z-10 -rotate-90 drop-shadow-2xs"
        >
          {/* Background track circle with dashed aesthetic */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-zinc-200/90 dark:text-zinc-700/60"
            strokeWidth={strokeWidth}
            strokeDasharray="3.5 2.5"
          />

          {/* Active Progress Ring colored directly with statusColor */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
          />
        </svg>

        {/* Center Inner Text - clear legible fonts */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 z-20 pointer-events-none">
          <span className="text-[8.5px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-0.5">
            USED
          </span>
          <span className="text-[14px] font-black text-foreground tracking-tight leading-tight">
            {used.toLocaleString()}
          </span>
          <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-400 leading-none mt-0.5">
            of {limit.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dynamic Sub-text Indicator */}
      <div className="w-full mt-1 text-center">
        <p className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
          <span className="font-bold text-foreground">{creditsRemaining.toLocaleString()}</span> {label.toLowerCase()} left
        </p>
      </div>

      {/* Upgrade CTA (when not on Max plan) */}
      {!isUltimate && onOpenUpgrade && !compact && (
        <button
          onClick={onOpenUpgrade}
          className="mt-1.5 w-full py-1 px-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-98"
        >
          <Crown className="w-2.5 h-2.5" strokeWidth={2} />
          <span>Upgrade</span>
        </button>
      )}
    </div>
  );
}

export function SidebarUsage({ compact = false, onOpenUpgrade }: { compact?: boolean; onOpenUpgrade?: () => void }) {
  const { usage, isLoading } = useUsage();

  if (isLoading || !usage) return null;

  const isUltimate = usage.plan === "ultimate";
  const isPro = usage.plan === "pro";
  const isStarter = usage.plan === "starter";
  const planName = isUltimate ? "Max Plan" : isPro ? "Pro Plan" : isStarter ? "Starter Plan" : "Free Plan";

  const usesCredits = isUltimate || isPro || isStarter;
  const creditsRemaining = usesCredits
    ? (usage.creditsRemaining ?? Math.floor((usage.tokensRemaining ?? 0) / 1000))
    : (usage.messagesRemaining ?? 0);
  const creditsUsed = usesCredits
    ? (usage.creditsUsed ?? Math.floor((usage.tokensUsed ?? 0) / 1000))
    : (usage.messagesUsed ?? 0);
  const creditsLimit = usesCredits
    ? (usage.creditsLimit ?? Math.floor((usage.tokensLimit ?? 1) / 1000))
    : (usage.messagesLimit ?? 1);
  const creditsLabel = usesCredits ? "Credits" : "Messages";

  return (
    <CircularCreditsMeter
      used={creditsUsed}
      limit={creditsLimit}
      label={creditsLabel}
      planName={planName}
      isUltimate={isUltimate}
      onOpenUpgrade={onOpenUpgrade}
    />
  );
}

// ? Spotlight Search Component
function SpotlightSearch({
  query,
  onQueryChange,
  onClose,
  chats,
  onSelect,
  isDark,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  chats: Array<{ id: string; title: string; createdAt: Date; aiRole?: string; nomadData?: any }>;
  onSelect: (id: string) => void;
  isDark: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const filtered = [...chats]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(c => !query.trim() || c.title?.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 20);

  const bg   = isDark ? '#1a1a1a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputColor = isDark ? '#f0f0f0' : '#111111';
  const subColor = isDark ? '#888' : '#999';
  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 1rem',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'spotlight-fade-in 0.15s ease',
      }}
    >
      <style>{`
        @keyframes spotlight-fade-in { from { opacity:0 } to { opacity:1 } }
        @keyframes spotlight-slide-up { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .spotlight-item:hover { background: ${hoverBg} !important; }
        .spotlight-item { transition: background 0.1s ease; }
        .spotlight-input, .spotlight-input:focus, .spotlight-input:active {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
          -webkit-box-shadow: none !important;
        }
        .spotlight-dialog, .spotlight-dialog:focus, .spotlight-dialog *:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <div
        className="spotlight-dialog"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 580,
          borderRadius: 18,
          overflow: 'hidden',
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? '0 24px 80px rgba(0,0,0,0.7), 0 4px 20px rgba(0,0,0,0.4)'
            : '0 24px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08)',
          animation: 'spotlight-slide-up 0.18s ease',
        }}
      >
        {/* ── Search Input Row ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 20px',
        }}>
          <Search style={{ width: 18, height: 18, flexShrink: 0, color: subColor }} />
          <input
            ref={inputRef}
            className="spotlight-input"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search chats..."
            style={{
              flex: 1, minWidth: 0,
              fontSize: 16, lineHeight: '1.4',
              color: inputColor,
              background: 'none',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              WebkitAppearance: 'none',
              caretColor: isDark ? '#ffffff' : '#000000',
            }}
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
                padding: 4, display: 'flex', alignItems: 'center', color: subColor }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {/* ── Chat List ── */}
        <div style={{
          maxHeight: 'min(60vh, 440px)',
          overflowY: 'auto',
          padding: '6px',
        }}>
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '48px 0', gap: 10, color: subColor,
            }}>
              <MessageSquare style={{ width: 28, height: 28, opacity: 0.4 }} />
              <span style={{ fontSize: 14 }}>
                {query ? 'No chats found' : 'No chats yet'}
              </span>
            </div>
          ) : (
            <>
              {query.trim() === '' && (
                <div style={{ padding: '6px 12px 4px', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.07em', textTransform: 'uppercase', color: subColor }}>
                  Recent Chats
                </div>
              )}
              {filtered.map(chat => {
                const dateStr = (() => {
                  const d = new Date(chat.createdAt);
                  if (isToday(d)) return 'Today';
                  if (isYesterday(d)) return 'Yesterday';
                  return format(d, 'MMM d');
                })();
                return (
                  <button
                    key={chat.id}
                    className="spotlight-item"
                    onClick={() => onSelect(chat.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      borderRadius: 12, padding: '10px 12px', textAlign: 'left',
                      background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
                      color: inputColor,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <MessageSquare style={{ width: 14, height: 14, color: subColor }} />
                    </div>
                    <span style={{
                      flex: 1, minWidth: 0, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontSize: 14, fontWeight: 500,
                    }}>
                      {chat.nomadData?.chatIcon && <span className="mr-1.5 text-lg leading-none">{chat.nomadData.chatIcon.startsWith('data:') || chat.nomadData.chatIcon.startsWith('/') ? <img src={chat.nomadData.chatIcon} alt="" className="inline-block h-6 w-6 rounded-full object-cover align-[-4px]" /> : chat.nomadData.chatIcon}</span>}{chat.title || 'New Chat'}
                    </span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 11, color: subColor, flexShrink: 0,
                    }}>
                      <Clock style={{ width: 11, height: 11 }} />
                      <span>{dateStr}</span>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  openMode?: 'mini' | 'full';
  forceFull?: boolean;
  onModeChange?: (mode: 'mini' | 'full') => void;
  onClose: () => void;
  onLogout: () => void;
  projects: Array<{
    id: string;
    title: string;
    createdAt: Date;
    aiRole?: string;
    isProject?: boolean;
    hasNomad?: boolean;
  }>;
  currentProjectId?: string;
  onProjectSelect: (id: string) => void;
  onNewProject?: (isProject?: boolean, config?: { title: string; aiRole: string; chatIcon: string }) => void;
  onDeleteProject: (id: string) => void;
  onEditProject?: (id: string, newTitle: string) => void;
  onUpdateAiRole?: (id: string, newAiRole: string, chatIcon?: string) => void;
  onSearchOpen?: () => void;
  onOpenSettings?: () => void;
  onOpenUpgrade?: () => void;
  onVoiceClick?: () => void;
  onImagineClick?: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  tabsInSidebar?: boolean;
  askHasMessages?: boolean;
  ownMode?: boolean;
  onToggleOwnMode?: () => void;
  resolvedTheme?: string;
  user?: {
    email: string;
    username: string;
  };
  onUserRename?: (newUsername: string) => void;
  profilePicture?: string;
  onProfilePictureChange?: (dataUrl: string) => void;
  nomadHistory?: Array<{ id: string; ts: number; mode: string; preview: string }>;
  onNomadHistorySelect?: (id?: string) => void;
  closeButtonPosition?: 'top' | 'bottom';
  minimalAnimations?: boolean;
}

  export function Sidebar({
  isOpen,
  openMode = 'mini',
  forceFull = false,
  onModeChange,
  onClose,
  onLogout,
  projects,
  currentProjectId,
  onProjectSelect,
  onNewProject,
  onDeleteProject,
  onEditProject,
  onUpdateAiRole,
  onSearchOpen,
  onOpenSettings,
  onOpenUpgrade,
  onVoiceClick,
  onImagineClick,
  onTabChange,
  activeTab,
  tabsInSidebar = false,
  askHasMessages = false,
  ownMode,
  onToggleOwnMode,
  resolvedTheme,
  user,
  onUserRename,
  profilePicture,
  onProfilePictureChange,
  closeButtonPosition = 'top',
  minimalAnimations = false,
}: SidebarProps) {
  const { theme } = useTheme();
  const [isMini, setIsMini] = useState(!forceFull);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllGroups, setShowAllGroups] = useState<Set<string>>(new Set());
  const [pinnedChats, setPinnedChats] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("pinnedChats") || "[]")); } catch { return new Set(); }
  });
  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPinnedChats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("pinnedChats", JSON.stringify(Array.from(next)));
      return next;
    });
  };
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const picInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { usage: sidebarUsageData } = useUsage();
  const isUltimatePlan = sidebarUsageData?.plan === "ultimate";
  const isProPlan = sidebarUsageData?.plan === "pro";
  const isStarterPlan = sidebarUsageData?.plan === "starter";

    const isDarkTheme = theme === "dark" || (
    theme === "system" &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const sidebarAsset = (key: keyof typeof SIDEBAR_ASSETS) =>
    SIDEBAR_ASSETS[key][isDarkTheme ? "dark" : "light"];

  // Compute which row the active tab is in (for the sliding pill animation)
  // Rows: 0=search, 1=newchat, 2=imagine, 3=owlMode, 4=ask, 5=nomad, 6=minds, 7=games, 8=presentations, 9=motion, 10=library, 11=history
  const miniActiveTabIndex = (() => {
    if (!tabsInSidebar) {
      if (tabsInSidebar && activeTab === 'ask' && !askHasMessages) return 1;
      if (tabsInSidebar && activeTab === 'imagine') return 2;
      return -1;
    }
    if (activeTab === 'ask' && !askHasMessages) return 1;
    if (activeTab === 'imagine') return 2;
    if (ownMode) return 3;
    if (activeTab === 'ask' && askHasMessages) return 4;
    if (activeTab === 'nomad') return 5;
    if (activeTab === 'philosopher') return 6;
    if (activeTab === 'blinga-games') return 7;
    if (activeTab === 'presentations') return 8;
    if (activeTab === 'motion-studio') return 9;
    if (activeTab === 'library') return 10;
    return -1;
  })();


const MiniNavButton = ({
    asset,
    label,
    onClick,
    active,
    iconSize,
  }: {
    asset: keyof typeof SIDEBAR_ASSETS;
    label: string;
    onClick: () => void;
    active?: boolean;
    iconSize?: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="h-[34px] w-full mx-auto flex items-center justify-center group"
        >
          
          <span className={`flex items-center justify-center w-[44px] h-[32px] rounded-full transition-colors duration-150 ${!active ? "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60" : ""}`}>
            {asset === 'search' ? (
              <Search aria-hidden="true" className="text-zinc-700 dark:text-zinc-300" style={{ width: iconSize ?? '18px', height: iconSize ?? '18px', strokeWidth: 2.2 }} />
            ) : (
              <img src={sidebarAsset(asset)} alt="" style={{ width: iconSize ?? '18px', height: iconSize ?? '18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display: 'block' }} />
            )}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" avoidCollisions={false}>{label}</TooltipContent>
    </Tooltip>
  );

  useEffect(() => {
    if (!isOpen) {
      setIsMini(true);
      setSpotlightOpen(false);
    } else {
      setIsMini(forceFull ? false : openMode !== 'full');
    }
  }, [isOpen, openMode, forceFull]);

  const openSpotlight = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSpotlightQuery("");
    setSpotlightOpen(true);
  }, []);

  useEffect(() => {
    onModeChange?.(isMini ? 'mini' : 'full');
  }, [isMini, onModeChange]);

  const closeSidebarStage = () => {
    if (forceFull) {
      onClose();
      return;
    }
    // Always minimize instead of completely closing
    setIsMini(true);
    onModeChange?.('mini');
  };

  // Chat config dialog
  const [chatConfigOpen, setChatConfigOpen] = useState(false);
  const [chatConfigCreateMode, setChatConfigCreateMode] = useState(false);
  const [chatConfigId, setChatConfigId] = useState('');
  const [chatConfigTitle, setChatConfigTitle] = useState('');
  const [chatConfigRole, setChatConfigRole] = useState('General');
  const [chatConfigIcon, setChatConfigIcon] = useState('');
  const [customChatIcons, setCustomChatIcons] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('customChatIcons') || '[]').slice(-20); } catch { return []; } });
  const CHAT_ICON_IMAGES = ['/chat-icons/e45b6252-9106-40a2-b4f9-1d8072b7f668.jpg', '/chat-icons/Gemini_Generated_Image_4teyld4teyld4tey.jpg', '/chat-icons/Gemini_Generated_Image_gl1wtkgl1wtkgl1w.jpg', '/chat-icons/Gemini_Generated_Image_px8t02px8t02px8t.jpg'];
  const CHAT_EMOJIS = '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🫡 🤭 🫢 🫣 🤫 🤥 😶 🫠 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🙈 🙉 🙊 👋 🤚 🖐️ ✋ 🖖 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 🤝 👏 🙌 👐 🤲 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 👃 🧠 🫀 🫁 🦷 🦴 👀 👁️ 👅 👄 💋 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 💯 💥 💫 💦 💨 🕳️ 💣 💬 👁️‍🗨️ 🗨️ 🗯️ 💤 👋 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪲 🐛 🦋 🐌 🐞 🐜 🕷️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦀 🐠 🐟 🐡 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🐘 🦏 🦛 🐪 🐫 🦒 🦘 🦬 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐈 🐓 🦃 🕊️ 🐇 🐁 🐀 🐿️ 🦔 🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🪴 🌲 🌳 🌴 🌵 🍀 ☘️ 🍁 🍂 🍃 🍇 🍈 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍏 🍐 🍑 🍒 🍓 🫐 🥝 🍅 🫒 🥥 🥑 🍆 🥔 🥕 🌽 🌶️ 🫑 🥒 🥬 🥦 🧄 🧅 🍄 🥜 🌰 🍞 🥐 🥖 🫓 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥗 🍿 🧂 🥫 🍱 🍣 🍤 🍙 🍚 🍜 🍲 🍛 🍝 🍠 🍢 🍡 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍩 🍪 ☕ 🍵 🧃 🥤 🧋 🍺 🍻 🍷 🥂 🍸 🍹 🧉 🍼 🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🛵 🏍️ 🚲 ✈️ 🚀 🛸 🚁 🛶 ⛵ 🚢 ⚓ 🗺️ 🗽 🗼 🏰 🏯 🏝️ 🏖️ 🏕️ ⛰️ 🌋 🏜️ 🌅 🌄 🌌 🌠 🎉 🎊 🎈 🎁 🎀 🎗️ 🏆 🥇 🥈 🥉 ⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🪀 🏓 🏸 🥊 🥋 🎣 🏹 🎽 🛹 🛷 ⛸️ 🥌 🎿 ⛷️ 🏂 🪂 🏋️ 🤼 🤸 ⛹️ 🤺 🏇 🧘 🏄 🏊 🤽 🚣 🧗 🚵 🚴 🎮 🕹️ 🎲 ♟️ 🧩 🧸 🎨 🖌️ 🎭 🎪 🎤 🎧 🎼 🎹 🥁 🎷 🎺 🎸 🎻 📱 💻 🖥️ 🖨️ ⌨️ 🖱️ 💡 🔦 🕯️ 📚 📖 📝 ✏️ 🖊️ 📌 📎 🔒 🔑 🔨 🛠️ ⚙️ 🧭 ⏰ ⌚ 📷 📺 ☎️ 📡 💰 💎 ⚡ 🔥 🌟 ⭐ ✨ 🎯 🚀 🧿 ✅ ❌ ❗ ❓ ⚠️ ♻️ ☮️ ☯️ ☢️ ☣️ 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ 🟤'.split(' ');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerTab, setIconPickerTab] = useState<'image' | 'emoji'>('image');
  const [customIconSource, setCustomIconSource] = useState('');
  const [customIconZoom, setCustomIconZoom] = useState(1);
  const [customIconBg, setCustomIconBg] = useState('#f4f4f5');
  const [customEmoji, setCustomEmoji] = useState('😀');
  const iconBgColors = ['#facc15', '#ffffff', '#f4f4f5', '#111827', '#fda4af', '#86efac', '#93c5fd', '#c4b5fd'];
  const [roleAnswers, setRoleAnswers] = useState<Record<string, string>>({});
  const personaNavRef = useRef<HTMLDivElement>(null);
  const personaBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [personaPillStyle, setPersonaPillStyle] = useState({ left: 0, width: 0, ready: false });

  type RoleIcon = { Icon: React.ComponentType<{className?: string; style?: React.CSSProperties}>; color: string };
  const AI_ROLES: Array<{id: string; label: string; iconDef: RoleIcon; questions: Array<{key: string; label: string}>}> = [
    { id: 'General', label: 'Custom', iconDef: { Icon: Bot, color: '#6366f1' }, questions: [
      { key: 'name', label: 'What should I call you?' },
      { key: 'style', label: 'Preferred tone (friendly / formal / concise)' },
      { key: 'focus', label: 'Main topics you discuss most' },
    ]},
    { id: 'Chef', label: 'Chef', iconDef: { Icon: ChefHat, color: '#f59e0b' }, questions: [
      { key: 'diet', label: 'Dietary restrictions (vegetarian, halal, vegan, etc.)' },
      { key: 'allergies', label: 'Any food allergies or intolerances?' },
      { key: 'cuisine', label: 'Favorite cuisine style (Italian, Asian, Middle-Eastern, etc.)' },
      { key: 'skill', label: 'Cooking level (beginner / intermediate / advanced)' },
      { key: 'servings', label: 'Usual number of people you cook for' },
      { key: 'equipment', label: 'Kitchen tools available (oven, air fryer, stovetop only, etc.)' },
    ]},
    { id: 'Trainer', label: 'Trainer', iconDef: { Icon: Dumbbell, color: '#ef4444' }, questions: [
      { key: 'goal', label: 'Primary goal (lose weight / build muscle / improve endurance)' },
      { key: 'days', label: 'Days per week available to train' },
      { key: 'equipment', label: 'Equipment access (full gym / home / no equipment)' },
      { key: 'level', label: 'Fitness level (beginner / intermediate / advanced)' },
      { key: 'injuries', label: 'Any injuries or physical limitations?' },
      { key: 'age', label: 'Your age range (helps tailor intensity)' },
    ]},
    { id: 'Tutor', label: 'Tutor', iconDef: { Icon: GraduationCap, color: '#3b82f6' }, questions: [
      { key: 'subject', label: 'Subject or topic to focus on' },
      { key: 'level', label: 'Education level (school / college / self-study)' },
      { key: 'style', label: 'Learning style (explanations / quizzes / examples / all)' },
      { key: 'pace', label: 'Preferred pace (slow & thorough / fast & focused)' },
      { key: 'exam', label: 'Any specific exam or curriculum? (e.g. O-levels, SAT, IGCSE)' },
      { key: 'weak', label: 'Weakest area in this subject?' },
    ]},
    { id: 'LifeCoach', label: 'Life Coach', iconDef: { Icon: Compass, color: '#10b981' }, questions: [
      { key: 'focus', label: 'Focus area (career / relationships / mindset / health / productivity)' },
      { key: 'goal', label: 'Main goal you want to achieve' },
      { key: 'challenge', label: 'Biggest challenge you face right now' },
      { key: 'timeline', label: 'Timeline you are working with' },
      { key: 'style', label: 'Coaching style preference (motivational / analytical / gentle / direct)' },
    ]},
    { id: 'LangTutor', label: 'Language Tutor', iconDef: { Icon: Globe, color: '#8b5cf6' }, questions: [
      { key: 'lang', label: 'Language to learn' },
      { key: 'native', label: 'Your native language' },
      { key: 'level', label: 'Current level (beginner / intermediate / advanced)' },
      { key: 'goal', label: 'Goal (travel / business / fluency / just basics)' },
      { key: 'method', label: 'Preferred method (grammar rules / conversation / vocab drills)' },
      { key: 'minutes', label: 'Daily practice time available (in minutes)' },
    ]},
    { id: 'Finance', label: 'Finance Advisor', iconDef: { Icon: TrendingUp, color: '#059669' }, questions: [
      { key: 'goal', label: 'Financial goal (save / invest / budget / pay off debt)' },
      { key: 'income', label: 'Income type (salary / freelance / business / student)' },
      { key: 'risk', label: 'Risk tolerance (low / medium / high)' },
      { key: 'timeline', label: 'Timeline for your goal (months / years)' },
      { key: 'currency', label: 'Your country / currency (helps with local context)' },
    ]},
  ];

  function openCustomIconPicker() {
    setCustomIconSource(''); setCustomIconZoom(1); setIconPickerTab('image'); setIconPickerOpen(true);
  }

  function applyCustomIcon() {
    if (iconPickerTab === 'emoji') {
      const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      ctx.fillStyle = customIconBg; ctx.fillRect(0, 0, 256, 256);
      ctx.font = '150px Apple Color Emoji, Segoe UI Emoji, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(customEmoji || '😀', 128, 132);
      const icon = canvas.toDataURL('image/png');
      setCustomChatIcons(prev => { const next = prev.includes(icon) ? prev : [...prev, icon].slice(-20); localStorage.setItem('customChatIcons', JSON.stringify(next)); return next; });
      setChatConfigIcon(icon); setIconPickerOpen(false); return;
    }
    if (!customIconSource) return;
    const image = new Image(); image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const scale = Math.max(256 / image.width, 256 / image.height) * customIconZoom;
      const w = image.width * scale, h = image.height * scale;
      ctx.drawImage(image, (256 - w) / 2, (256 - h) / 2, w, h);
      const icon = canvas.toDataURL('image/png');
      setCustomChatIcons(prev => { const next = prev.includes(icon) ? prev : [...prev, icon].slice(-20); localStorage.setItem('customChatIcons', JSON.stringify(next)); return next; });
      setChatConfigIcon(icon); setIconPickerOpen(false);
    }; image.src = customIconSource;
  }

  useEffect(() => {
    if (!chatConfigOpen) return;
    const updatePersonaPill = () => {
      const nav = personaNavRef.current;
      const activeIndex = AI_ROLES.findIndex(role => role.id === chatConfigRole);
      const button = personaBtnRefs.current[activeIndex];
      if (!nav || !button) return;
      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setPersonaPillStyle({ left: buttonRect.left - navRect.left, width: buttonRect.width, ready: true });
    };
    const frame = requestAnimationFrame(updatePersonaPill);
    window.addEventListener('resize', updatePersonaPill);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', updatePersonaPill); };
  }, [chatConfigOpen, chatConfigRole]);

  function openChatConfig(chat: { id: string; title: string; aiRole?: string; nomadData?: any }) {
    setChatConfigCreateMode(false);
    setChatConfigId(chat.id);
    setChatConfigTitle(chat.title || '');
    let savedIcon = '';
    try { savedIcon = JSON.parse(localStorage.getItem('chatIcons') || '{}')[chat.id] || ''; } catch {}
    setChatConfigIcon(chat.nomadData?.chatIcon || savedIcon || '');
    const currentRole = chat.aiRole?.split('\n')[0] || 'General';
    setChatConfigRole(currentRole);
    const answers: Record<string, string> = {};
    if (chat.aiRole) {
      chat.aiRole.split('\n').slice(1).forEach(line => {
        const [k, ...v] = line.split(':');
        if (k && v.length) answers[k.trim()] = v.join(':').trim();
      });
    }
    setRoleAnswers(answers);
    setChatConfigOpen(true);
  }

  function openNewChatConfig() {
    setChatConfigCreateMode(true);
    setChatConfigId('');
    setChatConfigTitle('');
    setChatConfigIcon('');
    setChatConfigRole('General');
    setRoleAnswers({});
    setChatConfigOpen(true);
  }

  function saveChatConfig() {
    const role = AI_ROLES.find(r => r.id === chatConfigRole);
    const lines = [chatConfigRole];
    if (role) role.questions.forEach(q => { if (roleAnswers[q.key]) lines.push(`${q.key}: ${roleAnswers[q.key]}`); });
    if (chatConfigCreateMode) {
      onNewProject?.(false, { title: chatConfigTitle.trim() || 'New Chat', aiRole: lines.join('\n'), chatIcon: chatConfigIcon });
    } else {
      if (chatConfigTitle.trim()) onEditProject?.(chatConfigId, chatConfigTitle.trim());
      onUpdateAiRole?.(chatConfigId, lines.join('\n'), chatConfigIcon);
    }
    setChatConfigOpen(false);
    toast({ title: 'Chat settings saved' });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
        setIsCustomizing(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  async function handleRenameSubmit() {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    try {
      await apiRequest('PUT', '/api/user/rename', { username: trimmed });
      onUserRename?.(trimmed);
      toast({ title: 'Profile updated', description: `Your name is now "${trimmed}"` });
      setIsCustomizing(false);
      setProfileMenuOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch {
      toast({ title: 'Rename failed', description: 'Could not update your name.', variant: 'destructive' });
    }
  }

  function handlePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onProfilePictureChange?.(dataUrl);
      toast({ title: 'Photo updated' });
    };
    reader.readAsDataURL(file);
  }

  // Detect touch device so we always show action buttons on mobile
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const getDateGroup = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisMonth(date)) return 'This Month';
    return format(date, 'MMMM');
  };

  const groupItemsByDate = (items: typeof projects) => {
    const groups: { [key: string]: typeof projects } = {
      'Today': [],
      'Yesterday': [],
      'This Month': [],
    };

    const filteredItems = items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sortedItems.forEach(item => {
      const groupName = getDateGroup(new Date(item.createdAt));
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(item);
    });

    return groups;
  };

  // Only show regular chats (not projects)
  const chatItems = projects.filter(p => !p.isProject);
  const pinnedItems = chatItems.filter(p => pinnedChats.has(p.id));
  const unpinnedItems = chatItems.filter(p => !pinnedChats.has(p.id));
  const chatGroups = groupItemsByDate(unpinnedItems);

  // All date group keys (chats only)
  const allGroupKeys = Object.keys(chatGroups).filter(g => (chatGroups[g]?.length ?? 0) > 0);
  return (
    <TooltipProvider delayDuration={300}>
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen && !isMini ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 bottom-0 left-0 h-auto overflow-visible ${isMini ? 'w-[76px]' : 'w-72'} ${forceFull ? (isOpen ? 'mobile-sidebar-open' : 'mobile-sidebar-closed') : ''} bg-background text-zinc-900 dark:text-zinc-100 ${activeTab === 'nomad' ? 'z-[60]' : 'z-[50]'} flex flex-col transition-[width,transform] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          pointerEvents: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), width 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
        onMouseEnter={() => isMini && setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
      >
          {/* Right edge fade - fixed outside the sidebar so it's not clipped */}
          {isOpen && activeTab !== 'nomad' && (
            <div
              className="pointer-events-none fixed top-0 z-[29]"
              style={{
                left: isMini ? 76 : 288,
                width: 48,
                height: '100%',
                background: 'linear-gradient(to right, var(--background), transparent)',
                transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          )}
          
          <div className={`p-3 flex items-center ${isMini ? 'justify-center' : 'justify-between'}`}>

          {isMini ? (
            /* Mini mode: logo crossfades to close icon on hover */
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Expand sidebar"
                  onMouseEnter={() => setIsLogoHovered(true)}
                  onMouseLeave={() => setIsLogoHovered(false)}
                  onClick={(e) => { e.stopPropagation(); setIsMini(false); onOpenModeChange?.('full'); }}
                  className="group relative rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 p-1.5 transition-colors"
                  style={{width: 48, height: 48, display:'flex', alignItems:'center', justifyContent:'center'}}
                >
                  {/* Blinga logo — fades out on hover */}
                  <div style={{
                    position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                    opacity: isLogoHovered ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                    transform: 'scale(0.85)', transformOrigin:'center',
                  }}>
                    <BlingaLogo size="sm" className="text-black dark:text-white" />
                  </div>
                  {/* Close icon — fades in on hover */}
                  <div style={{
                    position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                    opacity: isLogoHovered ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}>
                    <PanelLeftOpen className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <button
                type="button"
                aria-label="Sidebar logo"
                onClick={(event) => event.stopPropagation()}
                className="cursor-default"
              >
                <div style={{ transform: 'scale(1.0)', transformOrigin: 'center' }}>
                  <BlingaLogo size="sm" className="text-black dark:text-white" />
                </div>
              </button>
              <button
                type="button"
                aria-label={forceFull ? "Close sidebar" : "Minimize sidebar"}
                onClick={closeSidebarStage}
                className={`group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-150 ${closeButtonPosition === 'bottom' ? 'hidden' : ''}`}
              >
                <PanelLeftClose className="w-5 h-5 text-current" />
              </button>
            </>
          )}
        </div>

        {isMini ? (
          <div className="flex-1 flex flex-col items-center pt-1 relative">
            {/* Sliding active tab pill */}
            {miniActiveTabIndex >= 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 w-[44px] h-[32px] rounded-full bg-[#F1F1F1] dark:bg-zinc-800 pointer-events-none"
                style={{
                  top: `calc(${miniActiveTabIndex * 34}px + 5px)`,
                  transition: 'top 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            )}
            <MiniNavButton asset="search" label="Search Chats" onClick={openSpotlight} />
            <MiniNavButton asset="chat" label="New Chat" onClick={openNewChatConfig} active={tabsInSidebar && activeTab === 'ask' && !askHasMessages} />

            {tabsInSidebar && (<>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Owl Mode"
                    onClick={(e) => { e.stopPropagation(); onToggleOwnMode?.(); }}
                    className={`h-[34px] w-full mx-auto flex items-center justify-center transition-all duration-150 group`}
                  >
                    
                    <span className={`flex items-center justify-center w-[44px] h-[32px] rounded-full transition-colors duration-150 ${!ownMode ? "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60" : ""}`}>
                      <img src={sidebarAsset("ownMode")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display:'block'}} />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{ownMode ? 'Exit Owl Mode' : 'Owl Mode'}</TooltipContent>
              </Tooltip>
              <MiniNavButton asset="ask" label="Ask" onClick={() => onTabChange?.('ask')} active={activeTab === 'ask' && askHasMessages} />
              <MiniNavButton asset="minds" label="Blinga Minds" onClick={() => onTabChange?.('philosopher')} active={activeTab === 'philosopher'} />
              <MiniNavButton asset="games" label="Blinga Games" onClick={() => onTabChange?.('blinga-games')} active={activeTab === 'blinga-games'} />
              <MiniNavButton asset="library" label="Library" onClick={() => onTabChange?.('library')} active={activeTab === 'library'} />

            </>)}
            <MiniNavButton asset="history" label="Chats" onClick={() => setIsMini(false)} />
            {/* Free space — tooltip + click to expand, only fires on empty area since buttons stopPropagation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex-1 w-full cursor-pointer"
                  onClick={() => setIsMini(false)}
                  aria-label="Expand sidebar"
                />
              </TooltipTrigger>
              <TooltipContent side="right">Click to expand sidebar</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <>
            <div className="px-3 space-y-0.5 mt-1">
              <button
                type="button"
                onClick={openSpotlight}
                className="w-full flex items-center gap-3 px-3 py-0.5 rounded-full text-zinc-700 dark:text-zinc-300 transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-left"
              >
                <span className="w-8 flex items-center justify-center flex-shrink-0"><Search aria-hidden="true" style={{ width: '18px', height: '18px', strokeWidth: 2.2 }} /></span>
                <span className="text-[14px] font-medium">Search Chats</span>
              </button>

              <button
                type="button"
                onClick={openNewChatConfig}
                className={`w-full flex items-center gap-3 px-3 py-0.5 rounded-full transition-all duration-150 ${minimalAnimations ? "" : "active:scale-[0.97]"} text-left ${tabsInSidebar && activeTab === 'ask' && !askHasMessages ? 'bg-[#F1F1F1] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'}`}
              >
                <span className="w-8 flex items-center justify-center flex-shrink-0"><img src={sidebarAsset("chat")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display:'block'}} /></span>
                <span className="text-[14px] font-medium">New Chat</span>
              </button>

              {/* Extra tab items when tabsInSidebar is enabled */}
              {tabsInSidebar && (<>
                {/* Own Mode toggle */}
                <button
                  type="button"
                  onClick={() => onToggleOwnMode?.()}
                  className={`w-full flex items-center gap-3 px-3 py-0.5 rounded-full transition-all duration-150 ${minimalAnimations ? "" : "active:scale-[0.97]"} text-left ${ownMode ? 'bg-[#F1F1F1] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'}`}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <span className={`flex items-center justify-center w-[44px] h-[32px] rounded-full transition-colors duration-150 ${!ownMode ? "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60" : ""}`}>
                      <img src={sidebarAsset("ownMode")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'grayscale(1)', opacity: isDarkTheme ? 0.9 : 0.6, display:'block'}} />
                    </span></span>
                  <span className="text-[14px] font-medium">Owl Mode</span>
                  {ownMode && <span className="ml-auto text-[11px] font-medium opacity-70">ON</span>}
                </button>

                <button
                  type="button"
                  onClick={() => { onTabChange?.('ask'); }}
                  className={`w-full flex items-center gap-3 px-3 py-0.5 rounded-full transition-all duration-150 ${minimalAnimations ? "" : "active:scale-[0.97]"} text-left ${activeTab === 'ask' && askHasMessages ? 'bg-[#F1F1F1] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'}`}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0"><img src={sidebarAsset("ask")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display:'block'}} /></span>
                  <span className="text-[14px] font-medium">Ask</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onTabChange?.('philosopher'); }}
                  className={`w-full flex items-center gap-3 px-3 py-0.5 rounded-full transition-all duration-150 ${minimalAnimations ? "" : "active:scale-[0.97]"} text-left ${activeTab === 'philosopher' ? 'bg-[#F1F1F1] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'}`}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0"><img src={sidebarAsset("minds")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display:'block'}} /></span>
                  <span className="text-[14px] font-medium">Blinga Minds</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onTabChange?.('blinga-games'); }}
                  className={`w-full flex items-center gap-3 px-3 py-0.5 rounded-full transition-all duration-150 ${minimalAnimations ? "" : "active:scale-[0.97]"} text-left ${activeTab === 'blinga-games' ? 'bg-[#F1F1F1] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'}`}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0"><img src={sidebarAsset("games")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display:'block'}} /></span>
                  <span className="text-[14px] font-medium">Blinga Games</span>
                </button>
                  <button
                    type="button"
                    onClick={() => { onTabChange?.('library'); }}
                    className={`w-full flex items-center gap-3 px-3 py-0.5 rounded-full transition-all duration-150 ${minimalAnimations ? "" : "active:scale-[0.97]"} text-left ${activeTab === 'library' ? 'bg-[#F1F1F1] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'}`}
                  >
                    <span className="w-8 flex items-center justify-center flex-shrink-0"><img src={sidebarAsset("library")} alt="" style={{width:'18px',height:'18px', filter: isDarkTheme ? 'invert(0.75)' : 'brightness(0)', display:'block'}} /></span>
                    <span className="text-[14px] font-medium">Library</span>
                  </button>
              </>)}
            </div>

            <div className="flex items-center gap-3 px-6 mb-1 mt-4 text-zinc-900 dark:text-zinc-100 font-semibold flex-shrink-0">
              <img src={sidebarAsset("history")} alt="" className="h-4 w-4 object-contain flex-shrink-0" />
              <span className="text-[15px]">Chats:</span>
            </div>
          </>
        )}
        {!isMini && <div className="min-h-0 flex-1 overflow-y-auto px-3">
          <div className="space-y-2">
            {/* ── Pinned section ── */}
            {pinnedItems.length > 0 && (
              <div className="space-y-0.5">
                <h4 className="hidden text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1 px-3 flex items-center gap-1.5 opacity-90">
                  <Pin className="w-3 h-3 fill-current" /> Pinned
                </h4>
                <div className="space-y-1">
                  {pinnedItems.map(chat => (
                    <div key={chat.id}
                      className={`group relative px-3 py-2 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                        currentProjectId === chat.id
                          ? 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                          : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                      onClick={() => onProjectSelect(chat.id)}
                      onMouseEnter={() => setHoveredProject(`pinned-${chat.id}`)}
                      onMouseLeave={() => setHoveredProject(null)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Pin className="w-3.5 h-3.5 flex-shrink-0 text-zinc-900 dark:text-zinc-100 fill-current" />
                          <p className="text-[13px] font-medium truncate leading-relaxed">{chat.nomadData?.chatIcon && <span className="mr-1.5 text-lg leading-none">{chat.nomadData.chatIcon.startsWith('data:') || chat.nomadData.chatIcon.startsWith('/') ? <img src={chat.nomadData.chatIcon} alt="" className="inline-block h-6 w-6 rounded-full object-cover align-[-4px]" /> : chat.nomadData.chatIcon}</span>}{chat.title || 'New Chat'}</p>
                          {chat.hasNomad && (
                            <span className="flex-shrink-0" style={{
                              display: 'inline-block', width: 14, height: 14,
                              WebkitMaskImage: 'url(/creativity-icon.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat',
                              maskImage: 'url(/creativity-icon.svg)', maskSize: 'contain', maskRepeat: 'no-repeat',
                              background: 'linear-gradient(135deg, #ffffff 0%, #374151 100%)',
                            }} />
                          )}
                        </div>
                        {hoveredProject === `pinned-${chat.id}` && (
                          <div className="flex items-center gap-1 ml-2 transition-opacity duration-200">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={e => togglePin(e, chat.id)}
                                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors flex-shrink-0"
                                >
                                  <PinOff className="h-3.5 w-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Unpin</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={e => { e.stopPropagation(); openChatConfig(chat); }}
                                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors flex-shrink-0"
                                >
                                  <SlidersHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Chat settings</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {allGroupKeys.map(groupName => {
              const groupChats = chatGroups[groupName] ?? [];
              if (groupChats.length === 0) return null;
              return (
                <div key={groupName} className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1 px-3">{groupName}</h4>
                  <div className="space-y-1">
                    {/* Regular chat items */}
                    {(showAllGroups.has(groupName + "_chat") ? groupChats : groupChats.slice(0, 5)).map((chat) => (
                      <div
                        key={chat.id}
                        className={`group relative px-3 py-2 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                          currentProjectId === chat.id
                            ? 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                            : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }`}
                        onClick={() => editingProject !== chat.id && onProjectSelect(chat.id)}
                        onMouseEnter={() => setHoveredProject(chat.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            {editingProject === chat.id ? (
                              <div className="space-y-2 py-1">
                                <Input
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="text-xs h-7 bg-card border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg"
                                  autoFocus
                                />
                                <div className="flex space-x-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" className="h-6 px-2 text-[10px] rounded-md"
                                        onClick={(e) => { e.stopPropagation(); onEditProject?.(chat.id, editTitle); setEditingProject(null); }}>
                                        <Check className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Save</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] border-zinc-200 dark:border-zinc-800 rounded-md"
                                        onClick={(e) => { e.stopPropagation(); setEditingProject(null); }}>
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Cancel</TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 min-w-0">
                                <p className="text-[13px] font-medium truncate leading-relaxed">
                                  {chat.nomadData?.chatIcon && <span className="mr-1.5 text-lg leading-none">{chat.nomadData.chatIcon.startsWith('data:') || chat.nomadData.chatIcon.startsWith('/') ? <img src={chat.nomadData.chatIcon} alt="" className="inline-block h-6 w-6 rounded-full object-cover align-[-4px]" /> : chat.nomadData.chatIcon}</span>}{chat.title || 'New Chat'}
                                </p>
                                {chat.hasNomad && (
                                  <span className="flex-shrink-0" style={{
                                    display: 'inline-block', width: 14, height: 14,
                                    WebkitMaskImage: 'url(/creativity-icon.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat',
                                    maskImage: 'url(/creativity-icon.svg)', maskSize: 'contain', maskRepeat: 'no-repeat',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #374151 100%)',
                                  }} />
                                )}
                              </div>
                            )}
                          </div>
                          {(hoveredProject === chat.id || isTouchDevice) && editingProject !== chat.id && (
                            <div className="flex items-center gap-0.5 ml-2 transition-opacity duration-200 animate-in fade-in">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => togglePin(e, chat.id)}
                                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
                                  >
                                    {pinnedChats.has(chat.id) ? (
                                      <PinOff className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
                                    ) : (
                                      <Pin className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>{pinnedChats.has(chat.id) ? "Unpin" : "Pin chat"}</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openChatConfig(chat); }}
                                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
                                  >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Chat settings</TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {groupChats.length > 5 && !showAllGroups.has(groupName + "_chat") && (
                      <button className="px-3 py-0.5 text-[11px] text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors font-bold uppercase tracking-tighter"
                        onClick={() => setShowAllGroups(prev => new Set(prev).add(groupName + "_chat"))}>
                        See more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

        {/* ── Bottom joined card (usage + user account) ── */}
        <div className={`mt-auto flex-shrink-0 ${isMini ? 'p-2' : 'px-3 pb-3'}`}>
          {isMini ? (
            /* Mini mode: just avatar button */
            user && (
              <button
                type="button"
                aria-label={`Open profile for ${user.username || user.email}`}
                onClick={() => setIsMini(false)}
                className="mx-auto flex items-center justify-center rounded-full hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-all"
              >
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="h-9 w-9 rounded-full object-cover shadow-lg" />
                ) : (
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-[15px] shadow-lg"
                    style={{ background: getVibrantColor(user.username || user.email) }}
                  >
                    {(user.username || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            )
          ) : (
            /* Full mode: joined card */
            <>
              <div data-sidebar-profile-card className="rounded-[1.75rem] border-2 border-zinc-200 dark:border-zinc-700/60 bg-card overflow-hidden" ref={profileMenuRef}>

              {/* Inline expanded menu (customize profile or settings) — animated */}
              <AnimatePresence initial={false}>
                {profileMenuOpen && (
                  <motion.div
                    key="profile-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ height: { type: "spring", stiffness: 340, damping: 34, mass: 0.8 }, opacity: { duration: 0.18 } }}
                    style={{ overflow: "hidden" }}
                  >
                    {isCustomizing ? (
                      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-card">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">Customize profile</p>
                          <button onClick={() => setIsCustomizing(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                          <button onClick={() => picInputRef.current?.click()} className="relative group">
                            {profilePicture ? (
                              <img src={profilePicture} alt="Profile" className="h-16 w-16 rounded-full object-cover shadow-lg" />
                            ) : (
                              <div className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                                style={{ background: getVibrantColor(user?.username || user?.email || '') }}>
                                {(user?.username || user?.email || '').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <UserPen className="h-5 w-5 text-white" />
                            </div>
                          </button>
                          <p className="text-[11px] text-zinc-400 mt-1.5">Click to upload photo</p>
                          <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
                        </div>
                        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Display name</p>
                        <div className="flex items-center gap-2">
                          <Input value={renameValue} onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsCustomizing(false); }}
                            placeholder={user?.username || user?.email} autoFocus className="h-8 text-sm" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={handleRenameSubmit} className="p-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-80 transition-opacity flex-shrink-0">
                                <Check className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Save name</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ) : (
                      <div className="px-2 py-2 flex flex-col gap-0.5">
                        {/* Settings */}
                        <button
                          onClick={() => { onOpenSettings?.(); setProfileMenuOpen(false); }}
                          className="sidebar-profile-hover w-full flex items-center gap-3 px-3 py-2 rounded-[1.25rem] text-[13px] text-zinc-600 dark:text-zinc-300"
                        >
                          <Settings className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                          <span className="font-medium">Settings</span>
                        </button>

                        {/* Customize profile */}
                        <button
                          onClick={() => { setRenameValue(user?.username || user?.email || ''); setIsCustomizing(true); }}
                          className="sidebar-profile-hover w-full flex items-center gap-3 px-3 py-2 rounded-[1.25rem] text-[13px] text-zinc-600 dark:text-zinc-300"
                        >
                          <UserPen className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                          <span className="font-medium">Customize profile</span>
                        </button>

                        {/* Log out */}
                        <button
                          onClick={() => { setProfileMenuOpen(false); setShowLogoutConfirm(true); }}
                          className="sidebar-profile-hover w-full flex items-center gap-3 px-3 py-2 rounded-[1.25rem] text-[13px] text-red-500"
                        >
                          <LogOut className="h-4 w-4 flex-shrink-0 text-red-400" />
                          <span className="font-medium">Log out</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User row */}
              {user && (
                <motion.button
                  type="button"
                  onClick={() => setProfileMenuOpen(v => !v)}
                  className="sidebar-profile-hover group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[1.5rem] text-left bg-transparent"
                  aria-label="Expand account menu"
                >
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="h-8 w-8 rounded-full flex-shrink-0 object-cover shadow" />
                  ) : (
                    <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[13px] shadow"
                      style={{ background: getVibrantColor(user.username || user.email) }}>
                      {(user.username || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-tight">{user.username || user.email}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight">{isUltimatePlan ? 'Max' : isProPlan ? 'Pro' : isStarterPlan ? 'Starter' : 'Free'}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: profileMenuOpen ? 0 : 180 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </motion.div>
                  {closeButtonPosition === 'bottom' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          role="button"
                          onClick={e => { e.stopPropagation(); closeSidebarStage(); }}
                          className="relative z-10 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex-shrink-0"
                        >
                          <img src={sidebarAsset("close")} alt="" className="h-4 w-4 object-contain" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Close sidebar</TooltipContent>
                    </Tooltip>
                  )}
                </motion.button>
              )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* ── Spotlight Search ── */}
      {spotlightOpen && createPortal(
        <SpotlightSearch
          query={spotlightQuery}
          onQueryChange={setSpotlightQuery}
          onClose={() => setSpotlightOpen(false)}
          chats={chatItems}
          onSelect={(id) => { onProjectSelect(id); setSpotlightOpen(false); }}
          isDark={isDarkTheme}
        />,
        document.body
      )}
      {/* ── Chat Config Dialog ── */}
      <Dialog open={chatConfigOpen} onOpenChange={setChatConfigOpen}>
        <DialogContent className="bg-white dark:bg-[#121214] border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2.5rem] p-0 max-w-[420px] w-full overflow-hidden shadow-2xl">
          <DialogHeader className="items-center px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 text-center">
            <DialogTitle className="w-full text-center text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{chatConfigCreateMode ? 'Chat Personalization' : 'Chat Settings'}</DialogTitle>
            <DialogDescription className="w-full max-w-[330px] text-center text-[12.5px] text-zinc-500 dark:text-zinc-400 mt-1.5">
              {chatConfigCreateMode ? 'Name your chat and choose how the AI should respond.' : 'Customize name, assign a specialized AI persona, or manage this chat.'}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Chat name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Chat Name</label>
              <Input
                value={chatConfigTitle}
                onChange={e => setChatConfigTitle(e.target.value)}
                placeholder="Name your conversation..."
                className="h-10 text-[13.5px] bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-900 dark:text-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all"
              />
            </div>

            {/* Chat icon */}
            <div className="space-y-2">
              <label className="block text-center text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Chat Icon</label>
              <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 p-2 [&>button:nth-child(n+7)]:hidden">
                {CHAT_ICON_IMAGES.map(icon => (
                  <button key={icon} type="button" onClick={() => setChatConfigIcon(icon)} className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-all ${chatConfigIcon === icon ? 'ring-2 ring-zinc-900 shadow-md scale-105 dark:ring-white' : 'hover:scale-105'}`} aria-label="Use professional chat icon"><img src={icon} alt="" className="h-full w-full object-cover" /></button>
                ))}
                <div className="contents">
                  {customChatIcons.map((icon, index) => <button key={`${icon}-${index}`} type="button" onClick={() => setChatConfigIcon(icon)} className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-all ${chatConfigIcon === icon ? 'ring-2 ring-zinc-900 shadow-md scale-105 dark:ring-white' : 'hover:scale-105'}`} aria-label="Use saved custom chat icon"><img src={icon} alt="Saved custom icon" className="h-full w-full object-cover" /></button>)}
                </div>
                <button type="button" onClick={openCustomIconPicker} className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-300 text-2xl text-zinc-500 hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-800" aria-label="Add custom chat icon">+</button>
                {['💬', '💡', '🧠', '🚀', '🎯', '📚', '💼', '❤️', '⭐', '🔥', '🌱', '🎨'].map(icon => (
                  <button key={icon} type="button" onClick={() => setChatConfigIcon(icon)} className={`h-9 w-9 rounded-full text-lg transition-all ${chatConfigIcon === icon ? 'bg-white dark:bg-zinc-100 shadow-md scale-110' : 'hover:bg-white/70 dark:hover:bg-zinc-800'}`} aria-label={`Use ${icon} as chat icon`}>{icon}</button>
                ))}
                <label className="hidden">
                  {chatConfigIcon.startsWith('data:') ? <img src={chatConfigIcon} alt="Custom chat icon" className="h-7 w-7 rounded-full object-cover" /> : '＋'}
                  <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (!file || !['image/png', 'image/jpeg'].includes(file.type)) return; const reader = new FileReader(); reader.onload = () => setChatConfigIcon(String(reader.result)); reader.readAsDataURL(file); }} />
                </label>
              </div>
            </div>

            {/* AI Role */}
            <div className="space-y-2">
              <div className="text-center space-y-1">
                <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">AI Persona</label>
                <span className="block text-[11px] text-zinc-400 font-medium">Select identity</span>
              </div>
              <div ref={personaNavRef} className="relative flex flex-nowrap items-center justify-start gap-1 overflow-x-auto rounded-full bg-zinc-100/70 dark:bg-[rgb(56_56_56)] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {personaPillStyle.ready && (
                  <div aria-hidden className="absolute top-1.5 bottom-1.5 pointer-events-none z-0" style={{
                    left: personaPillStyle.left,
                    width: personaPillStyle.width,
                    transition: 'left 0.32s cubic-bezier(0.22,1,0.36,1), width 0.32s cubic-bezier(0.22,1,0.36,1)',
                  }}>
                    <div className="absolute inset-0 rounded-full bg-white dark:bg-zinc-100 shadow-sm" />
                  </div>
                )}
                {AI_ROLES.map(role => {
                  const active = chatConfigRole === role.id;
                  return (
                    <button
                      key={role.id}
                      ref={el => { personaBtnRefs.current[AI_ROLES.indexOf(role)] = el; }}
                      onClick={() => {
                        setChatConfigRole(role.id);
                        personaBtnRefs.current[AI_ROLES.indexOf(role)]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                      }}
                      className={`relative z-10 shrink-0 rounded-full px-3.5 py-2 text-center text-[11px] font-semibold transition-colors duration-200 whitespace-nowrap ${
                        active
                          ? 'text-zinc-900 shadow-sm dark:text-zinc-900'
                          : 'text-zinc-600 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role questionnaire */}
            {(() => {
              const role = AI_ROLES.find(r => r.id === chatConfigRole);
              if (!role || role.questions.length === 0) return null;
              return (
                <div className="space-y-3 pt-1">
                  <div className="text-center">
                    <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Persona Context</label>
                  </div>
                  <div className="space-y-2.5 bg-zinc-50/70 dark:bg-zinc-900/40 p-3.5 rounded-2xl overflow-hidden">
                    {role.questions.map(q => (
                      <div key={q.key} className="space-y-1">
                        <label className="text-[11.5px] font-medium text-zinc-600 dark:text-zinc-300">{q.label}</label>
                        <Input
                          value={roleAnswers[q.key] || ''}
                          onChange={e => setRoleAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                          placeholder="Optional details..."
                          className="h-8.5 text-xs bg-white dark:bg-zinc-800/80 border-0 rounded-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Danger zone */}
            {!chatConfigCreateMode && <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <button
                onClick={() => { onDeleteProject(chatConfigId); setChatConfigOpen(false); }}
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-150"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="font-extrabold">Delete chat</span>
              </button>
            </div>}
          </div>

          {/* Footer buttons */}
          <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-end gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatConfigOpen(false)}
              className="rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-semibold px-4 h-9"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={saveChatConfig}
              className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-semibold px-5 h-9 shadow-xs"
            >
              {chatConfigCreateMode ? 'Create chat' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
        <DialogContent className="max-w-[360px] rounded-[2rem] p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Custom chat icon</DialogTitle>
            <DialogDescription className="text-center">Create an image or emoji icon.</DialogDescription>
          </DialogHeader>
          <div className="relative flex rounded-full bg-muted p-1">
            <span className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%_-_4px)] rounded-full bg-background shadow-sm transition-transform duration-300 ease-out" style={{ transform: iconPickerTab === 'emoji' ? 'translateX(100%)' : 'translateX(0)' }} />
            <button type="button" onClick={() => setIconPickerTab('image')} className={`relative z-10 flex-1 rounded-full py-2 text-xs font-semibold ${iconPickerTab === 'image' ? 'text-foreground' : 'text-muted-foreground'}`}>Custom image</button>
            <button type="button" onClick={() => setIconPickerTab('emoji')} className={`relative z-10 flex-1 rounded-full py-2 text-xs font-semibold ${iconPickerTab === 'emoji' ? 'text-foreground' : 'text-muted-foreground'}`}>Emoji</button>
          </div>
          <div className="flex justify-center rounded-2xl bg-muted/60 p-5">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full" style={{ background: iconPickerTab === 'emoji' ? customIconBg : 'transparent' }}>
              {iconPickerTab === 'image' && customIconSource ? <img src={customIconSource} alt="Preview" className="h-full w-full object-cover" style={{ transform: `scale(${customIconZoom})` }} /> : <span className="text-7xl">{customEmoji}</span>}
            </div>
          </div>
          {iconPickerTab === 'image' ? <>
            <label className="flex cursor-pointer items-center justify-center rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Choose PNG/JPG<input type="file" accept="image/png,image/jpeg" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (!file || !['image/png', 'image/jpeg'].includes(file.type)) return; const reader = new FileReader(); reader.onload = () => setCustomIconSource(String(reader.result)); reader.readAsDataURL(file); }} /></label>
            <label className="text-xs text-muted-foreground">Crop / zoom<input type="range" min="1" max="2.5" step="0.05" value={customIconZoom} onChange={e => setCustomIconZoom(Number(e.target.value))} className="mt-2 w-full" /></label>
          </> : <div className="grid max-h-52 grid-cols-8 gap-1.5 overflow-y-auto rounded-2xl bg-muted p-2">{CHAT_EMOJIS.map((emoji, index) => <button key={`${emoji}-${index}`} type="button" onClick={() => setCustomEmoji(emoji)} className={`flex h-8 w-8 items-center justify-center rounded-full text-xl transition-all ${customEmoji === emoji ? 'bg-background shadow-sm scale-110' : 'hover:bg-background/70'}`}>{emoji}</button>)}</div>}
          {iconPickerTab === 'emoji' && <div><p className="mb-2 text-center text-xs text-muted-foreground">Background color</p><div className="flex justify-center gap-2">{iconBgColors.map(color => <button key={color} type="button" onClick={() => setCustomIconBg(color)} className={`h-7 w-7 rounded-full border ${customIconBg === color ? 'ring-2 ring-foreground ring-offset-2' : ''}`} style={{ background: color }} />)}</div></div>}
          <Button type="button" onClick={applyCustomIcon} disabled={iconPickerTab === 'image' && !customIconSource} className="w-full rounded-full">Apply</Button>
        </DialogContent>
      </Dialog>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-[460px] mx-5 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 px-10 py-10 flex flex-col items-center text-center"
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Logo */}
            <div className="mb-5">
              <Logo size="lg" className="text-zinc-900 dark:text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Leaving Blinga?</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-7">
              We'll be waiting for your return!
            </p>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                className="flex-1 h-11 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-11 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Stay Signed In
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
    </TooltipProvider>
  );
}

















