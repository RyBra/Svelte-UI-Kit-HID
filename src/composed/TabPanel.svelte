<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    tabId,
    activeId,
    class: className = "",
    children
  } = $props<{
    tabId: string;
    activeId: string;
    class?: string;
    children?: Snippet;
  }>();

  const hidden = $derived(activeId !== tabId);
</script>

<div
  role="tabpanel"
  id={`panel-${tabId}`}
  aria-labelledby={`tab-${tabId}`}
  class="ui-tab-panel{className ? ` ${className}` : ''}"
  {hidden}
>
  {@render children?.()}
</div>
