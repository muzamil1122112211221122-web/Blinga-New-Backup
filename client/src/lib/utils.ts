import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Soft pastel flat avatar background colors
// Mixed: yellow, light purple, gray, light yellow, sage, lavender, peach, sky
const AVATAR_COLORS: string[] = [
  '#FDE68A', // light yellow
  '#E9D5FF', // light purple
  '#D1D5DB', // gray
  '#FEF08A', // yellow
  '#BBF7D0', // mint green
  '#BAE6FD', // sky blue
  '#FECACA', // light rose
  '#C7D2FE', // lavender
  '#FED7AA', // light peach/orange
  '#D9F99D', // light lime
];

// Text colors paired with each background (dark enough for contrast)
const AVATAR_TEXT_COLORS: string[] = [
  '#92400E', // amber-800 on light yellow
  '#6B21A8', // purple-800 on light purple
  '#374151', // gray-700 on gray
  '#78350F', // amber-900 on yellow
  '#065F46', // emerald-800 on mint
  '#075985', // sky-800 on sky
  '#991B1B', // red-800 on rose
  '#3730A3', // indigo-800 on lavender
  '#C2410C', // orange-700 on peach
  '#3F6212', // lime-800 on lime
];

// Deterministic soft pastel color derived from a name/username — shared so every
// avatar (sidebar, mobile settings, etc.) renders the exact same DP for a user.
export function getVibrantColor(name: string, secondary = false): string {
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const idx = Math.abs(hash) % AVATAR_COLORS.length;
  // secondary = true returns the matching text color for that background
  return secondary ? AVATAR_TEXT_COLORS[idx] : AVATAR_COLORS[idx];
}
