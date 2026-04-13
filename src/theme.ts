export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type ThemeSnapshot = {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
};

export type ThemeController = {
  initTheme: () => ThemeSnapshot;
  setTheme: (nextTheme: ThemePreference) => ThemeSnapshot;
  toggleTheme: () => ThemeSnapshot;
  getState: () => ThemeSnapshot;
  subscribe: (listener: (state: ThemeSnapshot) => void) => () => void;
  destroy: () => void;
};

type ThemeControllerOptions = {
  storageKey?: string;
  defaultTheme?: ThemePreference;
  target?: HTMLElement;
};

const DEFAULT_STORAGE_KEY = "yaray:theme";

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(target: HTMLElement, theme: ResolvedTheme): void {
  target.dataset.theme = theme;
  target.style.colorScheme = theme;
}

function readStoredPreference(storageKey: string): ThemePreference | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const stored = window.localStorage.getItem(storageKey);
  return isThemePreference(stored) ? stored : null;
}

function writeStoredPreference(storageKey: string, preference: ThemePreference): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(storageKey, preference);
}

export function createThemeController(options: ThemeControllerOptions = {}): ThemeController {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const defaultTheme = options.defaultTheme ?? "system";
  const target = options.target ?? (typeof document !== "undefined" ? document.documentElement : null);

  let themePreference: ThemePreference = defaultTheme;
  let resolvedTheme: ResolvedTheme = defaultTheme === "system" ? resolveSystemTheme() : defaultTheme;
  const listeners = new Set<(state: ThemeSnapshot) => void>();
  let mediaQueryList: MediaQueryList | null = null;
  let detachSystemListener: (() => void) | null = null;

  const notify = () => {
    const state = { themePreference, resolvedTheme };
    listeners.forEach((listener) => listener(state));
  };

  const syncTarget = () => {
    if (!target) return;
    applyTheme(target, resolvedTheme);
  };

  const setResolvedTheme = (nextResolved: ResolvedTheme) => {
    resolvedTheme = nextResolved;
    syncTarget();
    notify();
  };

  const attachSystemListener = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    if (detachSystemListener) detachSystemListener();

    mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      if (themePreference !== "system") return;
      setResolvedTheme(event.matches ? "dark" : "light");
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", onSystemThemeChange);
      detachSystemListener = () => mediaQueryList?.removeEventListener("change", onSystemThemeChange);
      return;
    }

    mediaQueryList.addListener(onSystemThemeChange);
    detachSystemListener = () => mediaQueryList?.removeListener(onSystemThemeChange);
  };

  const setTheme = (nextTheme: ThemePreference): ThemeSnapshot => {
    themePreference = nextTheme;
    writeStoredPreference(storageKey, nextTheme);
    const nextResolved = nextTheme === "system" ? resolveSystemTheme() : nextTheme;
    setResolvedTheme(nextResolved);
    return { themePreference, resolvedTheme };
  };

  const initTheme = (): ThemeSnapshot => {
    const stored = readStoredPreference(storageKey);
    themePreference = stored ?? defaultTheme;
    resolvedTheme = themePreference === "system" ? resolveSystemTheme() : themePreference;
    syncTarget();
    attachSystemListener();
    notify();
    return { themePreference, resolvedTheme };
  };

  const toggleTheme = (): ThemeSnapshot => {
    if (themePreference === "system") {
      return setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
    return setTheme(themePreference === "dark" ? "light" : "dark");
  };

  return {
    initTheme,
    setTheme,
    toggleTheme,
    getState: () => ({ themePreference, resolvedTheme }),
    subscribe: (listener) => {
      listeners.add(listener);
      listener({ themePreference, resolvedTheme });
      return () => listeners.delete(listener);
    },
    destroy: () => {
      if (detachSystemListener) detachSystemListener();
      listeners.clear();
    }
  };
}
