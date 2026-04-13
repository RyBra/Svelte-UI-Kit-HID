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
</script>

<div
  class="ui-tabs{className ? ` ${className}` : ''}"
  style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr));`}
  role="tablist"
  aria-label={ariaLabel}
>
  {#each items as item (item.id)}
    <button
      type="button"
      role="tab"
      id={`tab-${item.id}`}
      aria-selected={value === item.id}
      aria-controls={`panel-${item.id}`}
      disabled={item.disabled}
      class:active={value === item.id}
      onclick={() => onTabChange(item.id)}
    >
      {item.label}
    </button>
  {/each}
</div>
