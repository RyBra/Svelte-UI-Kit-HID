<script lang="ts">
  import { onMount, tick } from "svelte";
  import IconButton from "../primitives/IconButton.svelte";
  import ProgressiveImage from "../primitives/ProgressiveImage.svelte";

  type Slide = { lowSrc: string; highSrc: string; alt: string };

  let {
    slides,
    infinite = false,
    ariaLabel = "Галерея изображений",
    imageClass = "",
    class: className = ""
  } = $props<{
    slides: Slide[];
    /** Зацикливание: с последнего — на первый, с первого — на последний (клоны для свайпа). */
    infinite?: boolean;
    ariaLabel?: string;
    /** e.g. ui-property-card__image — applied to each ProgressiveImage */
    imageClass?: string;
    class?: string;
  }>();

  let trackEl = $state<HTMLDivElement | null>(null);
  let activeIndex = $state(0);
  let liveMessage = $state("");
  let reduceMotion = $state(false);
  let scrollRaf = 0;
  /** Пропускаем синхронизацию при программном scrollTo (старт, прыжок с клона) */
  let isProgrammaticScroll = false;

  const useInfinite = $derived(infinite && slides.length > 1);
  const trackSlides = $derived(
    useInfinite ? [slides[slides.length - 1]!, ...slides, slides[0]!] : slides
  );
  const multi = $derived(slides.length > 1);
  const slideIndices = $derived([...slides.keys()]);

  const imageClasses = $derived(
    imageClass.trim()
      ? `ui-progressive-image-slider__image ${imageClass.trim()}`
      : "ui-progressive-image-slider__image"
  );

  let scrollLayoutGen = 0;
  /** Если первый layout пришёл с clientWidth === 0, дорезаем позицию при resize */
  let infiniteInitPending = false;
  /** Последняя ширина трека в ResizeObserver — не снапать скролл при изменении только высоты (загрузка img) */
  let lastObservedTrackWidth = 0;

  function releaseProgrammaticScroll() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isProgrammaticScroll = false;
      });
    });
  }

  function applyTrackScrollPosition(gen: number) {
    const el = trackEl;
    if (!el || gen !== scrollLayoutGen || slides.length === 0) {
      return;
    }
    const w = el.clientWidth;
    const uiLoop = infinite && slides.length > 1;
    if (w <= 0) {
      if (uiLoop) {
        infiniteInitPending = true;
      }
      return;
    }
    infiniteInitPending = false;
    if (uiLoop) {
      activeIndex = 0;
      isProgrammaticScroll = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const t = trackEl;
          if (!t || gen !== scrollLayoutGen) {
            releaseProgrammaticScroll();
            return;
          }
          const w2 = t.clientWidth;
          if (w2 <= 0) {
            releaseProgrammaticScroll();
            return;
          }
          t.scrollLeft = w2;
          releaseProgrammaticScroll();
        });
      });
      return;
    }

    isProgrammaticScroll = true;
    el.scrollLeft = 0;
    activeIndex = 0;
    releaseProgrammaticScroll();
  }

  $effect(() => {
    void `${slides.map((s) => `${s.highSrc}|${s.lowSrc}`).join("##")}`;
    void infinite;
    const gen = ++scrollLayoutGen;
    void tick().then(() => applyTrackScrollPosition(gen));
  });

  onMount(() => {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ro: ResizeObserver | null = null;
    let cancelled = false;

    void tick().then(() => {
      if (cancelled) {
        return;
      }
      const el = trackEl;
      if (!el) {
        return;
      }

      ro = new ResizeObserver(() => {
        const t = trackEl;
        if (!t) {
          return;
        }
        const w = t.clientWidth;
        if (w <= 0) {
          lastObservedTrackWidth = 0;
          return;
        }
        const slideCount = t.querySelectorAll(":scope > .ui-progressive-image-slider__slide").length;
        if (slideCount === 0) {
          return;
        }
        const root = t.closest(".ui-progressive-image-slider");
        const infiniteMode = root?.classList.contains("ui-progressive-image-slider--infinite");
        if (infiniteInitPending && infiniteMode && slideCount > 2 && Math.round(t.scrollLeft / w) === 0) {
          infiniteInitPending = false;
          isProgrammaticScroll = true;
          t.scrollLeft = w;
          lastObservedTrackWidth = w;
          releaseProgrammaticScroll();
          return;
        }
        if (w === lastObservedTrackWidth) {
          return;
        }
        lastObservedTrackWidth = w;

        isProgrammaticScroll = true;
        if (infiniteMode && slideCount > 2) {
          const trackIndex = Math.min(slideCount - 1, Math.max(1, activeIndex + 1));
          t.scrollLeft = trackIndex * w;
        } else {
          const ei = Math.min(slideCount - 1, Math.max(0, activeIndex));
          t.scrollLeft = ei * w;
        }
        releaseProgrammaticScroll();
      });

      ro.observe(el);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
    };
  });

  function syncIndexFromScroll() {
    if (isProgrammaticScroll) {
      return;
    }
    const el = trackEl;
    if (!el || slides.length === 0) {
      return;
    }
    const w = el.clientWidth;
    if (w <= 0) {
      return;
    }

    const n = slides.length;
    let ei = Math.round(el.scrollLeft / w);

    if (useInfinite) {
      if (ei === 0) {
        isProgrammaticScroll = true;
        el.scrollTo({ left: n * w, behavior: "auto" });
        activeIndex = n - 1;
        liveMessage = `Слайд ${n} из ${n}`;
        releaseProgrammaticScroll();
        return;
      }
      if (ei === n + 1) {
        isProgrammaticScroll = true;
        el.scrollTo({ left: w, behavior: "auto" });
        activeIndex = 0;
        liveMessage = `Слайд 1 из ${n}`;
        releaseProgrammaticScroll();
        return;
      }
      const ri = ei - 1;
      if (ri >= 0 && ri < n && ri !== activeIndex) {
        activeIndex = ri;
        liveMessage = `Слайд ${ri + 1} из ${n}`;
      }
      return;
    }

    const idx = Math.min(n - 1, Math.max(0, ei));
    if (idx !== activeIndex) {
      activeIndex = idx;
      liveMessage = `Слайд ${idx + 1} из ${n}`;
    }
  }

  function onScroll() {
    if (isProgrammaticScroll) {
      return;
    }
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => syncIndexFromScroll());
  }

  function onScrollEnd() {
    if (isProgrammaticScroll) {
      return;
    }
    cancelAnimationFrame(scrollRaf);
    syncIndexFromScroll();
  }

  function scrollByDir(dir: -1 | 1, e: Event) {
    e.stopPropagation();
    const el = trackEl;
    if (!el || slides.length === 0) {
      return;
    }
    const w = el.clientWidth;
    const n = slides.length;

    if (!useInfinite) {
      el.scrollBy({ left: dir * w, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }

    let ei = Math.round(el.scrollLeft / w);
    let ri: number;
    if (ei === 0) {
      ri = n - 1;
    } else if (ei === n + 1) {
      ri = 0;
    } else {
      ri = ei - 1;
    }
    const nextRi = (ri + dir + n) % n;
    el.scrollTo({ left: (nextRi + 1) * w, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function goTo(i: number, e: Event) {
    e.stopPropagation();
    const el = trackEl;
    if (!el) {
      return;
    }
    const w = el.clientWidth;
    if (useInfinite) {
      el.scrollTo({ left: (i + 1) * w, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      el.scrollTo({ left: i * w, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  const prevDisabled = $derived(!infinite && activeIndex === 0);
  const nextDisabled = $derived(!infinite && activeIndex === slides.length - 1);
</script>

{#if slides.length > 0}
  <div
    class="ui-progressive-image-slider{className ? ` ${className}` : ''}"
    class:ui-progressive-image-slider--infinite={useInfinite}
    role="region"
    aria-roledescription="карусель"
    aria-label={ariaLabel}
  >
    <span class="ui-progressive-image-slider__sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</span>
    <div
      class="ui-progressive-image-slider__track"
      bind:this={trackEl}
      onscroll={onScroll}
      onscrollend={onScrollEnd}
    >
      {#each trackSlides as slide, ei (`${ei}-${slide.highSrc}-${slide.alt}`)}
        <div
          class="ui-progressive-image-slider__slide"
          role="group"
          aria-roledescription="слайд"
          aria-label={useInfinite && (ei === 0 || ei === slides.length + 1)
            ? undefined
            : `${(useInfinite ? ei - 1 : ei) + 1} из ${slides.length}`}
          aria-hidden={useInfinite && (ei === 0 || ei === slides.length + 1)}
        >
          <div class="ui-progressive-image-slider__frame">
            <ProgressiveImage
              fillParent
              class={imageClasses}
              lowSrc={slide.lowSrc}
              highSrc={slide.highSrc}
              alt={slide.alt}
              loading="eager"
            />
          </div>
        </div>
      {/each}
    </div>

    {#if multi}
      <div class="ui-progressive-image-slider__nav">
        <IconButton
          variant="neutral"
          aria-label="Предыдущее фото"
          class="ui-progressive-image-slider__nav-btn"
          disabled={prevDisabled}
          onclick={(e) => scrollByDir(-1, e)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </IconButton>
        <IconButton
          variant="neutral"
          aria-label="Следующее фото"
          class="ui-progressive-image-slider__nav-btn"
          disabled={nextDisabled}
          onclick={(e) => scrollByDir(1, e)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </IconButton>
      </div>

      <div class="ui-progressive-image-slider__dots">
        {#each slideIndices as i (i)}
          <button
            type="button"
            class="ui-progressive-image-slider__dot"
            class:ui-progressive-image-slider__dot--active={i === activeIndex}
            aria-label={`Перейти к слайду ${i + 1}`}
            aria-current={i === activeIndex ? "true" : undefined}
            onclick={(e) => goTo(i, e)}
          ></button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .ui-progressive-image-slider__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
