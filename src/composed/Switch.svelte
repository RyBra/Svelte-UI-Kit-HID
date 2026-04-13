<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    checked,
    disabled = false,
    onCheckedChange,
    children
  } = $props<{
    checked: boolean;
    disabled?: boolean;
    onCheckedChange: (next: boolean) => void;
    children?: Snippet;
  }>();

  function toggle() {
    if (disabled) return;
    onCheckedChange(!checked);
  }

  function onKeydown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onCheckedChange(!checked);
    }
  }
</script>

<button
  type="button"
  class="ui-switch"
  role="switch"
  aria-checked={checked}
  data-disabled={disabled}
  {disabled}
  onclick={toggle}
  onkeydown={onKeydown}
>
  {#if children}
    <span class="ui-switch__label">
      {@render children()}
    </span>
  {/if}
  <span class="ui-switch-track" data-on={checked}>
    <span class="ui-switch-thumb"></span>
  </span>
</button>
