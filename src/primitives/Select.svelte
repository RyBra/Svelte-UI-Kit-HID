<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { HTMLSelectAttributes } from "svelte/elements";

  export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
    keywords?: string[];
  };

  export type SelectGroup = {
    label: string;
    options: SelectOption[];
  };

  type FlatOption = {
    uid: string;
    groupLabel?: string;
    option: SelectOption;
  };

  let {
    value = $bindable<string | string[]>(""),
    options = [],
    groups = [],
    searchable = false,
    multiple = false,
    placeholder = "Выберите вариант",
    emptyText = "Ничего не найдено",
    error = false,
    disabled = false,
    name,
    required = false,
    id,
    class: className = "",
    "aria-label": ariaLabel,
    ...rest
  } = $props<
    Omit<HTMLSelectAttributes, "value" | "multiple" | "size" | "class"> & {
      value?: string | string[];
      options?: SelectOption[];
      groups?: SelectGroup[];
      searchable?: boolean;
      multiple?: boolean;
      placeholder?: string;
      emptyText?: string;
      error?: boolean;
      class?: string;
    }
  >();

  const baseId = `sel-${Math.random().toString(36).slice(2, 9)}`;
  const fieldId = $derived(id || `${baseId}-trigger`);
  const listboxId = $derived(`${fieldId}-listbox`);
  const searchboxId = $derived(`${fieldId}-search`);

  let rootEl = $state<HTMLDivElement | null>(null);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let searchEl = $state<HTMLInputElement | null>(null);
  let isOpen = $state(false);
  let searchQuery = $state("");
  let activeIndex = $state(-1);
  let typeaheadBuffer = $state("");
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
  let optionRefs = $state<Record<string, HTMLButtonElement | null>>({});
  const cloneCurrentValue = (input: string | string[]) =>
    (Array.isArray(input) ? [...input] : input) as string | string[];
  const initialValue = cloneCurrentValue(value);

  const invalid = $derived(
    error === true || rest["aria-invalid"] === true || rest["aria-invalid"] === "true"
  );

  const normalizedGroups = $derived.by(() => {
    const result: Array<{ label?: string; options: SelectOption[] }> = [];

    if (options.length > 0) {
      result.push({ options });
    }
    for (const group of groups) {
      result.push({
        label: group.label,
        options: group.options
      });
    }
    return result;
  });

  const filteredGroups = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!searchable || query.length === 0) {
      return normalizedGroups;
    }

    return normalizedGroups
      .map((group) => ({
        label: group.label,
        options: group.options.filter((item) => {
          const haystack = [item.label, item.value, ...(item.keywords ?? [])].join(" ").toLowerCase();
          return haystack.includes(query);
        })
      }))
      .filter((group) => group.options.length > 0);
  });

  const flatOptions = $derived.by<FlatOption[]>(() => {
    const result: FlatOption[] = [];
    filteredGroups.forEach((group, groupIndex) => {
      group.options.forEach((option, optionIndex) => {
        result.push({
          uid: `${fieldId}-opt-${groupIndex}-${optionIndex}-${option.value}`,
          groupLabel: group.label,
          option
        });
      });
    });
    return result;
  });

  const allFlatOptions = $derived.by<FlatOption[]>(() => {
    const result: FlatOption[] = [];
    normalizedGroups.forEach((group, groupIndex) => {
      group.options.forEach((option, optionIndex) => {
        result.push({
          uid: `${fieldId}-all-opt-${groupIndex}-${optionIndex}-${option.value}`,
          groupLabel: group.label,
          option
        });
      });
    });
    return result;
  });

  const selectedValues = $derived.by<string[]>(() => {
    if (multiple) {
      return Array.isArray(value) ? value : value ? [String(value)] : [];
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? [value[0]] : [];
    }
    return value ? [String(value)] : [];
  });

  const selectedLabels = $derived.by(() => {
    const dictionary = new Map(allFlatOptions.map((entry) => [entry.option.value, entry.option.label]));
    return selectedValues.map((item) => dictionary.get(item) ?? item);
  });

  const displayText = $derived.by(() => {
    if (selectedLabels.length === 0) {
      return placeholder;
    }
    if (!multiple) {
      return selectedLabels[0];
    }
    return selectedLabels.join(", ");
  });

  const activeDescendant = $derived(
    isOpen && activeIndex >= 0 && activeIndex < flatOptions.length ? flatOptions[activeIndex]?.uid : undefined
  );

  const firstEnabledIndex = () => flatOptions.findIndex((entry) => !entry.option.disabled);

  const getNextEnabledIndex = (from: number, direction: 1 | -1) => {
    if (flatOptions.length === 0) {
      return -1;
    }
    let cursor = from;
    for (let steps = 0; steps < flatOptions.length; steps += 1) {
      cursor = (cursor + direction + flatOptions.length) % flatOptions.length;
      if (!flatOptions[cursor]?.option.disabled) {
        return cursor;
      }
    }
    return -1;
  };

  const setActiveIndex = async (next: number) => {
    activeIndex = next;
    if (next < 0 || next >= flatOptions.length) {
      return;
    }
    await tick();
    const node = optionRefs[flatOptions[next]?.uid];
    node?.scrollIntoView({ block: "nearest" });
  };

  const syncActiveWithSelection = async () => {
    const selected = selectedValues[0];
    if (!selected) {
      await setActiveIndex(firstEnabledIndex());
      return;
    }
    const selectedIndex = flatOptions.findIndex((entry) => entry.option.value === selected && !entry.option.disabled);
    await setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex());
  };

  const closeListbox = (focusTrigger = false) => {
    isOpen = false;
    searchQuery = "";
    activeIndex = -1;
    if (focusTrigger) {
      triggerEl?.focus();
    }
  };

  const openListbox = async () => {
    if (disabled) {
      return;
    }
    isOpen = true;
    await syncActiveWithSelection();
    if (searchable) {
      await tick();
      searchEl?.focus();
    }
  };

  const toggleListbox = async () => {
    if (isOpen) {
      closeListbox();
      return;
    }
    await openListbox();
  };

  const commitValue = (nextValues: string[]) => {
    if (multiple) {
      value = nextValues;
      return;
    }
    value = nextValues[0] ?? "";
  };

  const toggleOption = (item: SelectOption) => {
    if (item.disabled) {
      return;
    }
    if (!multiple) {
      commitValue([item.value]);
      closeListbox(true);
      return;
    }
    const set = new Set(selectedValues);
    if (set.has(item.value)) {
      set.delete(item.value);
    } else {
      set.add(item.value);
    }
    commitValue(Array.from(set));
  };

  const isSelected = (item: SelectOption) => selectedValues.includes(item.value);

  const runTypeahead = async (key: string) => {
    if (searchable) {
      return;
    }
    if (typeaheadTimer) {
      clearTimeout(typeaheadTimer);
    }
    typeaheadBuffer = `${typeaheadBuffer}${key.toLowerCase()}`;
    typeaheadTimer = setTimeout(() => {
      typeaheadBuffer = "";
    }, 450);

    const match = flatOptions.findIndex(
      (entry) =>
        !entry.option.disabled && entry.option.label.toLowerCase().startsWith(typeaheadBuffer)
    );
    if (match >= 0) {
      await setActiveIndex(match);
    }
  };

  const handleListKeydown = async (event: KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        await openListbox();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeListbox(true);
      return;
    }
    if (event.key === "Tab") {
      closeListbox();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      await setActiveIndex(firstEnabledIndex());
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      for (let index = flatOptions.length - 1; index >= 0; index -= 1) {
        if (!flatOptions[index]?.option.disabled) {
          await setActiveIndex(index);
          break;
        }
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = getNextEnabledIndex(activeIndex >= 0 ? activeIndex : -1, 1);
      await setActiveIndex(next);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = getNextEnabledIndex(activeIndex >= 0 ? activeIndex : 0, -1);
      await setActiveIndex(next);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      if (activeIndex < 0 || activeIndex >= flatOptions.length) {
        return;
      }
      event.preventDefault();
      toggleOption(flatOptions[activeIndex].option);
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      await runTypeahead(event.key);
    }
  };

  const removeSelected = (item: string) => {
    if (!multiple || disabled) {
      return;
    }
    commitValue(selectedValues.filter((valueItem) => valueItem !== item));
  };

  const optionRef = (node: HTMLButtonElement, uid: string) => {
    optionRefs[uid] = node;
    return {
      update(nextUid: string) {
        if (nextUid !== uid) {
          delete optionRefs[uid];
          uid = nextUid;
        }
        optionRefs[uid] = node;
      },
      destroy() {
        delete optionRefs[uid];
      }
    };
  };

  onMount(() => {
    const formEl = rootEl?.closest("form");

    const onDocumentPointerDown = (event: PointerEvent) => {
      if (!isOpen) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!rootEl?.contains(target)) {
        closeListbox();
      }
    };
    const onFormReset = () => {
      queueMicrotask(() => {
        value = cloneCurrentValue(initialValue);
        closeListbox();
      });
    };

    document.addEventListener("pointerdown", onDocumentPointerDown);
    formEl?.addEventListener("reset", onFormReset);
    return () => {
      document.removeEventListener("pointerdown", onDocumentPointerDown);
      formEl?.removeEventListener("reset", onFormReset);
      if (typeaheadTimer) {
        clearTimeout(typeaheadTimer);
      }
    };
  });
