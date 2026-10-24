"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemeChangeDetail,
  type ThemeId,
  type ThemePreference,
  isThemePreference,
  nextPreference,
  themeForHour,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  theme: ThemeId;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : "auto";
  } catch {
    return "auto";
  }
}

function resolveTheme(preference: ThemePreference): ThemeId {
  return preference === "auto" ? themeForHour(new Date().getHours()) : preference;
}

// Returns true when the visible theme actually changed.
function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return false;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === "ice" ? "light" : "dark";
  return true;
}

function announce(sceneChanged: boolean) {
  window.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(THEME_CHANGE_EVENT, { detail: { sceneChanged } }),
  );
}

// The shown theme lives on <html data-theme>, set before paint by the boot
// script in layout.tsx; the snapshot pairs it with the stored preference.
function getSnapshot() {
  return `${readPreference()}:${document.documentElement.dataset.theme ?? "night"}`;
}

function getServerSnapshot() {
  return "auto:night";
}

function subscribeToTheme(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    announce(applyTheme(resolveTheme(readPreference())));
  };
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeToTheme, getSnapshot, getServerSnapshot);
  const [preference, theme] = snapshot.split(":") as [ThemePreference, ThemeId];

  // In auto mode the scene follows the clock, so dusk arrives on its own.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = readPreference();
      if (current === "auto" && applyTheme(resolveTheme(current))) announce(true);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const cycleTheme = useCallback(() => {
    const current = readPreference();
    const next = nextPreference(current, resolveTheme(current));
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the change still applies to this visit.
    }
    announce(applyTheme(resolveTheme(next)));
  }, []);

  const value = useMemo(
    () => ({ preference, theme, cycleTheme }),
    [preference, theme, cycleTheme],
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
