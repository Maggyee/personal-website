"use client";

import { useTheme } from "@/components/theme-provider";
import { nextPreference, themes, type ThemePreference } from "@/lib/theme";

const preferenceLabel = (preference: ThemePreference) =>
  preference === "auto" ? "自动" : themes[preference].label;

export function ThemeToggle() {
  const { preference, theme, cycleTheme } = useTheme();
  const next = nextPreference(preference, theme);
  const current =
    preference === "auto" ? `自动（现在是${themes[theme].label}）` : themes[theme].label;

  // Icons are picked by <html data-theme> in CSS so they are right from the first paint.
  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="theme-cycle"
      aria-label={`主题：${current}。点击切换到${preferenceLabel(next)}`}
      title={`主题：${current}，点击切换到${preferenceLabel(next)}`}
    >
      <span className="theme-cycle-icons" aria-hidden>
        <svg className="theme-icon theme-icon-ice" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.6" />
          <path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6" />
        </svg>
        <svg className="theme-icon theme-icon-dusk" viewBox="0 0 24 24">
          <path d="M3 17h18M6 20.5h12M7 17a5 5 0 0 1 10 0M12 4.5v3M4.6 10.1l2 1.6M19.4 10.1l-2 1.6" />
        </svg>
        <svg className="theme-icon theme-icon-night" viewBox="0 0 24 24">
          <path d="M18.2 16.2A7.2 7.2 0 0 1 9 6.7a7.4 7.4 0 1 0 9.2 9.5Z" />
        </svg>
      </span>
      <span className="theme-cycle-label">{preferenceLabel(preference)}</span>
    </button>
  );
}
