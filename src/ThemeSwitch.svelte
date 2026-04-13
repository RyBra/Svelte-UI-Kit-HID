<script lang="ts">
  import type { ThemePreference } from "./theme.js";
  import { getThemeContext } from "./theme-context.js";

  const { theme, setTheme } = getThemeContext();

  const options: Array<{ value: ThemePreference; label: string }> = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" }
  ];
</script>

<div class="theme-switch" role="group" aria-label="Theme mode">
  {#each options as option}
    <button
      type="button"
      class="theme-switch__option"
      class:is-active={$theme === option.value}
      aria-pressed={$theme === option.value}
      aria-label={`Switch to ${option.label} theme`}
      on:click={() => setTheme(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .theme-switch {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--s-8);
    padding: var(--s-8);
    border-radius: var(--r-20);
    border: 1px solid var(--border-subtle);
    background: var(--surface-elevated);
  }

  .theme-switch__option {
    min-height: 44px;
    border-radius: var(--r-pill);
    border: 1px solid var(--border-subtle);
    background: var(--surface-base);
    color: var(--text-primary);
    padding: 0 var(--s-8);
    font: 500 0.875rem/1 var(--font-family-sans);
  }

  .theme-switch__option.is-active {
    color: var(--text-inverse);
    background: var(--accent);
    border-color: transparent;
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
