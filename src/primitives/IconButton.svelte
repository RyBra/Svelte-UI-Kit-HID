<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Variant = "neutral" | "accent" | "danger";

  let {
    variant = "neutral",
    type = "button",
    disabled = false,
    "aria-label": ariaLabel,
    class: className = "",
    children,
    ...rest
  } = $props<
    HTMLButtonAttributes & {
      variant?: Variant;
      class?: string;
      children?: import("svelte").Snippet;
      "aria-label": string;
    }
  >();

  const variantClass = $derived(
    variant === "accent" ? "ui-icon-button--accent" : variant === "danger" ? "ui-icon-button--danger" : ""
  );
</script>

<button
  {...rest}
  {type}
  class="ui-icon-button{variantClass ? ` ${variantClass}` : ''}{className ? ` ${className}` : ''}"
  aria-label={ariaLabel}
  {disabled}
><span class="ui-icon-button__content">{@render children?.()}</span></button>
