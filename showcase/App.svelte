<script lang="ts">
  import AllComponentsShowcase from "../src/AllComponentsShowcase.svelte";
</script>

<AllComponentsShowcase story="overview" />

<style>
  :global(html, body) {
    margin: 0;
    min-height: 100%;
    background: var(--ui-bg);
    color: var(--ui-text);
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>
