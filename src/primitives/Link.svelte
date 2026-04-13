<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  type Variant = "inline" | "nav";

  let {
    variant = "inline",
    class: className = "",
    children,
    ...rest
  } = $props<
    HTMLAnchorAttributes & {
      variant?: Variant;
      class?: string;
      children?: import("svelte").Snippet;
    }
  >();
</script>

<a
  {...rest}
  class="ui-link{variant === 'nav' ? ' ui-link--nav' : ''}{className ? ` ${className}` : ''}"
>
  {@render children?.()}
</a>
