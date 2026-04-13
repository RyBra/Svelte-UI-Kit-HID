<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title = "",
    class: className = "",
    children,
    footer
  } = $props<{
    title?: string;
    class?: string;
    children?: Snippet;
    footer?: Snippet;
  }>();
</script>

<div class="ui-inline-sheet ui-card{className ? ` ${className}` : ''}">
  {#if title}
    <strong>{title}</strong>
  {/if}
  {@render children?.()}
  {#if footer}
    <div class="ui-sheet-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .ui-sheet-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ui-space-2);
  }

  @media (min-width: 700px) {
    .ui-sheet-footer {
      grid-template-columns: repeat(2, minmax(0, auto));
      justify-content: flex-end;
    }
  }
</style>
