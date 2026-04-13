<script lang="ts">
  import type { Snippet } from "svelte";

  export type FormFieldA11y = {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  };

  let {
    label,
    hint = "",
    error = "",
    required = false,
    control
  } = $props<{
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    control: Snippet<[FormFieldA11y]>;
  }>();

  const baseId = `fld-${Math.random().toString(36).slice(2, 9)}`;
  const inputId = `${baseId}-input`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-err`;

  const describedBy = $derived(
    [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined
  );
  const ariaInvalid = $derived(Boolean(error));

  const a11y = $derived<FormFieldA11y>({
    id: inputId,
    "aria-invalid": ariaInvalid,
    "aria-describedby": describedBy
  });
</script>

<div class="ui-form-field">
  <label class="ui-form-field__label" for={inputId}>
    {#if required}<span class="ui-form-field__req" aria-hidden="true">*</span>{/if}
    {label}
  </label>
  {@render control(a11y)}
  {#if hint}
    <p class="ui-form-field__hint" id={hintId}>{hint}</p>
  {/if}
  {#if error}
    <p class="ui-form-field__error" id={errorId} role="alert">{error}</p>
  {/if}
</div>
