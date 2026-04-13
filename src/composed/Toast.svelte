<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  type Tone = "info" | "success" | "warning" | "error";

  let {
    tone = "info",
    role = "status",
    class: className = "",
    title,
    dismissLabel = "Закрыть уведомление",
    onDismiss,
    children
  } = $props<{
    tone?: Tone;
    role?: "status" | "alert";
    class?: string;
    /** Optional headline (macOS-style banner title). */
    title?: string;
    /** Accessible label for the dismiss control. */
    dismissLabel?: string;
    /** When set, shows a close control that calls this handler. */
    onDismiss?: () => void;
    children?: Snippet;
  }>();

  let reduceMotion = $state(false);

  onMount(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion = mq.matches;
    const onChange = () => {
      reduceMotion = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  });

  const inFly = $derived(
    reduceMotion
      ? { duration: 0, x: 0, y: 0, opacity: 1, easing: cubicOut }
      : { duration: 280, x: 26, y: -8, opacity: 0, easing: cubicOut }
  );

  const outFly = $derived(
    reduceMotion
      ? { duration: 0, x: 0, y: 0, opacity: 0, easing: cubicOut }
      : { duration: 220, x: 20, y: -6, opacity: 0, easing: cubicOut }
  );

  const toneClass = $derived(
    tone === "info"
      ? "ui-toast--info"
      : tone === "success"
        ? "ui-toast--success"
        : tone === "warning"
          ? "ui-toast--warning"
          : "ui-toast--error"
  );

  function onCloseClick(e: MouseEvent) {
    e.stopPropagation();
    onDismiss?.();
  }
</script>

<div
  class="ui-toast {toneClass}{className ? ` ${className}` : ''}"
  {role}
  in:fly={inFly}
  out:fly={outFly}
>
  <div class="ui-toast__row">
    <div class="ui-toast__main">
      {#if title}
        <strong class="ui-toast__title">{title}</strong>
      {/if}
      {#if children}
        <div class="ui-toast__body">
          {@render children()}
        </div>
      {/if}
    </div>
    {#if onDismiss}
      <button
        type="button"
        class="ui-toast__close"
        aria-label={dismissLabel}
        onclick={onCloseClick}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            d="M3.5 3.5l7 7M10.5 3.5l-7 7"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>