</script>

<div
  class="ui-select{className ? ` ${className}` : ''}"
  data-open={isOpen ? "true" : "false"}
  bind:this={rootEl}
>
  <button
    {...rest}
    id={fieldId}
    type="button"
    class="ui-input ui-select__trigger{invalid ? ' ui-input--error' : ''}"
    role="combobox"
    aria-expanded={isOpen}
    aria-controls={listboxId}
    aria-haspopup="listbox"
    aria-label={ariaLabel}
    aria-invalid={invalid ? true : rest["aria-invalid"]}
    aria-activedescendant={activeDescendant}
    disabled={disabled}
    onclick={toggleListbox}
    onkeydown={handleListKeydown}
    bind:this={triggerEl}
  >
    {#if multiple && selectedValues.length > 0}
      <span class="ui-select__chips" aria-hidden="true">
        {#each selectedLabels.slice(0, 2) as chipLabel}
          <span class="ui-select__chip">{chipLabel}</span>
        {/each}
        {#if selectedLabels.length > 2}
          <span class="ui-select__chip">+{selectedLabels.length - 2}</span>
        {/if}
      </span>
      <span class="ui-select__text">{displayText}</span>
    {:else}
      <span class="ui-select__text{selectedValues.length === 0 ? ' ui-select__text--placeholder' : ''}">
        {displayText}
      </span>
    {/if}
    <span class="ui-select__chevron" aria-hidden="true">
      <svg class="ui-select__chevron-svg" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <path fill="currentColor" d="M2.5 4.5 9.5 4.5 6 9z" />
      </svg>
    </span>
  </button>

  {#if isOpen}
    <div class="ui-select__panel ui-card" role="presentation">
      {#if searchable}
        <div class="ui-select__search-wrap">
          <input
            id={searchboxId}
            class="ui-input ui-select__search"
            type="text"
            placeholder="Поиск..."
            bind:value={searchQuery}
            onkeydown={handleListKeydown}
            bind:this={searchEl}
          />
        </div>
      {/if}
      <ul
        id={listboxId}
        class="ui-select__list"
        role="listbox"
        aria-multiselectable={multiple ? true : undefined}
        tabindex="-1"
      >
        {#if flatOptions.length === 0}
          <li class="ui-select__empty" aria-live="polite">{emptyText}</li>
        {:else}
          {#each filteredGroups as group, groupIndex}
            {#if group.label}
              <li class="ui-select__group" role="presentation">{group.label}</li>
            {/if}
            {#each group.options as item, optionIndex}
              {@const optionUid = `${fieldId}-opt-${groupIndex}-${optionIndex}-${item.value}`}
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  id={optionUid}
                  class="ui-select__option{isSelected(item) ? ' is-selected' : ''}{activeDescendant === optionUid ? ' is-active' : ''}"
                  aria-selected={isSelected(item)}
                  disabled={item.disabled}
                  onclick={() => toggleOption(item)}
                  onmouseenter={() => {
                    const hoveredIndex = flatOptions.findIndex((entry) => entry.uid === optionUid);
                    if (hoveredIndex >= 0) {
                      activeIndex = hoveredIndex;
                    }
                  }}
                  use:optionRef={optionUid}
                >
                  {#if multiple}
                    <span class="ui-select__check" aria-hidden="true">{isSelected(item) ? "✓" : ""}</span>
                  {/if}
                  <span>{item.label}</span>
                </button>
              </li>
            {/each}
          {/each}
        {/if}
      </ul>
    </div>
  {/if}

  {#if multiple && name}
    <select
      class="ui-select__native-proxy"
      name={name}
      multiple
      required={required}
      disabled={disabled}
      aria-hidden="true"
    >
      {#each normalizedGroups as group}
        {#if group.label}
          <optgroup label={group.label}>
            {#each group.options as item}
              <option value={item.value} selected={selectedValues.includes(item.value)}>{item.label}</option>
            {/each}
          </optgroup>
        {:else}
          {#each group.options as item}
            <option value={item.value} selected={selectedValues.includes(item.value)}>{item.label}</option>
          {/each}
        {/if}
      {/each}
    </select>
  {:else if name}
    <select
      class="ui-select__native-proxy"
      name={name}
      required={required}
      disabled={disabled}
      aria-hidden="true"
    >
      <option value=""></option>
      {#each normalizedGroups as group}
        {#if group.label}
          <optgroup label={group.label}>
            {#each group.options as item}
              <option value={item.value} selected={selectedValues[0] === item.value}>{item.label}</option>
            {/each}
          </optgroup>
        {:else}
          {#each group.options as item}
            <option value={item.value} selected={selectedValues[0] === item.value}>{item.label}</option>
          {/each}
        {/if}
      {/each}
    </select>
  {/if}

  {#if multiple && selectedValues.length > 0}
    <div class="ui-select__selected-list" aria-label="Выбранные значения">
      {#each selectedValues as selectedItem, index}
        <button
          type="button"
          class="ui-select__selected-chip"
          onclick={() => removeSelected(selectedItem)}
          disabled={disabled}
          aria-label={`Убрать ${selectedItem}`}
        >
          {selectedLabels[index] ?? selectedItem}
          <span aria-hidden="true">×</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
