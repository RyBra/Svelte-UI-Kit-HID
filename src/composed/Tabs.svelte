<script lang="ts">
  export type TabItem = { id: string; label: string; disabled?: boolean };

  let {
    items,
    value,
    onTabChange,
    ariaLabel = "Вкладки",
    class: className = ""
  } = $props<{
    items: TabItem[];
    value: string;
    onTabChange: (id: string) => void;
    ariaLabel?: string;
    class?: string;
  }>();

  const columns = $derived(items.length > 0 ? items.length : 1);
  const activeIndex = $derived.by(() => {
    const index = items.findIndex((item) => item.id === value);
    return index >= 0 ? index : 0;
  });
  let tabRefs: Array<HTMLButtonElement | null> = [];

  const getEnabledIndex = (start: number, direction: 1 | -1) => {
    if (items.length === 0) {
      return -1;
    }
    let index = start;
    for (let steps = 0; steps < items.length; steps += 1) {
      index = (index + direction + items.length) % items.length;
      if (!items[index]?.disabled) {
        return index;
      }
    }
    return -1;
  };

  const onTabKeydown = (event: KeyboardEvent, currentIndex: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    event.preventDefault();

    if (event.key === "Home") {
      const first = items.findIndex((item) => !item.disabled);
      if (first >= 0) {
        onTabChange(items[first].id);
        tabRefs[first]?.focus();
      }
      return;
    }

    if (event.key === "End") {
      for (let i = items.length - 1; i >= 0; i -= 1) {
        if (!items[i]?.disabled) {
          onTabChange(items[i].id);
          tabRefs[i]?.focus();
          break;
        }
      }
      return;
    }

    const nextIndex = getEnabledIndex(currentIndex, event.key === "ArrowRight" ? 1 : -1);
    if (nextIndex >= 0) {
      onTabChange(items[nextIndex].id);
      tabRefs[nextIndex]?.focus();
    }
  };
</script>

<div
  class="ui-segmented ui-tabs{className ? ` ${className}` : ''}"
  style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr)); --seg-count: ${columns}; --seg-index: ${activeIndex}; --seg-gap: 6px; --seg-pad: 6px;`}
  role="tablist"
  aria-label={ariaLabel}
  aria-orientation="horizontal"
>
  <span class="ui-segmented__indicator" aria-hidden="true"></span>
  {#each items as item, index (item.id)}
    <button
      type="button"
      class="ui-segmented__option"
      role="tab"
      id={`tab-${item.id}`}
      aria-selected={value === item.id}
      aria-controls={`panel-${item.id}`}
      tabindex={value === item.id ? 0 : -1}
      disabled={item.disabled}
      class:active={value === item.id}
      onclick={() => onTabChange(item.id)}
      onkeydown={(event) => onTabKeydown(event, index)}
      bind:this={tabRefs[index]}
    >
      {item.label}
    </button>
  {/each}
</div>
