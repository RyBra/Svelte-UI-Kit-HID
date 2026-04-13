<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    glass = true,
    class: className = "",
    children,
    trailing
  } = $props<{
    glass?: boolean;
    class?: string;
    children?: Snippet;
    trailing?: Snippet;
  }>();
</script>

<div class="ui-topbar{className ? ` ${className}` : ''}{glass ? ' ui-glass' : ''}">
  <div class="ui-topbar__main">
    {@render children?.()}
  </div>
  {#if trailing}
    <div class="ui-topbar__trailing">
      {@render trailing()}
    </div>
  {/if}
</div>

<style>
  .ui-topbar {
    flex-wrap: wrap;
  }

  .ui-topbar__main,
  .ui-topbar__trailing {
    display: flex;
    align-items: center;
    gap: var(--ui-space-2);
  }

  .ui-topbar__main {
    flex: 1;
    min-width: 0;
  }
</style>
