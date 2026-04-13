<script lang="ts">
  let {
    lowSrc,
    highSrc,
    alt,
    fallbackSrc,
    class: className = "",
    width,
    height,
    loading = "lazy",
    decoding = "async",
    blurLow = true,
    fillParent = false
  } = $props<{
    lowSrc: string;
    highSrc: string;
    alt: string;
    fallbackSrc?: string;
    class?: string;
    width?: number | string;
    height?: number | string;
    loading?: "lazy" | "eager";
    decoding?: "sync" | "async" | "auto";
    blurLow?: boolean;
    /** Растянуть на весь родитель (position:absolute + inset 0), для каруселей и превью с фикс. рамкой */
    fillParent?: boolean;
  }>();

  const fillClass = $derived(fillParent ? " ui-progressive-image--fill" : "");

  let highLoaded = $state(false);
  let highErrored = $state(false);
  let highImgEl = $state<HTMLImageElement | null>(null);

  const resolvedHighSrc = $derived(highErrored && fallbackSrc ? fallbackSrc : highSrc);
  const singleSource = $derived(lowSrc === resolvedHighSrc);

  function applyHighAlreadyDecoded() {
    const el = highImgEl;
    if (el?.complete && el.naturalWidth > 0) {
      highLoaded = true;
    }
  }

  $effect(() => {
    void resolvedHighSrc;
    queueMicrotask(() => applyHighAlreadyDecoded());
  });

  function handleHighLoad() {
    highLoaded = true;
  }

  function handleHighError() {
    if (!highErrored && fallbackSrc && fallbackSrc !== highSrc) {
      highErrored = true;
      return;
    }
  }
</script>

{#if singleSource}
  <img
    class={`ui-progressive-image__img${fillClass}${className ? ` ${className}` : ""}`}
    src={resolvedHighSrc}
    {alt}
    {width}
    {height}
    {loading}
    {decoding}
    referrerpolicy="no-referrer"
  />
{:else}
  <div class={`ui-progressive-image${fillClass}${className ? ` ${className}` : ""}`}>
    <img
      class={`ui-progressive-image__img ui-progressive-image__img--low${blurLow ? " is-blurred" : ""}${
        highLoaded ? " is-faded" : ""
      }`}
      src={lowSrc}
      alt=""
      aria-hidden="true"
      {width}
      {height}
      loading="eager"
      decoding="async"
      referrerpolicy="no-referrer"
    />
    <img
      bind:this={highImgEl}
      class={`ui-progressive-image__img ui-progressive-image__img--high${highLoaded ? " is-loaded" : ""}`}
      src={resolvedHighSrc}
      {alt}
      {width}
      {height}
      {loading}
      {decoding}
      referrerpolicy="no-referrer"
      onload={handleHighLoad}
      onerror={handleHighError}
    />
  </div>
{/if}

<style>
  .ui-progressive-image {
    position: relative;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: var(--ui-surface, #f4f5f7);
  }

  .ui-progressive-image.ui-progressive-image--fill {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  img.ui-progressive-image__img.ui-progressive-image--fill {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .ui-progressive-image__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Оба слоя в абсолютной рамке: иначе low в потоке даёт 0×0 в части flex/scroll контекстов (тёмный фон --ui-surface). */
  .ui-progressive-image__img--low {
    position: absolute;
    inset: 0;
    z-index: 0;
    transition: opacity 220ms ease-out;
  }

  .ui-progressive-image__img--low.is-blurred {
    filter: blur(10px);
    transform: scale(1.03);
  }

  .ui-progressive-image__img--low.is-faded {
    opacity: 0;
  }

  .ui-progressive-image__img--high {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0;
    transition: opacity 240ms ease-out;
  }

  .ui-progressive-image__img--high.is-loaded {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .ui-progressive-image__img--low,
    .ui-progressive-image__img--high {
      transition: none;
    }

    /* Без анимации не оставляем high невидимым, если onload уже прошёл до гидрации */
    .ui-progressive-image__img--high {
      opacity: 1;
    }
  }
</style>
