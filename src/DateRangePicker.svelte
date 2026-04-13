<script lang="ts">
  type DateRangeValue = { checkIn: string; checkOut: string };
  type Size = "md" | "lg";

  let {
    value = { checkIn: "", checkOut: "" },
    minDate = "",
    maxDate = "",
    disabled = false,
    error = "",
    size = "md",
    inline = false,
    class: className = "",
    label = "Даты проживания",
    placeholder = "Выберите даты",
    onChange
  } = $props<{
    value?: DateRangeValue;
    minDate?: string;
    maxDate?: string;
    disabled?: boolean;
    error?: string;
    size?: Size;
    inline?: boolean;
    class?: string;
    label?: string;
    placeholder?: string;
    onChange?: (next: DateRangeValue) => void;
  }>();

  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
  ];

  let isOpen = $state(false);
  let selectingEnd = $state(false);
  let touched = $state(false);
  let mode = $state<"dates" | "flexible">("dates");
  const now = new Date();
  let viewYear = $state(now.getFullYear());
  let viewMonth = $state(now.getMonth());
  let viewInitialized = $state(false);
  let rootEl: HTMLDivElement | null = null;
  const panelId = `date-range-panel-${Math.random().toString(36).slice(2, 9)}`;
  const errorId = `${panelId}-error`;

  const toYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const parseYmd = (ymd: string) => {
    if (!ymd) {
      return null;
    }
    const date = new Date(`${ymd}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const getMonthStart = (year: number, month: number) => new Date(year, month, 1);

  const shiftMonth = (year: number, month: number, delta: number) => {
    const next = new Date(year, month + delta, 1);
    return { year: next.getFullYear(), month: next.getMonth() };
  };

  const compareDate = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

  const isOutsideBounds = (ymd: string) => {
    if (!ymd) {
      return false;
    }
    if (minDate && ymd < minDate) {
      return true;
    }
    if (maxDate && ymd > maxDate) {
      return true;
    }
    return false;
  };

  const emitChange = (next: DateRangeValue) => {
    value = next;
    onChange?.(next);
  };

  const ensureViewMonth = () => {
    const current = parseYmd(value.checkIn) ?? new Date();
    viewYear = current.getFullYear();
    viewMonth = current.getMonth();
  };

  $effect(() => {
    if (viewInitialized) {
      return;
    }
    ensureViewMonth();
    viewInitialized = true;
  });

  $effect(() => {
    if (inline) {
      return;
    }
    const onWindowPointerDown = (event: PointerEvent) => {
      if (!isOpen || !rootEl) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!rootEl.contains(target)) {
        closePanel();
      }
    };

    window.addEventListener("pointerdown", onWindowPointerDown);
    return () => {
      window.removeEventListener("pointerdown", onWindowPointerDown);
    };
  });

  const openPanel = () => {
    if (inline) {
      return;
    }
    if (disabled) {
      return;
    }
    isOpen = true;
    ensureViewMonth();
  };

  const closePanel = () => {
    if (inline) {
      return;
    }
    isOpen = false;
    selectingEnd = false;
  };

  const togglePanel = () => {
    if (isOpen) {
      closePanel();
      return;
    }
    openPanel();
  };

  const clearRange = () => {
    touched = true;
    emitChange({ checkIn: "", checkOut: "" });
    selectingEnd = false;
  };

  const selectDay = (ymd: string) => {
    if (disabled || isOutsideBounds(ymd)) {
      return;
    }
    touched = true;

    if (!value.checkIn || (value.checkIn && value.checkOut) || !selectingEnd) {
      emitChange({ checkIn: ymd, checkOut: "" });
      selectingEnd = true;
      return;
    }

    if (compareDate(ymd, value.checkIn) < 0) {
      emitChange({ checkIn: ymd, checkOut: value.checkIn });
      selectingEnd = false;
      return;
    }

    emitChange({ checkIn: value.checkIn, checkOut: ymd });
    selectingEnd = false;
  };

  const goPrevMonth = () => {
    const prev = shiftMonth(viewYear, viewMonth, -1);
    viewYear = prev.year;
    viewMonth = prev.month;
  };

  const goNextMonth = () => {
    const next = shiftMonth(viewYear, viewMonth, 1);
    viewYear = next.year;
    viewMonth = next.month;
  };

  const getCalendarDays = (year: number, month: number) => {
    const start = getMonthStart(year, month);
    const firstWeekday = (start.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: Array<{ ymd: string; day: number; inMonth: boolean }> = [];

    for (let i = firstWeekday - 1; i >= 0; i -= 1) {
      const d = prevMonthDays - i;
      const date = new Date(year, month - 1, d);
      days.push({ ymd: toYmd(date), day: d, inMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(year, month, d);
      days.push({ ymd: toYmd(date), day: d, inMonth: true });
    }

    const rest = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= rest; d += 1) {
      const date = new Date(year, month + 1, d);
      days.push({ ymd: toYmd(date), day: d, inMonth: false });
    }

    return days;
  };

  const getLabel = (ymd: string) => {
    const date = parseYmd(ymd);
    if (!date) {
      return "";
    }
    return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  };

  const rangeText = $derived.by(() => {
    if (value.checkIn && value.checkOut) {
      return `${getLabel(value.checkIn)} - ${getLabel(value.checkOut)}`;
    }
    if (value.checkIn) {
      return `${getLabel(value.checkIn)} - ...`;
    }
    return placeholder;
  });

  const days = $derived(getCalendarDays(viewYear, viewMonth));
  const nextView = $derived(shiftMonth(viewYear, viewMonth, 1));
  const daysNext = $derived(getCalendarDays(nextView.year, nextView.month));
  const hasError = $derived(Boolean(error) && touched);

  const isActiveDate = (ymd: string) => ymd === value.checkIn || ymd === value.checkOut;
  const isBetween = (ymd: string) => {
    if (!value.checkIn || !value.checkOut) {
      return false;
    }
    return compareDate(ymd, value.checkIn) > 0 && compareDate(ymd, value.checkOut) < 0;
  };

  const onTriggerKeydown = (event: KeyboardEvent) => {
    if (disabled) {
      return;
    }
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openPanel();
    }
    if (event.key === "Escape") {
      closePanel();
    }
  };

  const onPanelKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
    }
  };

  const hasStartOnly = $derived(Boolean(value.checkIn) && !value.checkOut);
  const applyFlexible = (daysToAdd: number) => {
    if (!value.checkIn) {
      return;
    }
    const start = parseYmd(value.checkIn);
    if (!start) {
      return;
    }
    const end = new Date(start);
    end.setDate(end.getDate() + daysToAdd);
    emitChange({ checkIn: value.checkIn, checkOut: toYmd(end) });
    selectingEnd = false;
  };
</script>

<div
  class={`date-range-picker date-range-picker--${size} ${className}`}
  data-disabled={disabled}
  data-error={hasError}
  data-inline={inline}
  bind:this={rootEl}
>
  {#if !inline}
    <label class="date-range-picker__label">{label}</label>
  {/if}

  {#if !inline}
    <button
      type="button"
      class="date-range-picker__trigger ui-input"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={panelId}
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      onclick={togglePanel}
      onkeydown={onTriggerKeydown}
      disabled={disabled}
    >
      <span class:placeholder={!value.checkIn}>{rangeText}</span>
    </button>
  {/if}

  {#if inline || isOpen}
    <div class="date-range-picker__panel ui-card" role="dialog" id={panelId} aria-label="Календарь выбора дат" tabindex="0" onkeydown={onPanelKeydown}>
      {#if inline}
        <div class="date-range-picker__mode">
          <button type="button" class="mode-btn" class:active={mode === "dates"} onclick={() => (mode = "dates")}>Dates</button>
          <button type="button" class="mode-btn" class:active={mode === "flexible"} onclick={() => (mode = "flexible")}>Flexible</button>
        </div>
      {/if}

      <div class="date-range-picker__header">
        <button type="button" class="date-range-picker__nav" onclick={goPrevMonth} aria-label="Предыдущий месяц">‹</button>
        {#if inline}
          <div class="date-range-picker__months-head">
            <strong>{monthNames[viewMonth]} {viewYear}</strong>
            <strong>{monthNames[nextView.month]} {nextView.year}</strong>
          </div>
        {:else}
          <strong>{monthNames[viewMonth]} {viewYear}</strong>
        {/if}
        <button type="button" class="date-range-picker__nav" onclick={goNextMonth} aria-label="Следующий месяц">›</button>
      </div>

      {#if inline}
        <div class="date-range-picker__months">
          <div>
            <div class="date-range-picker__weekdays">
              {#each weekdays as wd}
                <span>{wd}</span>
              {/each}
            </div>
            <div class="date-range-picker__grid">
              {#each days as day}
                <button
                  type="button"
                  class="date-range-picker__day"
                  class:muted={!day.inMonth}
                  class:active={isActiveDate(day.ymd)}
                  class:inrange={isBetween(day.ymd)}
                  disabled={isOutsideBounds(day.ymd)}
                  aria-pressed={isActiveDate(day.ymd)}
                  onclick={() => selectDay(day.ymd)}
                >
                  {day.day}
                </button>
              {/each}
            </div>
          </div>
          <div>
            <div class="date-range-picker__weekdays">
              {#each weekdays as wd}
                <span>{wd}</span>
              {/each}
            </div>
            <div class="date-range-picker__grid">
              {#each daysNext as day}
                <button
                  type="button"
                  class="date-range-picker__day"
                  class:muted={!day.inMonth}
                  class:active={isActiveDate(day.ymd)}
                  class:inrange={isBetween(day.ymd)}
                  disabled={isOutsideBounds(day.ymd)}
                  aria-pressed={isActiveDate(day.ymd)}
                  onclick={() => selectDay(day.ymd)}
                >
                  {day.day}
                </button>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <div class="date-range-picker__weekdays">
          {#each weekdays as wd}
            <span>{wd}</span>
          {/each}
        </div>

        <div class="date-range-picker__grid">
          {#each days as day}
            <button
              type="button"
              class="date-range-picker__day"
              class:muted={!day.inMonth}
              class:active={isActiveDate(day.ymd)}
              class:inrange={isBetween(day.ymd)}
              disabled={isOutsideBounds(day.ymd)}
              aria-pressed={isActiveDate(day.ymd)}
              onclick={() => selectDay(day.ymd)}
            >
              {day.day}
            </button>
          {/each}
        </div>
      {/if}

      {#if inline}
        <div class="date-range-picker__chips">
          <button type="button" class="chip" class:active={mode === "dates"} onclick={() => (mode = "dates")}>Exact dates</button>
          <button type="button" class="chip" onclick={() => applyFlexible(1)} disabled={!hasStartOnly && !value.checkIn}>± 1 day</button>
          <button type="button" class="chip" onclick={() => applyFlexible(2)} disabled={!hasStartOnly && !value.checkIn}>± 2 days</button>
          <button type="button" class="chip" onclick={() => applyFlexible(3)} disabled={!hasStartOnly && !value.checkIn}>± 3 days</button>
          <button type="button" class="chip" onclick={() => applyFlexible(7)} disabled={!hasStartOnly && !value.checkIn}>± 7 days</button>
          <button type="button" class="chip" onclick={() => applyFlexible(14)} disabled={!hasStartOnly && !value.checkIn}>± 14 days</button>
        </div>
      {:else}
        <div class="date-range-picker__actions">
          <button type="button" class="ui-button ui-button--ghost" onclick={clearRange}>Очистить</button>
          <button type="button" class="ui-button ui-button--primary" onclick={closePanel}>Готово</button>
        </div>
      {/if}
    </div>
  {/if}

  {#if hasError}
    <p class="date-range-picker__error" id={errorId}>{error}</p>
  {/if}
</div>

<style>
  .date-range-picker {
    display: grid;
    gap: var(--ui-space-2);
    position: relative;
  }

  .date-range-picker__label {
    font-size: 0.9rem;
    color: var(--ui-text-muted);
  }

  .date-range-picker__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    font: inherit;
    cursor: pointer;
  }

  .date-range-picker__trigger .placeholder {
    color: var(--ui-text-muted);
  }

  .date-range-picker__panel {
    margin-top: var(--ui-space-2);
    padding: var(--ui-space-3);
    border-radius: var(--ui-radius-md);
    display: grid;
    gap: var(--ui-space-3);
    width: min(100%, 360px);
    background: var(--ui-surface-strong);
    z-index: 10;
  }

  .date-range-picker[data-inline="true"] .date-range-picker__panel {
    position: static;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 0;
    z-index: 1;
    background: var(--ui-surface-strong);
    border: 0;
    border-radius: 0;
    color: var(--ui-text);
    box-shadow: none;
    padding: var(--ui-space-6) var(--ui-space-5) var(--ui-space-5);
    gap: var(--ui-space-5);
  }
  .date-range-picker__mode {
    margin: 0 auto var(--ui-space-2);
    display: inline-grid;
    grid-auto-flow: column;
    gap: 0.25rem;
    padding: 0.2rem;
    border-radius: 999px;
    background: var(--ui-surface);
  }
  .mode-btn {
    min-height: 40px;
    min-width: 120px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ui-text-muted);
    font-weight: 600;
  }
  .mode-btn.active {
    background: var(--ui-surface-strong);
    color: var(--ui-text);
    box-shadow: var(--ui-shadow-soft);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__label {
    color: var(--ui-text);
    font-size: 1rem;
    font-weight: 600;
    padding: var(--ui-space-3) var(--ui-space-4) 0;
    margin: 0;
  }

  .date-range-picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ui-space-4);
  }
  .date-range-picker__months-head {
    display: none;
  }

  .date-range-picker__nav {
    min-width: 44px;
    min-height: 44px;
    border-radius: 999px;
    border: 1px solid var(--ui-border);
    background: var(--ui-surface);
    color: var(--ui-text);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__nav {
    border: none;
    background: transparent;
    color: var(--ui-text-muted);
  }

  .date-range-picker__weekdays,
  .date-range-picker__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 4px;
  }
  .date-range-picker__months {
    display: grid;
    gap: var(--ui-space-5);
    grid-template-columns: 1fr;
  }

  .date-range-picker[data-inline="true"] .date-range-picker__grid {
    gap: 8px;
  }

  .date-range-picker__weekdays span {
    text-align: center;
    color: var(--ui-text-muted);
    font-size: 0.82rem;
  }

  .date-range-picker[data-inline="true"] .date-range-picker__weekdays span {
    color: var(--ui-text-muted);
    font-size: 0.85rem;
  }

  .date-range-picker__day {
    min-height: 44px;
    border-radius: 10px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--ui-text);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__day {
    color: var(--ui-text);
    border-radius: 999px;
  }

  .date-range-picker__day.muted {
    color: var(--ui-text-muted);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__day.muted {
    color: color-mix(in oklab, var(--ui-text-muted) 75%, transparent);
  }

  .date-range-picker__day.inrange {
    background: color-mix(in oklab, var(--ui-accent) 24%, var(--ui-surface-strong));
    color: var(--ui-text);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__day.inrange {
    background: color-mix(in oklab, var(--ui-accent) 18%, var(--ui-surface-strong));
    color: var(--ui-text);
  }

  .date-range-picker__day.active {
    background: var(--ui-accent);
    color: var(--text-inverse);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__day.active {
    background: var(--ui-accent);
    color: var(--text-inverse);
  }

  .date-range-picker__day:disabled {
    opacity: 0.35;
  }

  .date-range-picker__day:focus-visible,
  .date-range-picker__nav:focus-visible {
    outline: 2px solid rgba(47, 128, 255, 0.55);
    outline-offset: 2px;
  }

  .date-range-picker__actions {
    display: grid;
    gap: var(--ui-space-2);
    grid-template-columns: 1fr 1fr;
  }
  .date-range-picker__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: var(--ui-space-2);
  }
  .chip {
    min-height: 40px;
    padding: 0 0.9rem;
    border-radius: 999px;
    border: 1px solid var(--ui-border);
    background: var(--ui-surface-strong);
    color: var(--ui-text);
    font-weight: 500;
  }
  .chip.active {
    border-color: var(--ui-text);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__actions .ui-button--ghost {
    border-color: var(--ui-border);
    background: var(--ui-surface-strong);
    color: var(--ui-text);
  }

  .date-range-picker[data-inline="true"] .date-range-picker__actions .ui-button--primary {
    background: var(--ui-accent);
    color: var(--text-inverse);
  }

  .date-range-picker__error {
    color: var(--ui-danger);
    margin: 0;
    font-size: 0.85rem;
  }

  .date-range-picker[data-disabled="true"] {
    opacity: 0.65;
    pointer-events: none;
  }

  .date-range-picker[data-error="true"] .date-range-picker__trigger {
    border-color: var(--ui-danger);
  }

  .date-range-picker--lg .date-range-picker__trigger {
    min-height: 52px;
  }

  @media (min-width: 768px) {
    .date-range-picker__panel {
      position: absolute;
      top: 100%;
      left: 0;
    }

    .date-range-picker[data-inline="true"] .date-range-picker__panel {
      position: static;
    }
    .date-range-picker__months {
      grid-template-columns: 1fr 1fr;
      gap: var(--ui-space-6);
    }
    .date-range-picker__months-head {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      text-align: center;
      gap: var(--ui-space-6);
      margin: 0 44px;
    }
  }
</style>
