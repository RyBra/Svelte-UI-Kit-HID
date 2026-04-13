<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    class: className = "",
    children,
    label = "Notifications"
  } = $props<{
    class?: string;
    children?: Snippet;
    /** Landmark label for assistive tech (stack is live). */
    label?: string;
  }>();
</script>

<div
  class="ui-toast-region{className ? ` ${className}` : ''}"
  role="region"
  aria-label={label}
>
  {#if children}
    {@render children()}
  {/if}
</div>
