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
  {#if loading}<span class="ui-button__spinner" aria-hidden="true"></span>{/if}
  {@render children?.()}
</button>
