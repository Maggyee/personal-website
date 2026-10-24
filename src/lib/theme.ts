export type ThemeId = "ice" | "dusk" | "night";
export type ThemePreference = ThemeId | "auto";

export const THEME_STORAGE_KEY = "nishiki-theme";

export const themes: Record<
  ThemeId,
  {
    label: string;
    description: string;
  }
> = {
  ice: {
    label: "晴日",
    description: "白天的雪街",
  },
  dusk: {
    label: "黄昏",
    description: "傍晚的雪街",
  },
  night: {
    label: "雪夜",
    description: "夜晚的雪街",
  },
};

// The theme button cycles through these in order.
export const preferenceOrder: ThemePreference[] = ["auto", "ice", "dusk", "night"];

export function nextPreference(current: ThemePreference, shown: ThemeId): ThemePreference {
  let index = preferenceOrder.indexOf(current);
  for (let step = 0; step < preferenceOrder.length; step += 1) {
    index = (index + 1) % preferenceOrder.length;
    const candidate = preferenceOrder[index];
    // Leaving auto for the theme that is already showing would look like a dead click.
    if (current === "auto" && candidate === shown) continue;
    return candidate;
  }
  return "auto";
}

// "auto" follows the visitor's local clock.
export const DAY_START_HOUR = 6;
export const DUSK_START_HOUR = 17;
export const NIGHT_START_HOUR = 19;

export function themeForHour(hour: number): ThemeId {
  if (hour >= DAY_START_HOUR && hour < DUSK_START_HOUR) return "ice";
  if (hour >= DUSK_START_HOUR && hour < NIGHT_START_HOUR) return "dusk";
  return "night";
}

export function isThemePreference(
  value: string | null | undefined,
): value is ThemePreference {
  return value === "auto" || value === "ice" || value === "dusk" || value === "night";
}

// Dispatched on window whenever the theme preference or the shown theme
// changes. `detail.sceneChanged` is true when the visible scene switched.
export const THEME_CHANGE_EVENT = "nishiki-theme-change";

export type ThemeChangeDetail = { sceneChanged: boolean };
