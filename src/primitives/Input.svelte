<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  let {
    value = $bindable(),
    size = "md",
    error = false,
    class: className = "",
    ...rest
  } = $props<
    Omit<HTMLInputAttributes, "size" | "class" | "value"> & {
      value?: HTMLInputAttributes["value"];
      size?: "md" | "lg";
      error?: boolean;
      class?: string;
    }
  >();

  const invalid = $derived(error === true || rest["aria-invalid"] === true);
</script>

<input
  {...rest}
  bind:value
  class="ui-input{size === 'lg' ? ' ui-input--lg' : ''}{invalid ? ' ui-input--error' : ''}{className ? ` ${className}` : ''}"
/>
