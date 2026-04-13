<script lang="ts">
  import type { Snippet } from "svelte";

  type Tone = "info" | "success" | "warning" | "error";

  let {
    tone = "info",
    role = "status",
    class: className = "",
    children
  } = $props<{
    tone?: Tone;
    role?: "status" | "alert";
    class?: string;
    children?: Snippet;
  }>();

  const toneClass = $derived(
    tone === "info"
      ? "ui-toast--info"
      : tone === "success"
        ? "ui-toast--success"
        : tone === "warning"
          ? "ui-toast--warning"
          : "ui-toast--error"
  );
</script>

<p class="ui-toast {toneClass}{className ? ` ${className}` : ''}" {role}>
  {@render children?.()}
</p>
