<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";

  let {
    error = false,
    class: className = "",
    children,
    ...rest
  } = $props<
    HTMLSelectAttributes & {
      error?: boolean;
      class?: string;
      children?: import("svelte").Snippet;
    }
  >();
</script>

<select
  {...rest}
  class="ui-input{error || rest["aria-invalid"] === true ? ' ui-input--error' : ''}{className ? ` ${className}` : ''}"
>
  {@render children?.()}
</select>
