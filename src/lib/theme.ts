export type ThemeId = "night" | "ice";

export const THEME_STORAGE_KEY = "nishiki-theme";

export const themes: Record<
  ThemeId,
  {
    label: string;
    description: string;
  }
> = {
  night: {
    label: "雪夜",
    description: "夜晚的雪街",
  },
  ice: {
    label: "晴日",
    description: "白天的雪街",
  },
};

// Dispatched on window whenever the theme changes, so effects can react to it.
export const THEME_CHANGE_EVENT = "nishiki-theme-change";

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value === "night" || value === "ice";
}
