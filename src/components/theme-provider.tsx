"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  THEME_STORAGE_KEY,
  type ThemeId,
  isThemeId,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_CHANGE_EVENT = "nishiki-theme-change";

function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === "night" ? "dark" : "light";
  root.classList.toggle("theme-night", theme === "night");
  root.classList.toggle("theme-ice", theme === "ice");
}

function getThemeSnapshot(): ThemeId {
  if (typeof window === "undefined") return "night";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeId(stored) ? stored : "night";
}

function getServerThemeSnapshot(): ThemeId {
  return "night";
}

function subscribeToTheme(onStoreChange: () => void) {
  const onThemeChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(getThemeSnapshot());
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setTheme = useCallback((next: ThemeId) => {
    applyTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "night" ? "ice" : "night");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
