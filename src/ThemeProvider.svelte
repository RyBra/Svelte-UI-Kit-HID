<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import {
    createThemeController,
    type ResolvedTheme,
    type ThemeController,
    type ThemePreference
  } from "./theme.js";
  import { THEME_CONTEXT_KEY, type ThemeContextValue } from "./theme-context.js";

  type Props = {
    initialTheme?: ThemePreference;
    storageKey?: string;
  };

  let { initialTheme = "system", storageKey = "yaray:theme" }: Props = $props();

  const theme = writable<ThemePreference>(initialTheme);
  const resolvedTheme = writable<ResolvedTheme>("light");
  let themeController: ThemeController | null = null;
  let unsubscribe: (() => void) | null = null;

  function setTheme(nextTheme: ThemePreference) {
    themeController?.setTheme(nextTheme);
  }

  function toggleTheme() {
    themeController?.toggleTheme();
  }

  const contextValue: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  };

  setContext(THEME_CONTEXT_KEY, contextValue);

  onMount(() => {
    themeController = createThemeController({
      defaultTheme: initialTheme,
      storageKey
    });

    unsubscribe = themeController.subscribe((next) => {
      theme.set(next.themePreference);
      resolvedTheme.set(next.resolvedTheme);
    });

    themeController.initTheme();
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
    themeController?.destroy();
  });
</script>

<slot />
