<script lang="ts">
  import type { ThemePreference } from "./theme.js";
  import { getThemeContext } from "./theme-context.js";

  const { theme, setTheme } = getThemeContext();

  const options: Array<{ value: ThemePreference; label: string }> = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" }
  ];

  const activeIndex = $derived.by(() => {
    const index = options.findIndex((option) => option.value === $theme);
    return index >= 0 ? index : 0;
  });
</script>

<div
  class="theme-switch ui-segmented"
  role="group"
  aria-label="Theme mode"
  style={`--seg-count: ${options.length}; --seg-index: ${activeIndex}; --seg-gap: var(--s-8); --seg-pad: var(--s-8);`}
>
  <span class="ui-segmented__indicator" aria-hidden="true"></span>
  {#each options as option}
    <button
      type="button"
      class="theme-switch__option ui-segmented__option"
      class:is-active={$theme === option.value}
      aria-pressed={$theme === option.value}
      aria-label={`Switch to ${option.label} theme`}
      onclick={() => setTheme(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .theme-switch {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    --seg-gap: var(--s-8);
    --seg-pad: var(--s-8);
    /* Pill track + concentric inner radius via --seg-inner-radius on .ui-segmented */
    --seg-outer-radius: var(--r-pill);
  }

  .theme-switch__option {
    min-height: 44px;
    padding: 0 var(--s-8);
    font: 500 0.875rem/1 var(--font-family-sans);
  }

  .theme-switch__option.is-active {
    color: var(--text-primary);
  }

  .theme-switch__option:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
  @media (min-width: 700px) {
    .theme-switch {
      max-width: 360px;
    }
  }
</style>
