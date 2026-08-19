import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ==================================================================
   Site theme — dark (the brand default) and light, toggled from the
   nav bar and persisted across visits.
   ------------------------------------------------------------------
   Applies as a `data-theme` attribute on <html>; every color in
   styles/index.css is a CSS custom property keyed off that attribute,
   so this hook only has to flip one value, not touch a single
   component. Real photography (the hero, mastheads, cinematic breaks,
   the gallery) opts back out via the `.theme-pin-dark` utility class
   and always renders in the dark palette regardless of this setting —
   see the comment on that class in styles/index.css.
   ================================================================== */

export type Theme = "dark" | "light";

const STORAGE_KEY = "gas:theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    /* Private browsing / disabled storage — fall through to default. */
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStored() ?? "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* Non-fatal — the toggle still works for the rest of the session. */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
