import { getContext } from "svelte";
import type { Readable } from "svelte/store";
import type { ResolvedTheme, ThemePreference } from "./theme.js";

export type ThemeContextValue = {
  theme: Readable<ThemePreference>;
  resolvedTheme: Readable<ResolvedTheme>;
  setTheme: (nextTheme: ThemePreference) => void;
  toggleTheme: () => void;
};

export const THEME_CONTEXT_KEY = Symbol("yaray-theme-context");

export function getThemeContext(): ThemeContextValue {
  return getContext<ThemeContextValue>(THEME_CONTEXT_KEY);
}
