<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Variant = "primary" | "ghost" | "secondary" | "danger";

  let {
    variant = "primary",
    type = "button",
    disabled = false,
    loading = false,
    class: className = "",
    children,
    ...rest
  } = $props<
    HTMLButtonAttributes & {
      variant?: Variant;
      loading?: boolean;
      class?: string;
      children?: import("svelte").Snippet;
    }
  >();

  const variantClass = $derived(
    variant === "primary"
      ? "ui-button--primary"
      : variant === "ghost"
        ? "ui-button--ghost"
        : variant === "secondary"
          ? "ui-button--secondary"
          : "ui-button--danger"
  );
</script>

<button
  {...rest}
  {type}
  class="ui-button {variantClass}{loading ? ' ui-button--loading' : ''}{className ? ` ${className}` : ''}"
  disabled={disabled || loading}
  aria-busy={loading ? true : undefined}
>
  {#if loading}
    <svg class="ui-button__spinner" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        stroke-opacity="0.28"
        stroke-width="2"
      />
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="9.42 28.27"
      />
    </svg>
  {/if}
  {@render children?.()}
</button>
