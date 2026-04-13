<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    type = "button",
    class: className = "",
    children,
    ...rest
  } = $props<
    HTMLButtonAttributes & {
      class?: string;
      children?: import("svelte").Snippet;
    }
  >();
</script>

<button {...rest} {type} class="ui-chip{className ? ` ${className}` : ''}">
  {@render children?.()}
</button>
