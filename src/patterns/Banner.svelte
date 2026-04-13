<script lang="ts">
  import type { Snippet } from "svelte";

  type Tone = "neutral" | "info";

  let {
    tone = "neutral",
    sticky = false,
    class: className = "",
    children,
    actions
  } = $props<{
    tone?: Tone;
    sticky?: boolean;
    class?: string;
    children?: Snippet;
    actions?: Snippet;
  }>();
</script>

<aside
  class="ui-banner{tone === 'info' ? ' ui-banner--info' : ''}{sticky ? ' ui-banner--sticky' : ''}{className ? ` ${className}` : ''}"
>
  <div class="ui-banner__body">
    {@render children?.()}
  </div>
  {#if actions}
    <div class="ui-banner__actions">
      {@render actions()}
    </div>
  {/if}
</aside>

<style>
  .ui-banner__actions {
    display: flex;
    gap: var(--ui-space-2);
    flex-shrink: 0;
  }
</style>
