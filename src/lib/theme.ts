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
    label: "夜色",
    description: "深蓝近黑",
  },
  ice: {
    label: "冰蓝",
    description: "浅冰蓝",
  },
};

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value === "night" || value === "ice";
}
