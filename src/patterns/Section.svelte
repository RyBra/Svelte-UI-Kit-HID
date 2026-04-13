<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title = "",
    class: className = "",
    children
  } = $props<{
    title?: string;
    class?: string;
    children?: Snippet;
  }>();
</script>

<section class="ui-section-block{className ? ` ${className}` : ''}">
  {#if title}
    <h2 class="ui-section-block__title">{title}</h2>
  {/if}
  {@render children?.()}
</section>
