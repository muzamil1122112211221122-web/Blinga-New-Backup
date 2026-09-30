// ─────────────────────────────────────────────────────────────────────────────
// Global image pre-cache
//
// Two-layer strategy:
//   Layer 1 — <link rel="preload"> in index.html  (browser level, before JS)
//              Browser's preload scanner fetches every image before React mounts
//              or login screen appears.  Zero JS overhead.
//
//   Layer 2 — new Image() here  (JS level, keeps images in memory)
//              Pins decoded pixel data in browser memory so images are truly
//              instant on first render — no decode stall even if the HTTP cache
//              was warm.  Runs immediately when the module loads (before the
//              React tree mounts).
//
// Bundled assets (@assets/… imports) are handled by Vite's pipeline and don't
// need either layer.
// ─────────────────────────────────────────────────────────────────────────────
import { SIDEBAR_ASSETS } from "./lib/sidebar-assets";

const STATIC_IMAGES: string[] = [
  // ── AI model logos ─────────────────────────────────────────────────────────
  '/chatgpt-logo.svg',
  '/chatgpt-logo-white.png',
  '/claude-logo.svg',
  '/gemini-logo.svg',
  '/grok-logo.svg',
  '/deepseek-logo.svg',
  '/kimi-logo.svg',
  '/perplexity-logo.svg',
  '/mistral-logo.svg',
  '/qwen-logo.svg',
  '/llama-logo.svg',
  '/doubao-logo.svg',
  '/blinga-logo.png',
  '/bytedance-logo.svg',
  '/copilot-logo.png',
  '/meta-ai-logo.png',
  '/forus-logo.svg',

  // ── Mode / avatar icons ────────────────────────────────────────────────────
  '/nomad-avatar.svg',
  '/nomad-auto-icon.svg',
  '/nomad-multi-icon.png',
  '/nomad-multi-dark.png',
  '/nomad-multi-light.png',
  '/philosopher-avatar.svg',
  '/blinga-games-avatar.png',
  '/forus-games-avatar.svg',
  '/lumin-avatar.svg',
  '/incognito-dark.png',
  '/incognito-light.png',
  '/owl-dark.png',
  '/owl-light.png',

  // ── Settings sidebar tab icons ─────────────────────────────────────────────
  '/settings-account-gray.png',
  '/settings-account-black.png',
  '/settings-appearance-gray.png',
  '/settings-appearance-black.png',
  '/settings-behaviour-gray.png',
  '/settings-behaviour-black.png',
  '/settings-nomad-gray.png',
  '/settings-nomad-black.png',

  // ── Sidebar icons ──────────────────────────────────────────────────────────
  '/sb-search-icon.png',
  '/sb-chat-icon.png',
  '/sb-voice-icon.png',
  '/sb-imagine-icon.png',
  '/sb-history-icon.png',
  '/creativity-icon.svg',
  '/integration-icon.svg',
  '/settings-icon.svg',
  '/brain-icon.svg',
  ...Object.values(SIDEBAR_ASSETS).flatMap(icons => [icons.light, icons.dark]),

  // ── General UI icons ───────────────────────────────────────────────────────
  '/audio-icon.svg',
  '/chat-ai-icon.svg',
  '/copy-icon.svg',
  '/dislike-icon.svg',
  '/downloads-icon.svg',
  '/high-volume-icon.svg',
  '/mute-icon.svg',
  '/thumbs-up-icon.svg',
  '/icon-edit-image.svg',
  '/icon-remove-bg.svg',
  '/icon-orient-none.svg',
  '/icon-orient-portrait.svg',
  '/icon-orient-square.svg',
  '/icon-orient-wide.svg',
  '/podium-bars.svg',
  '/leaderboard-bg.svg',

  // ── Imagine style thumbnails ───────────────────────────────────────────────
  '/style-anime.svg',

  // ── Blinga Games — banner + logo for every game ─────────────────────────────
  '/game-memory-banner.svg',
  '/game-memory-logo.svg',
  '/game-maths-banner.svg',
  '/game-maths-logo.svg',
  '/game-word-banner.svg',
  '/game-word-logo.svg',
  '/game-quiz-banner.svg',
  '/game-quiz-logo.svg',
  '/game-car-banner.svg',
  '/game-car-logo.svg',
  '/game-oddword-banner.svg',
  '/game-oddword-logo.svg',
  '/game-rps.svg',
  '/game-tictactoe.svg',

  // ── Blinga Imagine templates ─────────────────────────────────────────────────
  '/templates/anime.svg',
  '/templates/ceo.svg',
  '/templates/redecorate.svg',
  '/templates/restore.svg',
  '/templates/sketch.svg',
  '/templates/style-upgrade.svg',
  '/templates/winter.svg',

  // ── Blinga Minds — personality avatars (all 27) ─────────────────────────────
  '/personalities/akbar.png',
  '/personalities/alexander.png',
  '/personalities/aristotle.png',
  '/personalities/caesar.png',
  '/personalities/confucius.png',
  '/personalities/da_vinci.png',
  '/personalities/einstein.png',
  '/personalities/gandhi.png',
  '/personalities/genghis.png',
  '/personalities/hawking.png',
  '/personalities/jinnah.png',
  '/personalities/kant.png',
  '/personalities/machiavelli.png',
  '/personalities/mandela.png',
  '/personalities/marx.png',
  '/personalities/napoleon.png',
  '/personalities/newton.png',
  '/personalities/nietzsche.png',
  '/personalities/plato.png',
  '/personalities/rumi.png',
  '/personalities/shakespeare.png',
  '/personalities/socrates.png',
  '/personalities/suleiman.png',
  '/personalities/suntzu.png',
  '/personalities/tesla.png',
  '/personalities/tipu.png',
  '/personalities/turing.png',
];

// Holds decoded HTMLImageElement references so the browser keeps pixel data
// in memory rather than evicting it from the HTTP cache.
const _pinned: HTMLImageElement[] = [];

// Resolves once every image has loaded or failed.
// Capped at 3 s so a single broken/slow asset can never hang the app.
export const imagesReady: Promise<void> = Promise.race([
  Promise.all(
    STATIC_IMAGES.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.onload  = () => resolve();
          img.onerror = () => resolve(); // missing asset → skip, don't block
          img.src = src;
          _pinned.push(img);            // keep alive in module scope
        })
    )
  ).then(() => undefined),
  new Promise<void>(resolve => setTimeout(resolve, 3000)),
]);
