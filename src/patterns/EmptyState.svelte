<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    description = "",
    class: className = "",
    children
  } = $props<{
    title: string;
    description?: string;
    class?: string;
    children?: Snippet;
  }>();
</script>

<section class="ui-empty-state ui-card ui-card-pad ui-section{className ? ` ${className}` : ''}">
  <h2 class="ui-title">{title}</h2>
  {#if description}
    <p class="ui-empty-state__desc">{description}</p>
  {/if}
  {#if children}
    <div class="ui-empty-state__actions">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  .ui-empty-state__actions {
    margin-top: var(--ui-space-3);
  }
</style>
