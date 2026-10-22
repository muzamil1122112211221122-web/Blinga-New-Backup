import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function applyThemeClass(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

function getSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** One reusable overlay div — opacity-only animation, GPU-composited, zero layout cost. */
function getOverlay(): HTMLDivElement {
  let el = document.getElementById("blinga-theme-overlay") as HTMLDivElement | null
  if (!el) {
    el = document.createElement("div")
    el.id = "blinga-theme-overlay"
    Object.assign(el.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99999",
      pointerEvents: "none",
      opacity: "0",
      background: "var(--background)",
      willChange: "opacity",
    })
    document.body.appendChild(el)
  }
  return el
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    typeof window === "undefined" ? "light" : getSystemTheme()
  )

  const resolvedTheme = theme === "system" ? systemTheme : theme

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light")
    }
    setSystemTheme(media.matches ? "dark" : "light")
    media.addEventListener?.("change", handleChange)
    return () => media.removeEventListener?.("change", handleChange)
  }, [])

  useEffect(() => {
    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => {
        applyThemeClass(theme)
      });
    } else {
      applyThemeClass(theme)
    }
  }, [theme, systemTheme])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
