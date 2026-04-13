<script lang="ts">
  type Variant = "base" | "elevated" | "glass";

  let {
    variant = "base",
    pad = false,
    tag = "article",
    class: className = "",
    children
  } = $props<{
    variant?: Variant;
    pad?: boolean;
    tag?: "article" | "div" | "section";
    class?: string;
    children?: import("svelte").Snippet;
  }>();

  const extra = $derived(
    variant === "elevated" ? " ui-card--elevated" : variant === "glass" ? " ui-card--glass" : ""
  );
</script>

<svelte:element
  this={tag}
  class="ui-card{extra}{pad ? ' ui-card-pad' : ''}{className ? ` ${className}` : ''}"
>
  {@render children?.()}
</svelte:element>
