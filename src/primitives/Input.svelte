<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  type InputVariant = "default" | "money";

  /** Digits + optional single decimal (`,` normalized to `.`), no `e`/signs/spaces. */
  function sanitizeMoneyInput(raw: string, maxFrac: number): string {
    let s = raw.replace(/[\s\u00a0\u202f]/g, "").replace(/[₽€$£]/g, "");
    s = s.replace(/,/g, ".").replace(/[^\d.]/g, "");
    if (s === "") return "";
    const firstDot = s.indexOf(".");
    if (firstDot === -1) {
      return normalizeMoneyInt(s);
    }
    let intRaw = s.slice(0, firstDot).replace(/\./g, "");
    let fracRaw = s.slice(firstDot + 1).replace(/\./g, "");
    fracRaw = fracRaw.slice(0, maxFrac);
    if (intRaw === "") intRaw = "0";
    else intRaw = normalizeMoneyInt(intRaw);
    const trailingDot = fracRaw.length === 0 && s.endsWith(".");
    if (trailingDot) return `${intRaw}.`;
    if (fracRaw.length === 0) return intRaw;
    return `${intRaw}.${fracRaw}`;
  }

  function normalizeMoneyInt(intPart: string): string {
    if (intPart === "") return "";
    const trimmed = intPart.replace(/^0+/, "");
    return trimmed === "" ? "0" : trimmed;
  }

  let {
    value = $bindable(),
    size = "md",
    error = false,
    variant = "default",
    currency = "",
    maxFractionDigits = 2,
    class: className = "",
    type: typeAttr,
    oninput,
    ...rest
  } = $props<
    Omit<HTMLInputAttributes, "size" | "class" | "value" | "type" | "oninput"> & {
      value?: HTMLInputAttributes["value"];
      size?: "md" | "lg";
      error?: boolean;
      variant?: InputVariant;
      /** Suffix inside the field (e.g. `₽`). Only when `variant="money"`. */
      currency?: string;
      maxFractionDigits?: number;
      class?: string;
      type?: HTMLInputAttributes["type"];
      oninput?: HTMLInputAttributes["oninput"];
    }
  >();

  const invalid = $derived(
    error === true || rest["aria-invalid"] === true || rest["aria-invalid"] === "true"
  );

  const inputClass = $derived(
    `ui-input${size === "lg" ? " ui-input--lg" : ""}${invalid ? " ui-input--error" : ""}${variant === "money" ? " ui-input--money" : ""}${className ? ` ${className}` : ""}`
  );

  const resolvedType = $derived(variant === "money" ? ("text" as const) : typeAttr);

  function onMoneyInput(event: Event) {
    const el = event.currentTarget as HTMLInputElement;
    const raw = el.value;
    const next = sanitizeMoneyInput(raw, maxFractionDigits);
    value = next as HTMLInputAttributes["value"];
    oninput?.(event);
  }
</script>

{#if variant === "money" && currency}
  <span class="ui-input-money">
    <input
      {...rest}
      bind:value
      type={resolvedType}
      inputmode="decimal"
      autocomplete="off"
      class={`${inputClass} ui-input-money__field`}
      aria-invalid={invalid ? true : rest["aria-invalid"]}
      oninput={onMoneyInput}
    />
    <span class="ui-input-money__suffix" aria-hidden="true">{currency}</span>
  </span>
{:else}
  <input
    {...rest}
    bind:value
    type={resolvedType}
    class={inputClass}
    aria-invalid={invalid ? true : rest["aria-invalid"]}
    oninput={variant === "money" ? onMoneyInput : oninput}
    inputmode={variant === "money" ? "decimal" : undefined}
    autocomplete={variant === "money" ? "off" : undefined}
  />
{/if}
