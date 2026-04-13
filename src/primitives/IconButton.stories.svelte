<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import IconButton from "./IconButton.svelte";

  const { Story } = defineMeta({
    title: "Primitives/IconButton",
    component: IconButton
  });
</script>

<Story name="Default">
  <IconButton aria-label="Open settings"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></g></svg></IconButton>
</Story>

<Story name="Variants">
  <div style="display:flex; gap:0.5rem;">
    <IconButton variant="neutral" aria-label="Neutral"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2" /></svg></IconButton>
    <IconButton variant="accent" aria-label="Accent"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></IconButton>
    <IconButton variant="danger" aria-label="Danger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><circle cx="12" cy="17" r="1.5" fill="currentColor" /></svg></IconButton>
  </div>
</Story>
